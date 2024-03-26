class bannerCtrl{
    create=async(req,res,next)=>{
        try{
            const payload=""
        }
        catch(exception){
            console.log("This is exception in bannerCtrl",exception)
            next(exception)
        }
    }
}