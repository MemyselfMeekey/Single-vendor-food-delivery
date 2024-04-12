
const mongoose = require("mongoose")
const CartModelSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Types.ObjectId,
        ref: "FoodDeliveryUser",
        required: true
    },
    orderId: {
        type: mongoose.Types.ObjectId,
        ref: "FDOrder",
        require: false,
        default: null
    },
    menuDetail: {
        menuId: {
            type: mongoose.Types.ObjectId,
            ref: "FDMenu",
            required: true
        },
        name: {
            type: String
        },
        price: {
            type: Number,
            required: true
        },
    },
    quantity: {
        type: Number,
        min: 1,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        min: 1
    },
    status: {
        type: String,
        enum: ["draft", "confirmed", "cancelled", "delivered"]
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: "FoodDeliveryUser",
        deault: false,
    },
    updatedBy: {
        type: mongoose.Types.ObjectId,
        ref: "FoodDeliveryUser",
        deault: false,
    },
}, {
    timestamps: true,
    autoCreate: true,
    autoIndex: true,
})
const CartDB=mongoose.model("FDCart",CartModelSchema)
module.exports=CartDB