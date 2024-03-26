
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
}