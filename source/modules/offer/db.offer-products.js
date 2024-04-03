const mongoose=require("mongoose")

const OfferProducts=new mongoose.Schema({
    offerId:{
        type:mongoose.Types.ObjectId,
        ref:"Offer",
        default:null
    },
    menuId:{
        types:mongoose.Types.ObjectId,
        ref:'FDMenu',
        default:null
    },
    offerDiscount:{
        types:Number,
        required:true,
    },
    price:{
        types:Number,
        required:true
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
const OfferProDB=mongoose.model("FDOfferProduct",OfferProducts)
module.exports=OfferProDB