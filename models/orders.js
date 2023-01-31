import { Schema, model, ObjectId } from 'mongoose'

const schema = new Schema({
  user: {
    type: ObjectId,
    ref: 'users',
    required: [true, '缺少使用者']
  },
  product: {
    type: [
      {
        product: {
          type: ObjectId,
          ref: 'products',
          required: [true, '缺少商品']
        },
        quantity: {
          type: Number,
          required: [true, '缺少數量']
        }
      }
    ],
    default: []
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false })

export default model('orders', schema)
