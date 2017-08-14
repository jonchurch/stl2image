
const express = require('express')
const path = require('path')
const multer = require('multer')
const resolve = require('path').resolve

const stl2image = require('./stl2image')
const app = express()

const multerOptions = {
	storage: multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, resolve('file_db/stl/'))
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '.stl') //Appending .stl
  }
}),
  fileFilter(req, file, next) {
    const isStl = file.mimetype.startsWith('application/');
    if(isStl) {
      next(null, true);
    } else {
      next(null, false);
    }
  }
}

app.use(multer(multerOptions).single('file'))

// after middleware, serve routes
app.use('/', stl2image)

app.set('port', process.env.PORT || 80)
const server = app.listen(app.get('port'), () => {
	console.log(`Express now running on PORT ${server.address().port}`)
})

