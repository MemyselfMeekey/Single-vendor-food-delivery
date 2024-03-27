const BannerModel=require("./db.banner")
class BannerService{
    transformCreateObject=(data,authUserId)=>{
      
        const formattedData={
            ...data
        }
        
        formattedData.image=formattedData.image.filename
        formattedData.createdBy=authUserId
        return formattedData
    }
    createBanner=async(data)=>{
        try{
            const banner=new BannerModel(data)
            return await banner.save()
        }
        catch(exception){
            throw exception
        }
    }
    getTotalCount=async(filter)=>{
        try{
          
            const count=await BannerModel.countDocuments(filter)
            return count
        }
        catch(exception){
            throw exception
        }
    }
    getDataByFilter=async({offset,filter,limit})=>{
        try{
            const data=await BannerModel.find(filter)
            .populate("createdBy",["_id","name","email"])
            .sort({'_id':"desc"})
            .skip(offset)
            .limit(limit)
            return data
        }
        catch(exception){
            throw exception
        }
    }
}
const BannerSvc=new BannerService()
module.exports=BannerSvc