require("dotenv").config()
const services = require("./services.db")
const AppError=require("../../exception/error.app")
const bcrypt=require("bcrypt")
const { genRanStr } = require("../../configuration/randomstring.generator")

class AuthorizationControl{
    registration=async(req,res,next)=>{
      try{
        const data=services.transformRegisterData(req.body)
      //  console.log(data.activationToken)
        const  user=await services.userStore(data)
       
       
        if(user){
          const myEvent=req.myEvent
          myEvent.emit('sendRegisterMail',user)//make a new folder named events and add the event listener there
        }
        else{
          throw AppError({message:"this couldnot be executed in registration"})
        }
        res.json({
          result:user,
          message:"Use the activation token to activate your account",
          meta:null
        })
      }
      catch(exception){
        console.log(exception)
        next(exception)
      }
        
    }
    verificationToken=async(req,res,next)=>{
      try{
        const token=req.params.token
        if(token.length<100){
          throw new AppError({message:"Invalid Token"})
        }
       
        const user=await services.getSingleUserByFilter({
          activationToken:token

        })
       
        if(!user){
          throw new AppError({message:"Token doesnot exist anymore"})
        }
        const today=new Date().getTime()
        const tokenExpiryDate=new Date(user.expiryDate).getTime
        if(today>tokenExpiryDate){
          throw new AppError({message:"Token is expired "})
        }
        res.json({
          result:user,
          message:"You are verified",
          meta:null
        })
      }
      catch(exception){
        console.log("exception in verification of authctrl",exception)
        next(exception)
      }
    }
    
    resendActivationToken=async(req,res,next)=>{
      try{
          const email=req.body.email
          const user=await services.getSingleUserByFilter({
            email:email,

          })
          if(!user){
            throw new AppError  ({message:"User has not been registered yet "})
          }
          const token=genRanStr()
          const expiryDate=new Date()
          expiryDate.setHours(expiryDate.getHours()+2)
          await services.updateUser(user._id,{
            activationToken:token,
            expiryDate:expiryDate
          })
          const myEvent=req.myEvent
          myEvent.emit('sendRegisterMail',{name:user.name,email:user.email,activationToken:token})
          res.json({
            result:{
              activationToken:token,
              expiryDate:expiryDate
            },
            message:"This is updated",
            meta:null
          })
      } 
      catch(exception){
        console.log("exeption in authroirzation control",exception)
        next(exception)
      }
    }
    activation=async(req,res,next)=>{
      try{
          const token=req.params.token
          const user=await services.getSingleUserByFilter({
            activationToken:token
          })
          if(!user){
            throw new AppError({message:"Invalid token"})
          }
          const today=new Date().getTime()
          const expiryDate=new Date(user.expiryDate).getTime()
          if(today>expiryDate){
            throw new AppError({message:"Token has already been expired"})
          }
          const hash=bcrypt.hashSync(req.body.password,10)
          const updateBody={
            password:hash,
            activationToken:null,
            expiryDate:null,
            status:"active"
          }
          const update=await services.updateUser(user._id,updateBody)
          res.json({
            result:null,
            message:"Your account has been successfully activated",
            meta:null
          })
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