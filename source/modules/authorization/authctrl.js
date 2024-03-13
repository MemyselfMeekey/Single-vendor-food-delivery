const authservices = require("./authservices")

class AuthorizationControl{
    registration=async(req,res,next)=>{
      try{
        const data=authservices.transformRegisterata(req.body)
        // console.log(data)
        await authservices.sendRegEmail(data)
      }
      catch(exception){
        console.log("This is in registration authservices",exception)
        next(exception)
      }
        
    }
    verification=(req,res,next)=>{

    }
    activation=(req,res,next)=>{

    }
    login=(req,res,next)=>{

    }
    dashboard=(req,res,next)=>{

    }
    changepass=(req,res,next)=>{

    }
    frogetpass=(req,res,next)=>{

    }
    frogetpasstokenverify=(req,res,next)=>{

    }
    setpasstoken=(req,res,next)=>{

    }
}
const authCtrl=new AuthorizationControl()
module.exports=authCtrl