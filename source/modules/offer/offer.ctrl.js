const { ConnectionStates } = require("mongoose")
const OfferSvc = require("./offer.service")
const AppError = require("../../exception/error.app")
const OfferDB = require("./db.offer")

class OfferControl{
    createOffer=async(req,res,next)=>{
        try{
            const payload=req.body

            const menuIds=await OfferSvc.addMenu(req.body.menu)
            // if (menuIds && Array.isArray(menuIds)) {
            //      menuIds.map((item) => item.menuId)  
            // } 
           
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
            console.log("I am here", exception)
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
    updateOffer=async(req,res,next)=>{
        try{
          const offerId=await OfferSvc.getDataById(req.params.id)
          if(!offerId){
            throw new AppError({message:"Offer doesnot exists",code:400})
          }
          
          const menuIds=await OfferSvc.addMenu(req.body.menu)
          const menuDetails=await OfferSvc.getDetailsById(menuIds)
          const allDetails=await OfferSvc.getAllDetails(menuDetails,req.body,req.authUser._id)
          const updatedOffer=await OfferSvc.updateOffer(offerId._id,allDetails)
          if(!updatedOffer){
            throw new AppError({message:"This offer cannot be updated",code:400})
          }
          res.json({
            result:"",
            messge:"Offer updated successfully",
            meta:null
          })
        }
        catch(exception){
            next (exception)
        }

    }
    deleteOffer=async(req,res,next)=>{
        try{
            const offer=await OfferSvc.getDataById(req.params.id)
            if(!offer){
                throw new AppError({message:"This offer doesnot exists",code:400})
            }
            const deleteOffer=await OfferSvc.deleteById(offer._id)
            if(!deleteOffer){
                throw new AppError({message:"Offer couldnot be deleted",code:400})
            }
            res.json({
                result:offer.description,
                message:"This offer has been successfully deleted",
                meta:null
            })
        }
        catch(exception){
            next(exception)
        }
    }
    listForHome=async(req,res,next)=>{
        try{
            const page=+req.query.page ||1
            const limit=+req.query.limit || 20
            if(page<=0 || limit<=0){
                throw new AppError({message:"Page number should begin frm 1",code:400})
            }
            const offset=(page-1)*limit
            let filter={
                showInHome:true
            }
            if(req.query.search){
                filter={
                    ...filter,
                    $or:[
                        {description: new RegExp(req.query.search, 'i')},
                        {price: new RegExp(req.query.search, 'i')}
                    ]
                }
            }
            const count=await OfferSvc.getTotalCount(filter)
            const offer=await OfferSvc.getDataByFilter({offset,filter,limit})
            res.json({
                result:offer,
                message:"Offer has been fetched",
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
}
const OfferCtrl=new OfferControl()
module.exports=OfferCtrl