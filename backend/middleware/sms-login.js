
const Nexmo = require('nexmo');



module.exports = (req,res,next) =>{
    
const nexmo = new Nexmo({
  apiKey: '8274508f',
  apiSecret: 'e1MGs87e8tFGnlWZ',

});

const from = 'TABAARAKTECH';
const to = '252634036617';
 const text ='0024';

// nexmo.verify.request({

//     number: '252634036617',
//     brand: 'TAYOMARKET',
//     code_length: '4'
//   }, (err, result) => {
//     console.log(err ? err : result)
    
   
      
//     console.log("Message sent successfully.");
//     next();
  


// });



 nexmo.message.sendSms(from, to, text, (err, responseData) => {
        if (err) {
            console.log(err);
        } else {
            if(responseData.messages[0]['status'] === "0") {
                console.log("Message sent successfully.");
                next();
            } else {
                console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
            }
        }
    });


};