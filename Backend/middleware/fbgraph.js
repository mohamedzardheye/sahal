
const request = require('request');
const Comment = require('../models/comment')

module.exports = (req, res,next) => {

    //var postids = 461987294446924;
    var postids = req.params.id;

    request('https://graph.facebook.com/v5.0/'+postids+'/comments?limit=300&access_token=EAAN3v6jfZBskBAKVPRXvZBqmWUKS9krBn8iiNgAzkeVwkKs6vnZBdDUH6xe966ULk1CAxQ9TE2prYyNW2O8scAZB2tUyQgWuKuMgzxeoVKQeDRpj8FbpP2jGZB10k3UWqqf3mGVy8YCe7ld53RewgboRigXIRQDRAMgJYxjKSR7KQqgZCwWZCFA',  (error, response, body) => {
            if(error) {
                res.send('An erorr occured')
            }
       else {     
       
            const respone = JSON.parse(body)
            try{
              Comment.deleteMany({postid:postids}).then(DeletedComments => {
              });
            }
            catch(e){
              console.log(e);
            }
            
    
          respone.data.forEach(res => {
                   
          const comments = new Comment({
                  postid :postids,
                  id:res.id,
                  username:res.from.name,
                  message: res.message,
                  created_time: res.created_time,
                  type:'Facebook Comment'
         });
         
             
          
          let correct = [100,102,103];
          
          comments.save({message:100}).then(createdComment => {
          Comment.deleteMany({message: { $nin: correct }}).then(DeletedComments => {
         
         });       
        });
    
          }); 
          
             
        }// here end loop 
    
              
        });
        next();
    }
    