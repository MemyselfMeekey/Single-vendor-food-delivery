const router=require("express").Router()
const loginCheck=require("../../middlware/loginCheck.midd")
const rolePermission=require("../../middlware/roleCheck.middleware")
const bodyvalidator=require("../../middlware/validator")
const offerCreateDto=require("./offer.require")
router.route('/')
    .post(loginCheck,rolePermission('admin'),bodyvalidator(offerCreateDto),offerCtrl.createOffer)

module.exports=router