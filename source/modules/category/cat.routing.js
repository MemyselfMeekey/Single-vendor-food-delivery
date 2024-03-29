const router=require("express").Router()
const { pathSet,uploader } = require("../../middlware/imageupload")
const loginCheck = require("../../middlware/loginCheck.midd")
const rolePermission = require("../../middlware/roleCheck.middleware")
const bodyvalidator = require("../../middlware/validator")
const CatCtrl = require("./cat.ctrl")
const { CatCreateDto, CatUpdateDto } = require("./cat.require")



router.route('/')
.post(loginCheck,rolePermission("admin"),pathSet('/uploads/cat'),uploader.single('image'),bodyvalidator(CatCreateDto),CatCtrl.create)
.get(loginCheck,rolePermission('admin'),CatCtrl.index)
router.route('/:id')
    .get(loginCheck,rolePermission('admin'),CatCtrl.view)
    .put(loginCheck,rolePermission('admin'),pathSet('/uploads/cat'),uploader.single('image'),bodyvalidator(CatUpdateDto),CatCtrl.update)
    .delete(loginCheck,rolePermission('admin'),CatCtrl.delete)

router.get("/home/list",loginCheck,rolePermission('admin'),CatCtrl.homeList)
// router.get("/:slug/by-slug",CatCtrl.dataBySlug)
module.exports=router