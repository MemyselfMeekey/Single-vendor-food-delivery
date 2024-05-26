const router=require("express").Router()
const MenuCtrl=require("./menu.ctrl")
const loginCheck=require("../../middlware/loginCheck.midd")
const rolePermission=require("../../middlware/roleCheck.middleware")
const {pathSet,uploader}=require("../../middlware/imageupload")
const bodyvalidator=require("../../middlware/validator")
const {MenuCreateDto, MenuUpdateDto}=require("./menu.require")

router.route("/")
    .post(loginCheck,rolePermission('admin'),pathSet('/uploads/menu'),uploader.array('images'),bodyvalidator(MenuCreateDto),MenuCtrl.create)
    .get(loginCheck,rolePermission('admin'),MenuCtrl.index)
router.route("/:itemId")
    .get(loginCheck,rolePermission('admin'),MenuCtrl.view)
    .delete(loginCheck,rolePermission('admin'),MenuCtrl.delete)
router.put('/:itemId/edit',loginCheck,rolePermission('admin'),pathSet('/uploads/menu'),uploader.array('images'),bodyvalidator(MenuUpdateDto),MenuCtrl.update)
router.get("/home/list",loginCheck,MenuCtrl.homeList)

module.exports=router