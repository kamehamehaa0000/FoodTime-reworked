import multer from 'multer'
import path from 'path'
import fs from 'fs'
import os from 'os'

const tempDir = path.join(os.tmpdir(), 'uploads')

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true })
}

const diskStorage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, tempDir)
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: diskStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const filetypes = /jpeg|jpg|png|gif/
    const mimetype = filetypes.test(file.mimetype)
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    )

    if (mimetype && extname) {
      return callback(null, true)
    } else {
      callback(new Error('Only images are allowed!'))
    }
  },
})

export default upload
