require("dotenv").config
const AppError=require("../exception/error.app")
const jwt=require("jsonwebtoken")
const services=require("../modules/authorization/services.db")
const loginCheck=async(req,res,next)=>{
    try{
      
        let token=req.headers['authorization'] || null
        if(!token){
            throw new AppError({message:"Token is required",code:401})
        }
        token=token.split(" ").pop()
        if(!token){
            throw new AppError({message:"There is no such token",codde:401})
        }
        const data=jwt.verify(token,process.env.JWT_SECRET)
        if(data.hasOwnProperty('type'&&data.type==="refresh")){
            throw new AppError({message:"User AcESS tOKEN",code:403})
        }
        const userDetail=await services.getSingleUserByFilter({
            _id:data.id
        })
        if(!userDetail){
            throw new AppError({message:"User does not exists anymore",code:401})
        }
        else{
            req.authUser=userDetail;
            next()
        }
    }
    catch(exception){
        console.log(exception)
        const errorObj=exception
        if(exception instanceof jwt.JsonWebTokenError){
            errorObj['message']=exception.message
            errorObj['code']=401
        }
        next(errorObj)
        
    }
}
module.exports=loginCheck