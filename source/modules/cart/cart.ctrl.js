const AppError = require("../../exception/error.app")
const MenuSvc=require("../menu/services.menu")
const CartSvc = require("./cart.services")
class CartController{
    addToCart=async(req,res,next)=>{
        try{
            const {menuId,quantity}=req.body
           const menuDetail=await MenuSvc.getSingleDataByFilter({
                _id:menuId,
                status:"active"
           })
           if(!menuDetail){
            throw new AppError({message:"This menu doesnot exists",code:400})
           }
           const buyerId=req.authUser._id
           const existingCart=await CartSvc.getCartItem({
                buyerId:buyerId,
                orderId:{$eq:null},
                status:"draft",
                "menuDetail.menuId":menuDetail._id
           })
           let cartItem
           if(existingCart){
            cartItem=await CartSvc.updateCartItemQuantity(existingCart,quantity)
           }
           else{
            const payload= CartSvc.transformCreateCart(menuDetail,buyerId,quantity)
                cartItem=await CartSvc.createCartItem(payload)
           }
           res.json({
            result:cartItem,
            message:"Cart created successfully",
            meta:null
           })
        }
        catch(exception){
            next(exception)
        }
    }
    removeFromCart=async(req,res,next)=>{
        try{
            const {menuId,quantity}=req.body
            const loggedInUser=req.authUser
            const existingCart=await CartSvc.getCartItem({
                buyerId:loggedInUser._id,
                orderId:{$eq:null},
                status:"draft",
                "menuDetail.menuId":menuId
            })
            if(!existingCart){
                throw new AppError({message:"You have not added this item in your cart",code:400})
            }
            if(existingCart.quantity<quantity){
                throw new AppError({message:"You cannot update hte cart with the quantity you donot have", code:400})
            }
            let cartItem=null
            if(+existingCart.quantity===+quantity || +quantity<=0){
                cartItem=await CartSvc.removeFromCart(existingCart._id)
                res.json({
                    result:cartItem,
                    message:"Cart item removed successfully",
                    meta:null
                })
            }else{
                cartItem=await CartSvc.reduceQuantity(existingCart,quantity)
                res.json({
                    result:cartItem,
                    message:"Cart updated successfully",
                    meta:null
                })
            }

        }
        catch(exception){
            next(exception)
        }
    }
    listMyCart=async(req,res,next)=>{
        try{
            const loggedInUser=req.authUser
            const cartItems=await CartSvc.getCartList({
                buyerId:loggedInUser._id,
                orderId:{$eq:null},
                status:"draft"
            })
            res.json({
                result:cartItems,
                message:"CART list fetched",
                meta:null
            })
        }
        catch(exception){
            next(exception)
        }
    }
    deleteFromCart=async(req,res,next)=>{
        try{
            const cartItem=await CartSvc.getCartItem({
                _id:req.params.cartId,
                buyerId:req.authUser._id,
                status:"draft",
                orderId:{$eq:null}
            })
            if(!cartItem){
                throw new AppError({message:"CartItem doesnot exists", code:400})
            }
            const removedItem=await CartSvc.removeFromCart(req.params.cartId)
            res.json({
                result:removedItem,
                message:"Cart Item is successfully deleted",
                meta:null
            })
        }
        catch(exception){
            next(exception)
        }
    }
    createOrder=async(req,res,next)=>{
        try{
            const {cartId,discount,deliveryCharge}=req.body
            const cartItems=await CartSvc.getCartList({
                _id:{$in:cartId},
                buyerId:req.authUser._id,
                orderId:{$eq:null},
                status:"draft"
            })
            if(!cartItems){
                throw new AppError({message:"Cart doesnot exists",code:400})
            }
            const orderObj=await CartSvc.createCartObject(cartItems,discount,deliveryCharge,req.authUser)
           
            const order=await CartSvc.createOrder(orderObj)
            res.json({
                result:order,
                message:"Your order has been placed successfully",
                meta:null
            })
        }
        catch(exception){
            next(exception)
        }
    }
}
const CartCtrl=new CartController()
module.exports=CartCtrl