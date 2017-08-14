const stl2image = require('stljs')
const resolve = require('path').resolve

// destination on disk to save the png we create
const IMAGE_DESTINATION = resolve('./file_db/png/')

module.exports = async (req, res, next) => {
	console.log('☁️☁️☁️☁️  stljs req.file', req.file)
	// get stl file from disk
	// stl2image only works with files, instead of wasting time getting stuck
	// im just gonna implement saving the file first grrrr
	const STL_FILE = req.file
	console.log({STL_FILE})

	const stlFilePath = STL_FILE.path
	console.log({stlFilePath})

	const imagePath = `${IMAGE_DESTINATION}/${STL_FILE.filename.slice(0, -4)}.png` 

	console.log({IMAGE_DESTINATION})
	console.log({imagePath})

	const promise = new Promise(function (resolve, reject) {
		stl2image.imageify(
			stlFilePath,
			{width: 200, height: 200, dst: imagePath },
			function(err, povOutput, name) {
				if (err) {
					console.log('❗❗❗stl2js err: ', err)
					reject(err)
					res.json(err)
				} else {
					// res.send(povOutput)
					resolve(povOutput)

					
				}
			})
	});	

	const povRes = await promise
	res.sendFile(imagePath)

}
