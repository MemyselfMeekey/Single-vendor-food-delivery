const mongoose=require("mongoose")

const AddStructure=new mongoose.Schema({
    state:String,
    district:String,
    localDevCom:String,
    wardNo:String,
    stnName:String
})
const UserDataSchema=new mongoose.Schema({
    name:{
        type:String,
        min:2,
        max:50,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:['admin','customer','seller'],
        default:'customer'
    },
    password:String,
    activationToken:String,
    expiryDate:Date,
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },
    address:{
        deliveryAdd:AddStructure,
        deliveredAdd:AddStructure
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"FoodDeliveryUser",
        default:null,
    },
    updatedBy:{
        type:mongoose.Types.ObjectId,
        ref:"FoodDeliveryUser",
        default:null
    }
    },{
        timestamps:true,
        autoCreate:true,
        autoIndex:true
    }
)
const UserModel=mongoose.model("FoodDeliveryUser",UserDataSchema)
module.exports=UserModel