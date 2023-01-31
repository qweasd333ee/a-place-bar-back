import { Schema, model } from 'mongoose'

const schema = new Schema({
  name: {
    type: String,
    required: [true, '缺少商品名稱']
  },
  price: {
    type: Number,
    min: [0, '價格錯誤'],
    required: [true, '缺少商品價格']
  },
  description: {
    type: String,
    required: [true, '缺少商品說明']
  },
  image: {
    type: String,
    required: [true, '缺少商品圖片']
  },
  sell: {
    type: Boolean,
    required: [true, '缺少商品狀態']
  },
  category: {
    type: String,
    required: [true, '缺少商品分類'],
    enum: {
      values: ['shot', '茶酒', '特調', '奶酒', '啤酒', '無酒精', '拼盤', '單點'],
      message: '商品分類錯誤'
    }
  }
}, { versionKey: false })

export default model('products', schema)
