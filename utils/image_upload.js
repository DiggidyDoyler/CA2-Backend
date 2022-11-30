const multer = require('multer');
const path = require('path');

const fileFilter = (req, file, cb) => {

    if (!file) {
        req.imageError = "Image not uploaded!";
        return cb(null, false);
    }
    else if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        req.imageError = "Image must be jpg|jpeg|png|gif";
        return cb(null, false);
    }

    cb(null, true);
};

const storage = multer.diskStorage({
    destination: ( req, file, cb ) => {
        cb(null, 'public' + process.env.STATIC_FILES_URL);
    },
    filename: ( req, file, cb ) => {
        console.log(file.path);
        console.log(file.originalname);

        cb(null, Date.now() + path.extname(file.originalname));
    }
});

module.exports = multer({ fileFilter, storage });