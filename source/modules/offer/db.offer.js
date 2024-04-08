const mongoose = require("mongoose")

const OfferSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        unique:true,
        min: 2,
        max: 50
    },
    startDate: {
        type: Date,
        required: true,

    },
    endDate: {
        type: Date,
        required: true
    },
    menu: [{
        menuId: {
            type: mongoose.Types.ObjectId,
            ref: 'FDMenu',
            required: true,
       
        },
        offerDiscount: {
            type: Number,
            required: true,
            min: 1
        },
        offerPrice: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true
        },
    }],
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'FoodDeliveryUser',
        default: null
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
        ref: "FoodDeliveryUser",
        default: null
    }
}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true
})
const OfferDB = mongoose.model("FDOffer", OfferSchema)
module.exports = OfferDB