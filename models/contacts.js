import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '缺少姓名']
  },
  time: {
    type: Date,
    default: Date.now
  },
  email: {
    type: String,
    required: [true, '缺少信箱']
  },
  description: {
    type: String,
    required: [true, '缺少內容']
  }
}, { versionKey: false })

export default model('contacts', schema)
