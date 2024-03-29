const router=require("express").Router()
const MenuCtrl=require("./menu.ctrl")

router.route("/menu")
    .post(MenuCtrl.create)
    .get(MenuCtrl.index)
router.route("/menu/:itemId")
    .get(MenuCtrl.view)
    .put(MenuCtrl.update)
    .delete(MenuCtrl.delete)
router.get("/home/list",MenuCtrl.homeList)

module.exports=router