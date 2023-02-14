import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '缺少座位編號']
  },
  floor: {
    type: String,
    required: [true, '缺少座位樓層']
  },
  seatNumber: {
    type: Number,
    required: [true, '缺少座位數量']
  },
  image: {
    type: String,
    required: [true, '缺少樓層圖']
  },
  using: {
    type: Boolean
  },
  book: {
    type: Boolean,
    required: [true, '缺少是否開放訂位']
  },
  category: {
    type: String,
    required: [true, '缺少座位分類'],
    enum: {
      values: ['吧檯', '小桌', '中桌', '大桌'],
      message: '座位分類錯誤'
    }
  }
}, { versionKey: false })

export default model('seats', schema)
