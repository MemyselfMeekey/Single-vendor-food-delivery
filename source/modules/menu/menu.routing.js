const router=require("express").Router()
const MenuCtrl=require("./menu.ctrl")
const loginCheck=require("../../middlware/loginCheck.midd")
const rolePermission=require("../../middlware/roleCheck.middleware")
const {pathSet,uploader}=require("../../middlware/imageupload")
const bodyvalidator=require("../../middlware/validator")
const {MenuCreateDto}=require("./menu.require")

router.route("/")
    .post(loginCheck,rolePermission("admin"),pathSet('uploads/menu'),uploader.array('images'),bodyvalidator(MenuCreateDto),MenuCtrl.create)
    .get(loginCheck,rolePermission('admin'),MenuCtrl.index)
router.route("/:itemId")
    .get(MenuCtrl.view)
    .put(MenuCtrl.update)
    .delete(MenuCtrl.delete)
router.get("/home/list",MenuCtrl.homeList)

module.exports=router