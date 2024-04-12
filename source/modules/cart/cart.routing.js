
const loginCheck = require("../../middlware/loginCheck.midd")
const rolePermission = require("../../middlware/roleCheck.middleware")
const bodyvalidator = require("../../middlware/validator")
const CartCtrl = require("./cart.ctrl")
const {AddToCartDto, RemoveToCartDto, OrderDto}=require("./cart.require")
const router=require("express").Router()

router.post("/create",loginCheck,rolePermission(['customer','admin']),bodyvalidator(AddToCartDto),CartCtrl.addToCart)
router.post('/remove',loginCheck,rolePermission(['customer','admin']),bodyvalidator(RemoveToCartDto),CartCtrl.removeFromCart)
router.get('/list',loginCheck,rolePermission(['customer','admin']),CartCtrl.listMyCart)
router.delete('/:cartId',loginCheck,rolePermission(['customer','admin']),CartCtrl.deleteFromCart)
router.post("/order",loginCheck,rolePermission(['customer','admin']),bodyvalidator(OrderDto),CartCtrl.createOrder)

module.exports=router