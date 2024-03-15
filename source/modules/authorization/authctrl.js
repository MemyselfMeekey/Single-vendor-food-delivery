require("dotenv").config()
const services = require("./services.db")
const AppError=require("../../exception/error.app")

class AuthorizationControl{
    registration=async(req,res,next)=>{
      try{
        const data=services.transformRegisterData(req.body)
       
        const user=await services.userStore(data)
        
        if(user){
          const myEvent=req.myEvent
          
          myEvent.emit('sendRegMail',user)//make a new folder named events and add the event listener there
        }
        else{
          throw AppError({message:"this couldnot be executed in registration"})
        }
      }
      catch(exception){
        console.log(exception)
        next(exception)
      }
        
    }
    verificationToken=(req,res,next)=>{
      try{
        const token=req.params.token
        if(token.length<100){
          throw new AppError({message:"Invalid Token"})
        }
      }
      catch(exception){
        console.log("exception in verification of authctrl",exception)
        next(exception)
      }
    }
    
    resendActivationToken=(req,res,next)=>{
      try{

      }
      catch(exception){
        console.log("eception in authroirzation control",exception)
        next(exception)
      }
    }
    activation=(req,res,next)=>{
      try{

      }
      catch(exception){
        console.log("eception in authroirzation control",exception)
        next(exception)
      }
    }
    login=(req,res,next)=>{
      try{

      }
      catch(exception){
        console.log("eception in authroirzation control",exception)
        next(exception)
      }
    }
    dashboard=(req,res,next)=>{
      try{

      }
      catch(exception){
        console.log("eception in dashboard control",exception)
        next(exception)
      }
    }
    changepass=(req,res,next)=>{
      try{

      }
      catch(exception){
        console.log("eception in changepass control",exception)
        next(exception)
      }
    }
    frogetpass=(req,res,next)=>{
      try{

      }
      catch(exception){
        console.log("eception in forget control",exception)
        next(exception)
      }
    }
    frogetpasstokenverify=(req,res,next)=>{
      try{

      }
      catch(exception){
        console.log("eception in forgetpasstokenverify control",exception)
        next(exception)
      }
    }
    setpasstoken=(req,res,next)=>{
      try{

      }
      catch(exception){
        console.log("eception in setpasstoken control",exception)
        next(exception)
      }
    }
}
const authCtrl=new AuthorizationControl()
module.exports=authCtrl