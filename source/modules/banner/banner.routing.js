const { pathSet, uploader } = require("../../middlware/imageupload")
const loginCheck = require("../../middlware/loginCheck.midd")
const rolePermission = require("../../middlware/roleCheck.middleware")
const bodyvalidator = require("../../middlware/validator")
const { CreateBanDto } = require("./banner.require")
const BanCtrl = require("./bannerctrl")

const router=require("express").Router()

router.route("/")
    .post(loginCheck,rolePermission('admin'),pathSet('/uploads/banner'),uploader.single('image'),bodyvalidator(CreateBanDto),BanCtrl.create)
    .get(loginCheck,rolePermission('admin'),BanCtrl.index)
router.route("/:id")
    .get()
    .put()
    .delete()

module.exports=router