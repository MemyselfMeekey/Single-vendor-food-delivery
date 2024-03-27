const mongoose=require("mongoose")      
const BannerSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
        min:2
    },
    url:String,
    image:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:"inactive"
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:"FoodDeliveryUser",
        default:null
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
})
const BannerModel=mongoose.model("FDBanner",BannerSchema)
module.exports=BannerModel