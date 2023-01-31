import { Schema, model } from 'mongoose'
import validator from 'validator'

// 資料庫欄位設定
const schema = new Schema(
  {
    // 欄位名稱
    account: {
      // 資料型態
      type: String,
      // 必填欄位、錯誤訊息
      required: [true, '缺少帳號欄位'],
      // 文字長度限制
      minlength: [4, '帳號必須大於 4 個字'],
      maxlength: [20, '帳號必須小於 20 個字'],
      // 唯一性驗證
      unique: true,
      // 正則表達式
      match: [/^[a-zA-Z0-9]+$/, '帳號只能包含英數字'],
      // 自動去除前後空白
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: [true, '缺少信箱'],
      unique: true,
      // 自訂驗證
      validate: {
        // 驗證 function
        validator (email) {
          return validator.isEmail(email)
        },
        // 錯誤訊息
        message: '信箱格式錯誤'
      }
    },
    tokens: {
      type: [String],
      default: []
    }
  },
  { versionKey: false }
)

// model('collection 名稱', schema)
export default model('users', schema)
