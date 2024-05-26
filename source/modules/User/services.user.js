
const { UserModel } = require("../../database/db.mongoose")
const AppError = require("../../exception/error.app")

class UserService{
    getCount=async(filter)=>{
        try{
            const count=await UserModel.countDocuments(filter)
            return count
        }
        catch(exception){
            throw exception
        }
    }
    listUserByFilter=async({filter,offset,limit})=>{
        try{
            const userList=await UserModel.find(filter,{password:0})
            .sort({_id:-1})
            .skip(offset)
            .limit(limit)
            return userList
        }
        catch(exception){
            throw exception
        }
    }
    getSingleUser=async(id)=>{
        try{
            
            const user=await UserModel.findById(id,{password:0})
            return user
        }
        catch(exception){
            throw exception
        }
    }
    transformUpdateData=(existingUser,updateBody)=>{
        const data={...updateBody}
        if(updateBody.image){
            data.image=updateBody.image.filename
        }
        return data
    }

    deleteUser=async(id)=>{
        try{
            const deletedUser=await UserModel.findByIdAndDelete(id)
            if(!deletedUser){
                throw new AppError({message:"User couldnot be deleted",code:404})
            }
            return deletedUser
        }
        catch(exception){
            throw exception
        } 
    }
}
const UserSvc=new UserService()
module.exports=UserSvc