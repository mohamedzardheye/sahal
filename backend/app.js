const express = require ('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const path = require('path');

const postsRoutes = require('./routes/posts');
const userRouters = require('./routes/user');
const hotelRoutes = require('./routes/hotel');
const graphRoutes = require('./routes/fbgraph');
const app = express ();
mongoose.connect("mongodb://mohamed.zardheye:2170062mmmM@ds133875.mlab.com:33875/checks", {
    useNewUrlParser: true
})
.then(() =>{
    console.log('connection success');
})
.catch(() =>{
    console.log('connections lost');
});

app.use(bodyParser.json())
app.use (bodyParser.urlencoded({extended:false}));

app.use('/images', express.static(path.join('backend/images')));
app.use((req,res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
                "Access-Control-Allow-Headers",
                "Origin, X-Requested-With,Content-Type,Accept,Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods",
                "GET,POST,PATCH,DELETE,OPTIONS,PUT"
    );
    next();
});




//Serve only the static files form the dist directory
// app.use(express.static(__dirname + '../../dist/'));

// app.get('/*', function(req,res) {
    
//  res.sendFile(path.join(__dirname+'../../dist/index.html'));
//  //res.sendFile(__dirname + '../dist/index.html');
// });
app.use('/api/hotel' ,hotelRoutes );
app.use('/api/posts' , postsRoutes);
app.use('/api/user' , userRouters);
app.use('/api/graph' ,graphRoutes);




module.exports = app;