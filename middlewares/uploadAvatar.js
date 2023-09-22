const multer = require('multer');

//Configuración de subida de archivos con multer
//req, file, cb es el metodo que me permite aplicar la configuración
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/avatars/')
    },
    filename: (req, file, cb) => {
        cb(null, 'avatar-'+Date.now()+'-'+file.originalname)
    }
})


const uploads = multer({storage})
 



module.exports = uploads;