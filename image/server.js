const express = require('express');
const formidable = require('formidable');
const sequelize = require('./db/db');
const User = require('./model/user');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { create } = require('domain');
const createError = require('http-errors')
const morgan = require('morgan')

const app = express();

app.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,content-type,token,Accept, Authorization')
        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    if (req.method === 'OPTIONS') {
        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        return res.status(200).json({})
    }
    req.headers['content-type'] = req.headers['content-type'] || 'application/json';
    next();
});

app.use(morgan('dev'))

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use('/public/images',express.static(path.join(__dirname, 'public/images')));


const imageFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || 
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
        ) {
    cb(null, true);
    } else {
    cb("Please upload only images.", false);
    }
    };


const fileStorage = multer.diskStorage({
    destination: (req, file ,cb) =>{ 
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname);
    }
});

const upload = multer({
    filefilter: imageFilter,
    storage: fileStorage
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.post('/', upload.single('image'), (req, res)=> {
    /* let timestamp = Date.now()
    sharp(`./public/images/${req.file.filename}`)
    .resize(200, 200, {
        fit: 'contain',
        width: 100,
        height: 100
    })
    .toFile(`public/tumbnail/resized-${timestamp}.jpg`, (err, info) => {
        if (err) {
            return res.send({
                success: false,
                message: err.message
            })
    }})
    try {
            
        const photo = User.create({
            buffer: req.file.buffer,
        });
        return res.json({
            success: true, 
            message: 'Uploaded Successfully',
            img_url: `http://localhost:5000/public/tumbnail/resized-${req.file.filename}`,
            photo
        });
    } catch (err) {
        res.status(400).json({success: false, message: err.message});
    } */
    sharp(`./public/images/${req.file.filename}`)
    .resize({ width: 250, height: 250 })
    .png()
    .toBuffer()
    .then(data => {
        console.log(data) 
        User.create({
            imgPath:`http://localhost:5000/image/public/image/${req.file.filename}`,
            image: 'data:image/png;base64,' + data.toString('base64')
        })
        .then((user) => {
            res.send(user)
        })
        .catch((err) => {
            if (err) throw createError.NotAcceptable('user exsist')
        })
    })
        
        
});

app.get('/user', (req,res) =>{
    
    User.findAll()
    //res.set('Content Type', 'image/jpg')
    .then(result => {
        res.json(
            result
        );
    }).catch((err) => {
        console.log(err)
        
    });
})

sequelize
.authenticate()
.then(() => {
    console.log('Connection has been established successfully.');
})
.catch(err => {
    console.error('Unable to connect to the database:', err);
}); 

sequelize.sync()
    .then(result =>{
        console.log(result);
    }).catch(err =>{
        console.log(err);
    }); 

app.listen(5000, () => {
console.log('Running');
})