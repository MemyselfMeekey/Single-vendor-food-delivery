const mongoose=require("mongoose")

const OfferSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:2,
        max:50
    },
    startDate:{
        type:Date,
        required:true,

    },
    endDate:{
        type:Date,
        required:true
    },
    image:{
        type:String,
        required:false,
        unique:true
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
    autoIndex:true,
    autoCreate:true
})
const OfferDB=mongoose.model("FDOffer",OfferSchema)
module.exports=OfferDB