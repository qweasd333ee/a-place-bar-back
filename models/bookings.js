import { Schema, model, ObjectId } from 'mongoose'

const bookingSchema = new Schema({
  s_id: {
    type: ObjectId,
    ref: 'seats',
    required: [true, '缺少座位']
  },
  quantity: {
    type: Number,
    required: [true, '缺少訂位人數']
  },
  date: {
    type: Date,
    required: [true, '缺少訂位日期、時間']
  },
  name: {
    type: String,
    require: [true, '缺少姓名']
  },
  phone: {
    type: String,
    required: [true, '缺少電話']
  },
  email: {
    type: String,
    required: [true, '缺少信箱']
  }
})

const schema = new Schema({
  u_id: {
    type: ObjectId,
    ref: 'users',
    required: [true, '缺少使用者']
  },
  seats: {
    type: [bookingSchema],
    default: []
  }
}, { versionKey: false })

export default model('bookings', schema)
