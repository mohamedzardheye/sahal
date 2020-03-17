const express = require('express');
const router = express.Router();
const multer = require('multer');
const User = require('../models/user');
const Cities = require('../models/hotel');

//DATE FORMAR 
const moment = require('moment');
const DateFormatted = moment().format('YYYY-DD-MM');

// IMAGE UPLOAD 
const cloudinary = require('cloudinary');

cloudinary.config({
  cloud_name: 'tabaarak',
  api_key: '696141847982395',
  api_secret: 'bE1hJL--RSG84L63zqNH4fbjSsI'
});








const checkAuth = require('../middleware/check-auth');
const sendSms = require('../middleware/sms-login');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg'
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('invalid Image ');
    if (isValid) {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});



router.get('/hotels',(req,res, next) =>{
  Cities.find( /*{createdDate:DateFormatted}*/).then(documents =>{
    res.status(200).json({
     
    
      Cities:documents
     
  });
  console.log(documents);

    });

  });


// test 

router.get('/test', async (req, res) => {
  try {
    const newcity = await Cities.find()
    app.module
     res.json(newcity)
   
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// end test
router.post('',
  checkAuth,
  multer({ storage: storage }).single('image'),
  // sendSms,
  (req, res, next) => {
     cloudinary.v2.uploader.upload(req.file.path,
      {
        use_filename : true,
        unique_filename : false,

      },
    function(error, result)
     { 
       return result.url;
    })



 // url = req.protocol + '://' + req.get('host');
  newUrl = 'http://res.cloudinary.com/tabaarak/image/upload/'

  const city = new Cities({
    title: req.body.title,
    desc: req.body.desc,
    // imagePath: url+ '/images/' + req.file.filename,
    imagePath:newUrl+req.file.filename,
    createdDate: DateFormatted,
    creator: req.userData.userId
  });

  city.save().then(createdCity => {
    console.log(createdCity);
    res.status(201).json({
      message: 'Hotel City Added Successfuly',

      //postId: createdPost._id
      hotel: {
        //anothe way 
        // id:createdPost._id,
        // title:createdPost.title,
        // content:createdPost.content,
        // imagePath: createdPost.imagePath

        ...createdCity,
        id: createdCity._id
        //nexo
      }
    });
  })
    .catch(err => {
      res.status(500).json({
        message: 'CREATE POST FAILDED !',

      });
    });


 




  }); // last on e

  module.exports = router;