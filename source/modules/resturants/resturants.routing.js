const router=require("express").Router()
const restctrl=require("../resturants/resturantctrl")

router.use("/nearyou",restctrl.nearyou)
router.use("/5star",restctrl.fivestar)
router.use("/toprated",restctrl.toprated)


module.exports=router