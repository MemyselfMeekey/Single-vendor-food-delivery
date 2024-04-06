const router=require("express").Router()
const loginCheck=require("../../middlware/loginCheck.midd")
const rolePermission=require("../../middlware/roleCheck.middleware")
const bodyvalidator=require("../../middlware/validator")
const OfferCtrl = require("./offer.ctrl")
const offerCreateDto=require("./offer.require")
const {pathSet,uploader}=require("../../middlware/imageupload")

router.route('/')
    .post(loginCheck,rolePermission('admin'),bodyvalidator(offerCreateDto),pathSet('/uploads/offers'),uploader.single('image'),OfferCtrl.createOffer)
    .get()
router.route('/:id')
    .get()
    .put()
    .delete()

module.exports=router