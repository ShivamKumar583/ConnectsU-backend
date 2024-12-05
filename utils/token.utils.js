const jwt = require('jsonwebtoken')
exports.sign = async(payload,expiresIn,secret) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,secret,
            {expiresIn:expiresIn},

            (err ,token) => {
                if(err){
                    console.log('error in sign a token');
                    reject(err);
                }
                else {
                    resolve(token);
                }
            }
        )
    })
}


exports.verify = async(token,secret) => {
    return new Promise((resolve,reject) => {
        jwt.verify(token,secret,(err,payload) => {
            if(err){
                resolve(null);
            }
            else{
                resolve(payload);
            }
        })
        
    })
}