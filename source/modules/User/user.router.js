const router=require("express").Router()
const UserCtrl = require("./user.ctrl")
const {pathSet,uploader}=require("../../middlware/imageupload")
const bodyvalidator=require("../../middlware/validator")
const { UserCreateDto,UserUpdateDto} = require("./user.require")
const loginCheck=require("../../middlware/loginCheck.midd")
const rolePermission=require("../../middlware/roleCheck.middleware")

router.route("/")
    .post(loginCheck,rolePermission('admin'),pathSet("/uploads/user"),uploader.single('image'),bodyvalidator(UserCreateDto),UserCtrl.registerUser)
    .get(loginCheck,rolePermission('admin'),UserCtrl.getList)
router.route("/:userId")
    .get(loginCheck,rolePermission('admin'),UserCtrl.getDataById)
    .put(loginCheck,rolePermission('admin'),pathSet('/uploads/user'),uploader.single('image'),bodyvalidator(UserUpdateDto),UserCtrl.update)
    .delete(loginCheck,rolePermission('admin'),UserCtrl.deleteData)


module.exports=router