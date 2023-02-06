import passport from 'passport'
import bcrypt from 'bcrypt'
import passportLocal from 'passport-local'
import passportJWT from 'passport-jwt'
import users from '../models/users.js'

// 使用 Local 策略寫 login 方式
passport.use('login', new passportLocal.Strategy({
  // 預設帳密欄位是 username 和 password
  // 修改成 account 和 password
  usernameField: 'account',
  passwordField: 'password'
}, async (account, password, done) => {
  // done(錯誤, 傳到下一步的資料, 傳到下一步 info 的內容)
  try {
    // 找有沒有符合傳入資料的使用者
    const user = await users.findOne({ account })
    // 如果沒有找到 => 帳號不存在
    if (!user) {
      return done(null, false, { message: '帳號不存在' })
    }
    // 如果有找到 => 把現在的 password 跟 資料庫裡的密碼做比較
    // 要加密是因為一樣的東西做加密會有一樣的結果
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: '密碼錯誤' })
    }
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}))

// 使用 JWT 策略寫 jwt 方式
passport.use('jwt', new passportJWT.Strategy({
  // JWT 從 AuthHeaderAsBearerToken 來的
  jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
  // JWT 的 SECRET 是什麼 => 要用它做解譯
  secretOrKey: process.env.JWT_SECRET,
  // 把 Req 物件傳入下面的 Callback => 才可以取到 header 的資訊
  passReqToCallback: true,
  // 忽略過期檢查
  ignoreExpiration: true
}, async (req, payload, done) => {
  // 檢查有沒有過期
  // payload 解譯出來的過期時間單位是秒，JS 的 Date.now() 單位是毫秒，所以要 * 1000
  const expired = payload.exp * 1000 < Date.now()
  /*
    http://localhost:4000/users/me?a=b
    app.use('/users', userRoute)
    router.get('/me')
    console.log(req.originalUrl) ---> /users/me?a=b
    console.log(req.baseUrl) ---> /users
    console.log(req.path) ---> /me
    console.log(req.baseUrl + req.path) ---> /users/me
  */
  if (expired && req.originalUrl !== '/users/extend' && req.originalUrl !== '/users/logout') {
    return done(null, false, { message: '登入逾時' })
  }
  // 去 header 拉 token 出來
  const token = req.headers.authorization.split(' ')[1]
  try {
    // 去資料庫找有沒有使用者符合解譯後的 id 與相同的 token
    const user = await users.findById(payload._id)
    if (!user) {
      return done(null, false, { message: '使用者不存在' })
    }
    if (user.tokens.indexOf(token) === -1) {
      return done(null, false, { message: 'JWT 無效' })
    }
    return done(null, { user, token })
  } catch (error) {
    return done(error, false)
  }
}))
