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
    .delete(loginCheck,rolePermission('admin'),OfferCtrl.deleteOffer)
router.put('/:id/edit',loginCheck,rolePermission('admin'),bodyvalidator(OfferUpdateDto),OfferCtrl.updateOffer)
router.get("/home/list",OfferCtrl.listForHome)

module.exports=router