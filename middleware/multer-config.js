//Call the module multer for use
const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg':'jpg',
    'image/png' : 'png',
    'image/bmp' : 'bmp',
    'image/gif' : 'gif',
    'image/webp' : 'webp'
};

//This is a configuration object for multer
const storage = multer.diskStorage({//this function is used to store on disk 
    destination: (req, file, callback) => {
        callback(null,'images');//To know in which folder the image should be saved
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');//For replace spaces with underscors
        const extension = MIME_TYPES[file.mimetype];// For to manage the image's extension
        callback(null, name + Date.now() + '.' + extension);//For final name file whitch save in folder
    }
});

//Call multer to passed the object storage say 'save with multer params' and to call method single for say 'is a unique file' and passed image for say 'is a image file
module.exports = multer({storage: storage}).single('image');