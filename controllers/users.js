import users from '../models/users.js'
import products from '../models/products.js'
import seats from '../models/seats.js'
import jwt from 'jsonwebtoken'

// 註冊 --------------------------------------------------------------------------------------
export const register = async (req, res) => {
  try {
    await users.create({
      account: req.body.account,
      password: req.body.password,
      email: req.body.email
    })
    res.status(200).json({ success: true, message: '註冊成功' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).json({ success: false, message: '帳號重複' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 登入 --------------------------------------------------------------------------------------
export const login = async (req, res) => {
  try {
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).json({
      success: true,
      message: '登入成功',
      result: {
        token,
        account: req.user.account,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        address: req.user.address,
        gender: req.user.gender,
        age: req.user.age,
        creitcard: req.user.creitcard,
        CartProduct: req.user.CartProduct.reduce((total, current) => total + current.quantity, 0),
        CartSeat: req.user.CartSeat.reduce((total, current) => total + current.quantity, 0),
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 登出 --------------------------------------------------------------------------------------
export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).json({ success: true, message: '' })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// token 舊換新 --------------------------------------------------------------------------------------
export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 用保存的 JWT 要使用者資料 -----------------------------------------------------------------------------------
export const getUser = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: '',
      result: {
        _id: req.user._id,
        account: req.user.account,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        address: req.user.address,
        gender: req.user.gender,
        age: req.user.age,
        creitcard: req.user.creitcard,
        CartProduct: req.user.CartProduct.reduce((total, current) => total + current.quantity, 0),
        CartSeat: req.user.CartSeat.reduce((total, current) => total + current.quantity, 0),
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 管理取所有會員資料
export const getAllUser = async (req, res) => {
  try {
    const result = await users.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '未知錯誤' })
  }
}

// 修改會員資料
export const editUser = async (req, res) => {
  try {
    const result = await users.findByIdAndUpdate(req.params.id, {
      account: req.body.account,
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
      gender: req.body.gender,
      age: req.body.age,
      creitcard: req.body.creitcard
    }, { new: true })
    if (!result) {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(200).json({ success: true, message: '', result })
    }
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else if (error.name === 'CastError') {
      res.status(404).json({ success: false, message: '找不到' })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

export const deleteUser = async (req, res) => {
  try {
    await users.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '未知錯誤' })
  }
}

// 新增、修改商品購物車 ------------------------------------------------------------------------------------------
export const editCartProduct = async (req, res) => {
  try {
    // 找購物車有沒有此商品
    const idx = req.user.CartProduct.findIndex(CartProduct => CartProduct.p_id.toString() === req.body.p_id)
    if (idx > -1) {
      // 如果有，檢查新數量是多少
      const quantity = req.user.CartProduct[idx].quantity + parseInt(req.body.quantity)
      if (quantity <= 0) {
        // 如果新數量小於 0，從購物車陣列移除
        req.user.CartProduct.splice(idx, 1)
      } else {
        // 如果新數量大於 0，修改購物車陣列數量
        req.user.CartProduct[idx].quantity = quantity
      }
    } else {
      // 如果購物車內沒有此商品，檢查商品是否存在
      const product = await products.findById(req.body.p_id)
      // 如果不存在，回應 404
      if (!product || !product.sell) {
        res.status(404).send({ success: false, message: '找不到' })
        return
      }
      // 如果存在，加入購物車陣列
      req.user.CartProduct.push({
        p_id: req.body.p_id,
        quantity: parseInt(req.body.quantity)
      })
    }
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: req.user.CartProduct.reduce((total, current) => total + current.quantity, 0) })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 新增、修改座位購物車 ------------------------------------------------------------------------------------------
export const editCartSeat = async (req, res) => {
  try {
    console.log(req.body)
    // 找購物車有沒有此座位
    const idx = req.user.CartSeat.findIndex(CartSeat => CartSeat.s_id.toString() === req.body.s_id.toString())
    if (idx > -1) {
      // 如果有，檢查新數量是多少
      const quantity = req.user.CartSeat[idx].quantity + parseInt(req.body.quantity)
      if (quantity <= 0) {
        // 如果新數量小於 0，從購物車陣列移除
        req.user.CartSeat.splice(idx, 1)
      } else {
        // 如果新數量大於 0，修改購物車陣列數量
        req.user.CartSeat[idx].quantity = quantity
      }
    } else {
      // 如果購物車內沒有此座位，檢查座位是否存在
      const seat = await seats.findById(req.body.s_id)
      console.log(seat)
      // 如果不存在，回應 404
      if (!seat || !seat.book) {
        res.status(404).send({ success: false, message: '找不到' })
        return
      }
      // 如果存在，加入購物車陣列
      req.user.CartSeat.push({
        s_id: req.body.s_id,
        quantity: parseInt(req.body.quantity),
        date: req.body.date,
        name: req.body.name,
        phone: req.body.phone,
        email: req.body.email
      })
    }
    await req.user.save()
    res.status(200).json({ success: true, message: '', result: req.user.CartSeat.reduce((total, current) => total + current.quantity, 0) })
  } catch (error) {
    console.log(error)
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 查詢商品
export const getCartProduct = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'CartProduct').populate('CartProduct.p_id')
    res.status(200).json({ success: true, message: '', result: result.CartProduct })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}

// 查詢座位
export const getCartSeat = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'CartSeat').populate('CartSeat.s_id')
    res.status(200).json({ success: true, message: '', result: result.CartSeat })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
