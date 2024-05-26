const AppError = require("../../exception/error.app")
const MenuSvc = require("./services.menu")
const {deleteFile}=require("../../configuration/delteFiles")
const CatSvc=require("../category/services.cat")

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
                message:"Menu has been created",
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
        const data=await MenuSvc.getDataByFilter({offset,filter,limit})
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
    view=async(req,res,next)=>{
        try{
            const id=req.params.itemId
            if(!id){
                throw new AppError({messsage:"Id is required",code:400})
            }
            const detail=await MenuSvc.getDataById(id)
            if(!detail){
                throw new AppError({message:"Menu doesnot exists",code:400})
            }
            res.json({
                result:detail,
                message:"Menu Detail Fetched",
                meta:null
            })
        }
        catch(exception){
            console.log("Exception in view",exception)
         next(exception)
        }
    }
    update=async(req,res,next)=>{
        try{
            const menuId=req.params.itemId
            const menu=await MenuSvc.getDataById(menuId)
            if(!menu){
                throw new AppError({message:"Menu Doesnot exists",code:400})
            }
            const payload=await MenuSvc.tranformUpdateObject(req, menu, req.authUser._id)
            const updatedData=await MenuSvc.updateData(menu._id,payload)
            if(!updatedData){
                throw new AppError({message:"Product cannot be updated",code:400})
            }
            if(updatedData.images!==payload.images){
                deleteFile('./images/uploads/menu'+updatedData.images)
            }
            res.json({
                result:{
                    updatedData:updatedData,
                    message:"Menu has been successfully updated",
                    meta:null
                }
            })

        }
        catch(exception){
            next(exception)
        }
    }
    delete=async(req,res,next)=>{
        try{
            const menuId=req.params.itemId
            const menu=await MenuSvc.getDataById(menuId)
            if(!menu){
                throw new AppError({message:"MenuId doesnot exists",code:400})
            }
           
            const deleteMenu=await MenuSvc.deleteById(menu._id)
           
            if(deleteMenu.images){
                deleteFile('.images/uploads/menu'+deleteMenu.images)
            }
            res.json({
                result:deleteMenu.name,
                message:"Menu has been deleted",
                meta:null
            })
        }
        catch(exception){
            next(exception)
        }
    }
    homeList=async(req,res,next)=>{
        try{
            const menulist=await CatSvc.getDataByFilter({
                offset:0,
                limit:(+req.query.limit ||5 ),
                filter:{
                    status:"active",
                    showInHome:true
                }
            })
            res.json({
                result:menulist,
                message:"Menu for homepage",
                meta:null
            })
        }
        catch(exception){
         next(exception)
        }
    }

}
const MenuCtrl=new menuCtrl()
module.exports=MenuCtrl