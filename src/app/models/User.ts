import { Schema, model, Document } from 'mongoose'

export interface UserInterface extends Document {
  email: string,
  password: string,
}

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false
  }
}, {
  timestamps: true
})

export default model<UserInterface>('User', UserSchema)
