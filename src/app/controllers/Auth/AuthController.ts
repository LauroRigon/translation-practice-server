import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { Request, Response } from 'express'

import User from '@models/User'

export function generateToken (params: Object) {
  return jwt.sign(params, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: 86400
  })
}

class AuthController {
  public async register (req: Request, res: Response): Promise<Response> {
    const userExists = await User.findOne({ email: req.body.email })

    if (userExists) {
      return res.status(400).json({ message: 'User already exists!' })
    }

    try {
      const user = await User.create({
        email: req.body.email,
        password: await bcrypt.hash(req.body.password, 10)
      })
      const freshUser = await user.save()
      freshUser.password = undefined

      return res.status(201).send({ user: freshUser, token: generateToken(freshUser.toJSON()) })
    } catch (error) {
      return res.status(500).json({ message: error.message })
    }
  }

  public async login (req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body

    try {
      const user = await User.findOne({ email }).select('+password')

      if (!user) {
        return res.status(404).json({ message: 'User not found!' })
      }

      const passCheck = await bcrypt.compare(password, user.password)
      if (!passCheck) {
        return res.status(401).json({ message: 'Invalid password' })
      }

      user.password = undefined

      return res.json({ user, token: generateToken(user.toJSON()) })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  }
}

export default new AuthController()
