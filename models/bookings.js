import { Schema, model, ObjectId } from 'mongoose'

const bookingSchema = new Schema({
  s_id: {
    type: ObjectId,
    ref: 'seats',
    required: [true, '缺少座位']
  },
  Quantity: {
    type: Number,
    required: [true, '缺少人數']
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
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { versionKey: false })

export default model('bookings', schema)
