import contacts from '../models/contacts.js'

// 新增留言
export const createContact = async (req, res) => {
  try {
    const result = await contacts.create({
      name: req.body.name,
      email: req.body.email,
      description: req.body.description
    })
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: error.errors[Object.keys(error.errors)[0]].message })
    } else {
      res.status(500).json({ success: false, message: '未知錯誤' })
    }
  }
}

// 取所有的留言，管理員專用
export const getAllContacts = async (req, res) => {
  try {
    const result = await contacts.find()
    res.status(200).json({ success: true, message: '', result })
  } catch (error) {
    res.status(500).json({ success: false, message: '未知錯誤' })
  }
}
