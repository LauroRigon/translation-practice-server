import jsonwebtoken from 'jsonwebtoken'
import { UserInterface } from '@models/User'
import { Response } from 'express'
import { AuthRequest } from '../support/AuthRequest'

export default function (req: AuthRequest, res: Response, next: Function) {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).send({ error: 'Authorization token required' })
  }

  const parts = authHeader.split(' ')

  if (parts.length !== 2) {
    return res.status(401).send({ error: 'Invalid token' })
  }

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).send({ error: 'Token malformatted' })
  }

  jsonwebtoken.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, decoded: UserInterface) => {
    if (error) return res.status(401).send({ error: 'Invalid token' })

    req.user = decoded
    return next()
  })
}
