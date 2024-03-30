const AppError = require("../../exception/error.app")
const MenuSvc = require("./services.menu")

class menuCtrl{
    create=async(req,res,next)=>{
        try{
            const payload=MenuSvc.tranformCreateObject(req.body,req.authUser._id)
            const menu=await MenuSvc.createMenu(payload)
            res.json({
                result:{
                    payload:payload,
                    menu:menu
                },
                message:"This is menu",
                meta:null
            })
        }
        catch(exception){
            console.log(exception)
            next(exception)
        }
    }

    index=async(req,res,next)=>{
       try{
        const page=+req.query.page ||1
        const limit=+req.query.limit || 15
        if(page<=0||limit<=0){
            throw new AppError({message:"Page number should begin from 1",code:400})
        }
        const offset=(page-1)*limit
        let filter={}
        if(req.query.search){
            filter={
                $or:[
                    {name:new RegExp(req.query.search,'i')},      
                    {description:new RegExp(req.query.search,'i')},      
                    {price:new RegExp(req.query.search,'i')},      
                    {status:new RegExp(req.query.search,'i')},      
                ]
            }
        }
        const count=await MenuSvc.getPageCount(filter)
        const data=await MenuSvc.getDataByFiler({offset,filter,limit})
        res.json({
            result:data,
            message:"Menu fetched",
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
    view=(req,res,next)=>{
        try{

        }
        catch(exception){
         next(exception)
        }
    }
    update=(req,res,next)=>{
        try{

        }
        catch(exception){
            next(exception)
        }
    }
    delete=(req,res,next)=>{
        try{

        }
        catch(exception){
            next(exception)
        }
    }
    homeList=(req,res,next)=>{
        try{

        }
        catch(exception){
         next(exception)
        }
    }

}
const MenuCtrl=new menuCtrl()
module.exports=MenuCtrl