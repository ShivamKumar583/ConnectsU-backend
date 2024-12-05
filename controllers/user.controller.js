const createHttpError = require("http-errors");
const { searchUsers}  = require("../services/user.service");

exports.searchUsersService = async(req,res,next) => {
    try{
        const keyword = req.query.search;
        if(!keyword){
            throw createHttpError.BadRequest("Oops...Something went wrong !");
        }

        const users = await searchUsers(keyword,req.user.userId);
        res.status(200).json(users);
    }catch(error){
        next(error)
    }
};