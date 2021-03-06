const express = require('express');
const Post = require('../models/post');
const router = express.Router();
const multer = require('multer');
const User = require('../models/user');
var graph = require('fbgraph');
const http = require('http');
const request = require('request');
const Comment = require('../models/comment')
const fbgraph = require('../middleware/fbgraph')
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

// router.get('/some',  (req, res,next) => {

// var postids = 461438277835159;
// request('https://graph.facebook.com/v5.0/'+postids+'/comments?limit=300&access_token=EAAN3v6jfZBskBAKVPRXvZBqmWUKS9krBn8iiNgAzkeVwkKs6vnZBdDUH6xe966ULk1CAxQ9TE2prYyNW2O8scAZB2tUyQgWuKuMgzxeoVKQeDRpj8FbpP2jGZB10k3UWqqf3mGVy8YCe7ld53RewgboRigXIRQDRAMgJYxjKSR7KQqgZCwWZCFA',  (error, response, body) => {
//         if(error) {
//             res.send('An erorr occured')
//         }
//    else {     
        
//         const respone = JSON.parse(body)
//         res.send(body)
//         Comment.deleteMany({postid:postids}).then(DeletedComments => {
//         // console.log(DeletedComments);
//         });

//       respone.data.forEach(res => {
               
//       const comments = new Comment({
//               postid :postids,
//               id:res.id,
//               username:res.from.name,
//               message: res.message,
//               created_time: res.created_time,
//               type:'Facebook Comment'
//      });
     
         
//       // AFTER NEXT
//       var correct = 100;
//       comments.save().then(createdComment => {
//         //console.log(createdComment);
//         Comment.deleteMany({message: { $ne: correct }}).then(DeletedComments => {
//           //console.log(DeletedComments);
//         });

        
        
//     });

//       }); 
      
//           }// here end loop 

          
//     });
    
//   });


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









//var fomatted_date = moment(photo.date_published).format('YYYY-DD-MM');



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

  const post = new Post({


    title: req.body.title,
    content: req.body.content,
    // imagePath: url+ '/images/' + req.file.filename,
    imagePath:newUrl+req.file.filename,
    createdDate: DateFormatted,
    creator: req.userData.userId
  });


  post.save().then(createdPost => {

    console.log(createdPost);




    res.status(201).json({
      message: 'Post Added Successfuly',

      //postId: createdPost._id
      post: {

        //anothe way
         
        // id:createdPost._id,
        // title:createdPost.title,
        // content:createdPost.content,
        // imagePath: createdPost.imagePath

        ...createdPost,
        id: createdPost._id



        //nexo



      }
    });
  })
    .catch(err => {
      res.status(500).json({
        message: 'CREATE POST FAILDED !',

      });
    });







  });

//OLD RETRIEVE ALL POSTS WITH OUT PAGINATION
router.get( '/test',(req,res, next) =>{
  Post.find( /*{createdDate:DateFormatted}*/).then(documents =>{
    res.status(200).json({
     
    
      posts:documents
  });

    });

});

router.get('', (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  //const postQuery =  Post.findOne({creator:'5ce1100517ec104228a6f805'}).populate('creator');

  const postQuery = Post.find({ /*creator: req.userData.userId*/ })
   // .populate('creator');


  //  = User.findOne({_id:req.userData.userId});
  // const postAuthor = User.findOne({email:req.userData.email});
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents;
      //console.log(documents);
      return Post.countDocuments();
    })


    .then(count => {

      res.status(200).json({

        message: 'Posts Fetched Successfully',
        posts: fetchedPosts,
        maxPosts: count
      });

    });

});


router.put(
  '/:id',
  checkAuth,
  multer({ storage: storage }).single('image'),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {

      const url = req.protocol + '://' + req.get('host');
      imagePath = url + '/images/' + req.file.filename
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
      console.log(result);
      if (result.nModified > 0) {

        res.status(200).json({ message: "Update Successful" });
      }
      else {
        res.status(401).json({ message: 'Not Authorized' });
      }

    });
  });


//caling Post Id from db other wise page load not with id 
router.get('/:id', checkAuth, (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post)

    }
    else {
      res.status(404).json({ message: 'POST Not FOUND ' });
    }
  });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {

    console.log(result);
    if (result.n > 0) {
      res.status(200).json({ message: "Delete Successful" });
    }
    else {
      res.status(401).json({ message: 'Not Authorized' });
    }

  });

});


    //var hppt  = 'https://graph.facebook.com/v5.0'+postcomment+"?access_token="+token', '';
   router.get('https://graph.facebook.com/v5.0/461987294446924/comments?access_token=EAAN3v6jfZBskBAKVPRXvZBqmWUKS9krBn8iiNgAzkeVwkKs6vnZBdDUH6xe966ULk1CAxQ9TE2prYyNW2O8scAZB2tUyQgWuKuMgzxeoVKQeDRpj8FbpP2jGZB10k3UWqqf3mGVy8YCe7ld53RewgboRigXIRQDRAMgJYxjKSR7KQqgZCwWZCFA',(req,res, next) => {
    
    var token = 'EAAN3v6jfZBskBAKVPRXvZBqmWUKS9krBn8iiNgAzkeVwkKs6vnZBdDUH6xe966ULk1CAxQ9TE2prYyNW2O8scAZB2tUyQgWuKuMgzxeoVKQeDRpj8FbpP2jGZB10k3UWqqf3mGVy8YCe7ld53RewgboRigXIRQDRAMgJYxjKSR7KQqgZCwWZCFA';

    var url = '169089177070072/posts';
    var postcomment = '461987294446924/comments' ;
   
  

     res.status(200).json({
        res 
       });
    });
 











module.exports = router;