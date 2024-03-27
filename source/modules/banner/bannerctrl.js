const AppError = require("../../exception/error.app")
const BannerSvc = require("./services.banner")
const {deleteFile}=require("../../configuration/delteFiles")
class BannerCtrl {
    create = async (req, res, next) => {
        try {
            // console.log(req.body)
            const payload = BannerSvc.transformCreateObject(req.body, req.authUser._id)
            await BannerSvc.createBanner(payload)
            res.json({
                result: payload,
                message: "Banner has been created",
                meta: null
            })
        }
        catch (exception) {
            console.log("This is exception in bannerCtrl", exception)
            next(exception)
        }
    }
    index = async (req, res, next) => {
        try {
            
            const page = +req.query.page || 1 //ignores: 0,null,undefined,false,empty
            const limit = +req.query.limit || 10
            if (page <= 0 || limit <= 0) {
                throw new AppError({ message: "Page number should begin from 1", code: 400 })
            }
           
            const offset = (page - 1) * limit
            let filter = {}
            if (req.query.search) {
                filter = {
                    $or: [
                        { title: new RegExp(req.query.search, 'i') },
                        { url: new RegExp(req.query.search, 'i') },
                        { status: new RegExp(req.query.search, 'i') }
                    ]
                }

            }
            
            const count = await BannerSvc.getTotalCount(filter)
            
            const data = await BannerSvc.getDataByFilter({ offset, filter, limit })
            res.json({
                result: data,
                message: "Banner has been fetched",
                meta: {
                    page: page,
                    limit: limit,
                    count: count
                }
            })
        }
        catch (exception) {
            next(exception)
        }
    }
    view=async(req,res,next)=>{
        try{
            const id=req.params.id
            if(!id){
                throw new AppError({message:"Id is required",code:400})
            }
            const detail=await BannerSvc.getDataById(id)
            if(!detail){
                throw new AppError({message:"Banner doesnot exist",code:400})
            }
            res.json({
                result:detail,
                messge:"Banner Detail fetched",
                meta:null
            })
        }
        catch(exception){
            next(exception)
        }
    }
    update=async(req,res,next)=>{
        try{
            const banner=await BannerSvc.getDataById(req.params.id)
            if(!banner){
                throw new AppError({message:"Given Id has no banner listed",code:400})
            }
            const payload=BannerSvc.transformUpdateObject(req.body,banner,req.authUser._id)
            const updateData=await BannerSvc.updateBan(banner._id,payload)
            if(!updateData){
                throw new AppError({message:"Banner cannot be updated",code:400})
            }
            if(updateData.image!==payload.image){
                deleteFile('./public/uploads/banner'+updateData.image)
            }
            res.json({
                result:updateData,
                message:"This Banner is Updated Successfullly",
                meta:null
            })
        }
        catch(exception){
          next(exception)
        }
    }
    delete=async(req,res,next)=>{
        try{
            const banner=await BannerSvc.getDataById(req.params.id)
            console.log(banner)
            if(!banner){
                throw new AppError({message:"Banner does not exists",code:400})
            }
            const deletedBanner=await BannerSvc.deleteById(banner._id)
            if(deletedBanner.image){
                deleteFile("./public/uploads/banner"+deletedBanner.image)
            }
            res.json({
                result:"",
                message:"Deleted given banner succesfully",
                meta:null
            })
        }
        catch(exception){
            next(exception)
        }
    }
    listforhome=async(req,res,next)=>{
        try{
            const bannerList=await BannerSvc.getDataByFilter({
                offset:0,
                limit:10,
                filter:{
                    status:"active"
                }
            })
            res.json({
                result:bannerList,
                message:"These banner will be listed in Homepage",
                meta:null
            })
        }
        catch(exception){
            next(exception)
        }
    }
}
const BanCtrl = new BannerCtrl()
module.exports = BanCtrl