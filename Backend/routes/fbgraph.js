const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const fbpost = require('../models/fbposts');
const fbgraph = require('../middleware/fbgraph');
const fbposts = require('../middleware/fbposts')




router.get('/comments/:id', fbgraph,(req,res,next) =>{
  postids = req.params.id;
  Comment.find({postid:postids}).then(findComments => {
    res.send(findComments);
    console.log(findComments);
  });
});


router.get('/posts', fbposts,(req,res,next) =>{
    fbpost.find({}).then(posts => {
    res.send(posts);
    console.log(posts);
  });
});




module.exports = router;