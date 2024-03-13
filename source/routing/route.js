//making a route
const router=require('express').Router()
const authRouter = require("../modules/authorization/auth.routing")
const banner=require("../modules/banner/banner.routing")
const resturants=require("../modules/resturants/resturants.routing")
const foodcategory=require("../modules/foodcategory/foodcat.routing")
const favourites=require("../modules/favourites/fav.routing")


router.use("/auth",authRouter)
// router.use("/banner",banner)
router.use("/resturants",resturants)
// router.use("/foodcategory",foodcategory)
// router.use("/favourites",favourites)


router.use("/",(req,res)=>{
    res.json({
        result:"this is not available",
        messgae:"You have entered the wrong url"
    })
})

module.exports=router

