const { sign, verify } = require("../utils/token.utils");


exports.generateToken = async(payload,expiresIn, secret) => {
    let token = await sign(payload,expiresIn,secret);
    return token;
}

exports.verifyToken = async(token , secret)=>{
    let check = await verify(token,secret);

    return check;
}