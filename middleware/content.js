export default (type) => {
  return (req, res, next) => {
    // 檢查 headers 的資料型態是不是 content-type
    if (!req.headers['content-type'] || !req.headers['content-type'].includes(type)) {
      res.status(400).json({ success: false, message: '格式錯誤' })
      return
    }
    next()
  }
}
