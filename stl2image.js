const stl2image = require('stljs')
const resolve = require('path').resolve
const s3 = require('s3')


// destination on disk to save the png we create
const IMAGE_DESTINATION = resolve('./file_db/png/')

module.exports = async (req, res, next) => {
var client = s3.createClient({
  s3Options: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY
    // any other options are passed to new AWS.S3() 
    // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property 
  },
});
console.log(client)
	console.log('☁️☁️☁️☁️  stljs req.file', req.file)
	// get stl file from disk
	// stl2image only works with files, instead of wasting time getting stuck
	// im just gonna implement saving the file first grrrr
	const STL_FILE = req.file
	console.log({STL_FILE})

	const stlFilePath = STL_FILE.path
	console.log({stlFilePath})

	var imageKey = `${STL_FILE.filename.slice(0, -4)}`

	var imagePath = `${IMAGE_DESTINATION}/${imageKey}.png`
	console.log

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
					var params = {
					localFile: imagePath,
					
					s3Params: {
						Bucket: "farlab-images",
						Key: imageKey,
						// other options supported by putObject, except Body and ContentLength. 
						// See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property 
					},
					};
					var uploader = client.uploadFile(params);
					uploader.on('error', function(err) {
					console.error("unable to upload:", err.stack);
					});
					uploader.on('progress', function() {
					console.log("progress", uploader.progressMd5Amount,
								uploader.progressAmount, uploader.progressTotal);
					});
					uploader.on('end', function() {
					console.log("done uploading");
					});

					
				}
			})
	});	

	const povRes = await promise
	res.sendFile(imagePath)

}
