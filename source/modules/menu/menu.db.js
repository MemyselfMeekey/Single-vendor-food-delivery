const mongoose=require('mongoose')
const MenuSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        min:2
    },
    slug:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String
    },
    price:{
        type:Number,
        required:true,
        min:1
    },
    category:{
        type:mongoose.Types.ObjectId,
        ref:"FDCategory",
        default:null
    },
    discount:{
        type:Number,
        min:0,
        default:0
    },
    afterDiscount:{
        type:Number,
        required:true,
        min:1
    },
    status:{
        type:String,
        enum:['active','inactive'],
        default:'inactive'
    },
    images: [{
        type:String,
    }],
   
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
        ref:'FoodDeliveryUser',
        default:null
    }
},{
    timestamps:true,
    autoCreate:true,
    autoIndex:true
})
const MenuDB=mongoose.model("FDMenu",MenuSchema)
module.exports=MenuDB