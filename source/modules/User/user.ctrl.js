const AppError = require("../../exception/error.app")
const services = require("../authorization/services.db")
const UserSvc=require("./services.user")
const {myEvent}=require("../../eventlistener/myevent.listener")

class UserControl{
    registerUser=async(req,res,next)=>{
        try{
            const body=req.body
            const createdBy=req.authUser._id
            const transform= services.transformRegisterData(body)
            const user=await services.userStore(body,createdBy)
            if(user){
                myEvent.emit('sendRegisterMail',user)
            }  
            
            else{
                throw new AppError({message:"This counldnot be exceuted",code:400})
            }
            res.json({
                result:user,
                message:"Your account has been created successfully",
                meta:null
            })
        }
        catch(exception){
            next(exception)
        }
    }
    getList=async(req,res,next)=>{
        try{
            const role= req.query.role || null
            const page=+req.query.page ||1
            const limit= +req.query.limit || 15
            if(page<=0 || limit <= 0){
                throw new AppError({message:"Page number and limit should be less than zero",code:400})
            }
            const offset=(page-1)*limit
            let filter={}
            
            if(role){
                filter={
                    role:role
                }
            }
            if(req.query.search){
                filter={
                     ...filter,
                     deletedAt:{$eq:null},
                     deletedBy:{$eq:null},
                     $or:[
                        {name:new RegExp(req.query.search, 'i')},
                        {status:new RegExp(req.query.search, 'i')},
                        {role:new RegExp(req.query.search,'i')}
                     ]
                }
            }
            
            const count=await UserSvc.getCount(filter)
            const userList=await UserSvc.listUserByFilter({filter,offset,limit})
            res.json({
                result:userList,
                message:"User list fetched",
                meta:{
                    page:page,
                    limit:limit,
                    count:count,
                }
            })
        }
        catch(exception){
            next(exception)
        }
    }
    getDataById=async(req,res,next)=>{
        try{
            const userId=req.params.userId
            const userDetail=await UserSvc.getSingleUser({_id:userId})
            if(!userDetail){
                throw new AppError({message:"User not found",code:400})
            }
            res.json({
                result:userDetail,
                message:"User Detail given",
                meta:null
            })
        }
        catch(exception){
            next(exception)
        }
    }
    update=async(req,res,next)=>{
        try{
            console.log('hi')
            const userId=req.params.userId
            console.log("hello")
            const userDetail=await UserSvc.getSingleUser({_id:userId})
            if(!userDetail){
                throw new AppError({message:"Please check your id. The provided id doesnot exists",code:400})
            }
          
            const data=await UserSvc.transformUpdateData(userDetail,req.body,req.authUser._id)
            const updatedData=await services.updateUser(userId,data)
            res.json({
                result:updatedData.name,
                message:"This user has successfully been updated",
                meta:null
            })
         
        }
        catch(exception){
            next(exception)
        }
    }
    deleteData=async(req,res,next)=>{
        try{
            const userId=req.params.userId
            const userDetail=await UserSvc.getSingleUser({_id:userId})
            if(!userDetail){
                throw new AppError({message:"user not found",code:400})
            }
            const update=await services.updateUser(userId,{
                deletedAt:new Date(),
                deletedBy:req.authUser._id
            })
            res.json({
                result:userDetail,
                message:"This is deleted data",
                meta:null
            })
        }
        catch(exception){
            next(exception)
        }
    }
}
const UserCtrl=new UserControl()
module.exports=UserCtrl