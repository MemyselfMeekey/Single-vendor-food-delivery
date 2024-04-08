const { ConnectionStates } = require("mongoose")
const OfferSvc = require("./offer.service")
const AppError = require("../../exception/error.app")

class OfferControl{
    createOffer=async(req,res,next)=>{
        try{
            const payload=req.body
            const menuIds=await OfferSvc.addMenu(req.body.menu)
            if (menuIds && Array.isArray(menuIds)) {
                 menuIds.map((item) => item.menuId)  
            } 
           
            const menuDetails=await OfferSvc.getDetailsById(menuIds)
            
            const allDetails=await OfferSvc.getAllDetails(menuDetails,payload,req.authUser._id)
          
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
    index=async(req,res,next)=>{
        try{
            const page= +req.query.page || 1
            const limit=+req.query.limit || 12
            if(page <=0 || limit <=0){
                throw new AppError({message:"Pge number and limit should begin from 1", code:400})
            }
            const offset=(page-1)*limit
            let filter={}
            if(req.query.search){
                filter={
                    $or:[
                        { description: new RegExp(req.query.search, 'i') },
                        { price: new RegExp(req.query.search, 'i') },
                        {offerPrice:new RegExp(req.query.search, 'i')}
                    ]
                }
            }
            const count=await OfferSvc.getTotalCount(filter)
            const offerData=await OfferSvc.getDataByFilter({offset,filter,limit})
            res.json({
                result:offerData,
                message:"Offfer has been fetched",
                meta:{
                    page:page,
                    limit:limit,
                    count:count
                }

            })

        }
        catch(exception){
            next(exception)
        }
    }
    view=async(req,res,next)=>{
        try{
            const id=req.params.id
            if(!id){
                throw new AppError ({message:"Please enter the id",code:400})
            }
            const idDetail=await OfferSvc.getDataById(id)
            if(!idDetail){
                throw new AppError({message:"Id doesnot exists",code:400})
            }
            res.json({
                result:idDetail,
                message:"Offer Detail Fetched",
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