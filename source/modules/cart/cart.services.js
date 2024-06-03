const CartDB = require("./db.cart")
const OrderDb = require("./order.db")

class CartServices {
    getCartItem = async (filter) => {
        try {
            const cartObj = await CartDB.findOne(filter)
            return cartObj
        }
        catch (exception) {
            throw exception
        }
    }
    updateCartItemQuantity = async (cartObj, qty) => {
        try {
            qty = cartObj.quantity + qty
            console.log(cartObj)
            return await this.updateCartWithQuantity(cartObj, qty)
        }
        catch (exception) {
            throw exception
        }
    }
    updateCartWithQuantity = async (cartObj, qty) => {
        try {
            console.log(cartObj)
            cartObj.updatedBy = cartObj.createdBy
            cartObj.amount = (cartObj.menuDetail.price * qty)
            cartObj.quantity = qty
            return await cartObj.save()
        }
        catch (exception) {
            throw exception
        }
    }
    transformCreateCart = (menu, buyerId, quantity) => {
        console.log(menu)
        const cartObject = {
            buyerId: buyerId,
            orderId: null,
            menuDetail: {
                menuId: menu._id,
                name: menu.name,
                price: +menu.offerPrice,
            },
            sellerId: menu.sellerId,
            quantity: +quantity,
            amount: +quantity * +menu.offerPrice,
            createdBy: buyerId,
            status: "draft",
            isPaid: null
        }
        return cartObject
    }
    createCartItem = async (data) => {
        try {
            const cartObj = new CartDB(data)
            return await cartObj.save()
        }
        catch (exception) {
            throw exception
        }
    }
    removeFromCart = async (cartId) => {
        try {
            return await CartDB.findByIdAndDelete(cartId)
        }
        catch (exception) {
            throw exception
        }
    }
    reduceQuantity = async (cartObj, qty) => {
        try {
            qty = cartObj.quantity - qty
            return await this.updateCartWithQuantity(cartObj, qty)
        }
        catch (exception) {
            throw exception
        }
    }
    getCartList = async (filter) => {
        try {            
            const cartObj = await CartDB.find(filter)
            .populate('createdBy',['_id','name','phone','email'])
            .populate('buyerId',['_id','name','phone','email'])
            return cartObj
        }
        catch (exception) {
            throw exception
        }
    }
    createCartObject = async (cartItems, discount, deliveryCharge, buyer) => {
        try {
            let orderObj = {
                buyerId: buyer._id,
                cartItems: [],
                subTotal: 0,
                discount: discount,
                deliveryCharge: deliveryCharge,
                tax: 0,
                total: 0,
                status: "pending",
                isPaid: false,
                createdBy: buyer._id
            }
            let cartIds = []
            let subTotal = 0
            cartItems.map((item) => {
                cartIds.push(item._id)
                subTotal += +item.amount
            })
            const tax = (subTotal - discount + deliveryCharge) * 0.13
            const total = (subTotal - discount + deliveryCharge + tax)
            
    
            orderObj.cartItems = cartIds
            orderObj.subTotal = subTotal,
                orderObj.tax = +tax
            orderObj.total = +total
           
            return orderObj
        }
        catch (exception) {
            throw exception
        }
    }
    createOrder=async(orderObj)=>{
        try{
            const order=new OrderDb(orderObj)
            await order.save()
            await CartDB.updateMany({
                id:{$in:orderObj.cartItems}
            },{
                status:"orderObj.cartIds",
                orderId:order._id
            })
            return order
        }
        catch(exception){
            throw exception
        }
    }
}
const CartSvc = new CartServices()
module.exports = CartSvc