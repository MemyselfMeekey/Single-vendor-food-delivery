//making a route
const router=require('express').Router()
const authRouter = require("../modules/authorization/auth.routing")
const banner=require("../modules/banner/banner.routing")
const category=require("../modules/category/cat.routing")
const menu=require("../modules/menu/menu.routing")
const user=require("../../source/modules/User/user.router")
const offer=require("../modules/offer/offer.routing")

router.use("/auth",authRouter)
router.use("/banner",banner)
router.use("/category",category)
router.use("/menu",menu)
router.use("/user",user)
router.use("/offer",offer)



router.use("/",(req,res)=>{
    res.json({
        result:"this is not available",
        messgae:"You have entered the wrong url",
        meta:null
    })
})

module.exports=router

