const express = require('express');
const Post = require('../models/post');
const router = express.Router();
const multer = require('multer');

const moment = require('moment');
const DateFormatted = moment().format('YYYY-DD-MM');


const checkAuth = require('../middleware/check-auth');
const sendSms = require('../middleware/sms-login');

const MIME_TYPE_MAP = {
  'image/png' : 'png',
  'image/jpg' : 'jpg',
  'image/jpeg' : 'jpg'
}
const storage = multer.diskStorage({
  destination: (req, file,cb) =>{
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error ('invalid Image ');
    if (isValid){
      error = null;
    }
    cb(null,"backend/images");
  },
  filename:(req,file,cb) =>{
    const name= file.originalname.toLowerCase().split(' ').join('-');
    const ext =  MIME_TYPE_MAP[file.mimetype];
    cb(null,name + '-' + Date.now() + '.' + ext);
  }
});


router.post('',

checkAuth,

multer({storage:storage}).single('image'),
// sendSms,
 (req,res,next) =>{
    const url = req.protocol + '://' + req.get('host');
    //var fomatted_date = moment(photo.date_published).format('YYYY-DD-MM');
    
    const post  =  new Post({
    

        title: req.body.title,
        content: req.body.content,
        imagePath: url+ '/images/' + req.file.filename,
        createdDate:DateFormatted,
        creator: req.userData.userId
    });
    

  post.save().then(createdPost =>{
      
      console.log(createdPost);

      


      res.status(201).json({
        message:'Post Added Successfuly',
        
        //postId: createdPost._id
        post:{
          //anothe way 
          // id:createdPost._id,
          // title:createdPost.title,
          // content:createdPost.content,
          // imagePath: createdPost.imagePath

          ...createdPost,
          id:createdPost._id



          //nexo

         
        
        }
    });
  });
 
   
});

//OLD RETRIEVE ALL POSTS WITH OUT PAGINATION
// router.get( '',(req,res, next) =>{
//   Post.find( /*{createdDate:DateFormatted}*/).then(documents =>{
//     res.status(200).json({
//       message:'Posts fethed win',
//       posts:documents
//   });
 
//     });
   
// });

router.get( '',(req,res, next) =>{
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery =  Post.find();
  let fetchedPosts;
  if(pageSize && currentPage){
    postQuery
      .skip(pageSize * (currentPage -1))
      .limit(pageSize);
  }
  postQuery
  .then(documents => {
    fetchedPosts = documents;
    return Post.countDocuments();
  })
  
  .then(count =>{
   
    res.status(200).json({
      message:'Posts Fetched Successfully',
      posts:fetchedPosts,
      maxPosts:count
  });
 
    });
   
});


router.put(
  '/:id',
  checkAuth,
  multer({storage:storage}).single('image'),
   (req,res,next) =>{
    let imagePath = req.body.imagePath;
     if(req.file){
      
       const url = req.protocol + '://' + req.get('host');
       imagePath= url+ '/images/' + req.file.filename
     }
  const post = new Post({
    _id:req.body.id,
    title:req.body.title,
    content: req.body.content,
    imagePath:imagePath
  });
  console.log(post);
  Post.updateOne({_id:req.params.id, creator:req.userData.userId} , post) .then(result =>{
    if (result.nModifired >0 ){
      res.status(200).json({message:"Update Successful"});
    }
   else{
     res.status(401).json({message:'Not Authorized'});
   }
  
  });
});


//caling Post Id from db other wise page load not with id 
router.get('/:id',checkAuth, (req,res,next) =>{
  Post.findById(req.params.id).then(post =>{
    if(post) {
      res.status(200).json(post)
     
    }
    else {
      res.status(404).json({message:'POST Not FOUND '});
    }
  });
});

router.delete("/:id", checkAuth, (req,res,next) => {
    Post.deleteOne({_id: req.params.id, creator:req.userData.userId}) .then(result =>{
       
    console.log(result);
    if (result.n >0 ){
      res.status(200).json({message:"Delete Successful"});
    }
   else{
     res.status(401).json({message:'Not Authorized'});
   }
        
    }) ;

    });


    module.exports = router;