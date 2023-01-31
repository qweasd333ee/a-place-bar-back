import { Schema, model, ObjectId, Error } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'

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
      // 自訂驗證
      validate: {
        // 驗證 function
        validator (account) {
          return validator.isAlphanumeric(account)
        },
        // 錯誤訊息
        message: '帳號只能包含英數字'
      },
      // 正則表達式
      // match: [/^[a-zA-Z0-9]+$/, '帳號只能包含英數字'],
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
      validate: {
        validator (email) {
          return validator.isEmail(email)
        },
        message: '信箱格式錯誤'
      }
    },
    tokens: {
      type: [String],
      default: []
    },
    cart: {
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
    role: {
      type: Number,
      // 0 = 使用者
      // 1 = 管理員
      default: 0
    }
  }, { versionKey: false })

schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else if (user.password.length < 4) {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度過短' }))
      next(error)
      return
    } else if (user.password.length > 20) {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度過長' }))
      next(error)
      return
    }
  }
  next()
})

schema.pre('findOneAndUpdate', function (next) {
  const user = this._update
  if (user.isModified('password')) {
    if (user.password.length >= 4 && user.password.length <= 20) {
      user.password = bcrypt.hashSync(user.password, 10)
    } else if (user.password.length < 4) {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度過短' }))
      next(error)
      return
    } else if (user.password.length > 20) {
      const error = new Error.ValidationError(null)
      error.addError('password', new Error.ValidatorError({ message: '密碼長度過長' }))
      next(error)
      return
    }
  }
  next()
})

// model('collection 名稱', schema)
export default model('users', schema)
