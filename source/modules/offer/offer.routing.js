const router=require("express").Router()
const loginCheck=require("../../middlware/loginCheck.midd")
const rolePermission=require("../../middlware/roleCheck.middleware")
const bodyvalidator=require("../../middlware/validator")
const OfferCtrl = require("./offer.ctrl")
const {offerCreateDto,OfferUpdateDto}=require("./offer.require")

router.route('/')
    .post(loginCheck,rolePermission('admin'),bodyvalidator(offerCreateDto),OfferCtrl.createOffer)
    .get(loginCheck,rolePermission("admin"),OfferCtrl.index)
router.route('/:id')
    .get(loginCheck,rolePermission('admin'),OfferCtrl.view)
    .put(loginCheck,rolePermission('admin'),bodyvalidator(OfferUpdateDto),OfferCtrl.updateOffer)
    .delete(loginCheck,rolePermission('admin'),OfferCtrl.deleteOffer)
router.get("/home/list",loginCheck,rolePermission('admin'),OfferCtrl.listForHome)

module.exports=router