const { ConnectionStates } = require("mongoose")
const OfferSvc = require("./offer.service")

class OfferControl{
    createOffer=async(req,res,next)=>{
        try{
            const payload=req.body
            const menuId=await OfferSvc.addMenu(req.body.menu)
           
          const menuDetail=await OfferSvc.getDetailsById(menuId)
          
            const allDetails=await OfferSvc.getAllDetails(menuDetail,payload)
          
           const offer=await OfferSvc.create(allDetails)

           res.json({
            result:offer,
            message:"Offer has been created",
            meta:null
           })
        }   
        catch(exception){
            next(exception)
        }
    }
}
const OfferCtrl=new OfferControl()
module.exports=OfferCtrl