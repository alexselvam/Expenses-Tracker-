// packages
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const multer = require("multer");
const sharp = require("sharp");
const moment = require('moment');

// files
const commonService = require("./msjoromicnveesc");

const s3config = require('../oafcgeodfrnnlritoi/tjuyeCRerhdSt')

// Configure S3 client
const s3bucket = new S3Client({
    region: "us-east-1",
    credentials: {
        accessKeyId: commonService.s3decryption(s3config["snc=J25TjphLQNEz=FKk3tYe"]),
        secretAccessKey: commonService.s3decryption(s3config["ixAp9Lc7MZOPRlp=RKf/S=rz"]),
    },
});

// models
const storage = multer.diskStorage({
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
    limits: { fileSize: 2097152 },
    destination: function (req, file, cb) {
        cb(null, '/tmp');
    },
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 2097152 },
    fileFilter: function (req, file, cb) {
        const mimeTypes = ['jpg', 'jpeg', 'png']
        const fileExt = file.originalname.split('.')
        if (fileExt.length > 2) {
            return cb(new Error("Something went wrong, Please try again later"))
        } else {
            const index = mimeTypes.findIndex(a => a == fileExt[1])
            if (index != -1) {
                cb(null, file.originalname);
            } else {
                return cb(new Error("Invalid file type. Only JPEG, JPG, PNG files are allowed"))
            }
        }
    },
});

exports.single_upload = (type, imgName, fileNameArray, req, res, callback) => {
    upload[type](imgName)(req, res, async (err) => {
        if (err) {
            callback({ status: false, message: 'Please upload a valid image file.' })
        } else if (err instanceof multer.MulterError) {
            callback({ status: false, message: 'Please upload a valid image file.' })
        } else if (type == 'single') {
            if (typeof req.file != 'undefined' && req.file != undefined && req.file.path != "") {
                await uploadSingle(req.file, callback);
            } else {
                callback({ status: true, data: req.body[imgName] })
            }
        } else {
            await uploadMultiple(req.files, fileNameArray, callback);
        }
    });
}

async function uploadSingle(file, callback) {
    await subUpload(file).then(async function (output) {
        if (output.status) {
            callback({ status: true, data: output.data })
        } else {
            callback({ status: false, message: output.message })
        }
    });
}

// Upload file to S3
async function s3upload(params) {
    try {
        await s3bucket.send(new PutObjectCommand(params));

        const url = `https://${params.Bucket}.s3.us-east-1.amazonaws.com/${params.Key}`;

        return { status: true, data: url };
    } catch (error) {
        return { status: false, message: 'Something went wrong! Please try again later.', error };
    }
}

// Main upload function
async function subUpload(reqfile) {
    try {
        // Check image metadata
        const metadata = await sharp(reqfile.path).metadata();

        if (!metadata.width || !metadata.height) {
            return { status: false, message: 'Please upload a valid image file.' };
        }

        const fileName = reqfile.filename;
        const originalName = reqfile.originalname;
        const filePath = reqfile.path;
        const format = originalName.split('.').pop().toLowerCase();
        const fileStream = fs.createReadStream(filePath);

        const bucketName = commonService.s3decryption(s3config["AmMHg9V=A3bVpXd5vd=mQ3Lk"]);
        const key = format === 'svg' ? fileName : `${moment().format("X")}_${fileName}`;

        // Prepare S3 upload parameters
        const params = {
            Bucket: bucketName,
            Key: key,
            Body: fileStream,
            ACL: "public-read"
        };

        // If SVG, set content type
        if (format === 'svg') {
            params.ContentType = 'image/svg+xml';
        }

        // Upload to S3
        const result = await s3upload(params);

        return result;
    } catch (err) {
        return { status: false, message: 'Please upload a valid image file.', error: err };
    }
}

async function uploadMultiple(files, fileNameArray, callback) {
    const uploadImg = [];
    if (files.length > 0) {
        for (let i = 0; i < files.length; i++) {
            await subUpload(files[i]).then(async function (output) {
                if (output.status) {
                    const ex = {}
                    ex[fileNameArray[i]] = output.data
                    uploadImg.push(ex)
                    if (uploadImg.length == files.length) {
                        callback({ status: true, data: uploadImg });
                    }
                } else {
                    callback({ status: false, message: output.message })
                }
            });
        }
    } else {
        callback({ status: true, data: [] })
    }
}