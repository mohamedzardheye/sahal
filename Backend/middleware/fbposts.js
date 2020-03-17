
const request = require('request');
const fbPost = require('../models/fbposts');

module.exports = (req, res,next) => {
  
    request('https://graph.facebook.com/v5.0/169089177070072/posts?limit=40&access_token=EAAN3v6jfZBskBAKVPRXvZBqmWUKS9krBn8iiNgAzkeVwkKs6vnZBdDUH6xe966ULk1CAxQ9TE2prYyNW2O8scAZB2tUyQgWuKuMgzxeoVKQeDRpj8FbpP2jGZB10k3UWqqf3mGVy8YCe7ld53RewgboRigXIRQDRAMgJYxjKSR7KQqgZCwWZCFA',  (error, response, body) => {
            if(error) {
                res.send('An erorr occured')
            }
       else {     
        fbPost.collection.deleteMany();

          const respone = JSON.parse(body)
          respone.data.forEach(res => {   

          const fbpost = new fbPost({
                  id:res.id,
                  message: res.message,
                  created_time: res.created_time,
                  type:'Facebook Post'
         });
         
          var correct = 100;
          fbpost.save({}).then(createdComment => {
          
          });
       }); 
    }// here end loop            
  });
 next();
}
    