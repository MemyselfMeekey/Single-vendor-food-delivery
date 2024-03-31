const mongoose=require("mongoose")

const CategorySchema=new mongoose.Schema({
    name:{
        type:String,
        min:2,
        unique:true,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },
    image:{
        type:String,
        required:true
    },
    parentId:{
        type:mongoose.Types.ObjectId,
        ref:"FDCategory"
    },
   showInHome:{
    type:Boolean,
    default:false
   },
   createdBy:{
    type:mongoose.Types.ObjectId,
    ref:'FoodDeliveryUser',
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
const CatDB=mongoose.model("FDCategory",CategorySchema)
module.exports=CatDB