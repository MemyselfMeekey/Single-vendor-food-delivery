const AppError = require("../../exception/error.app")
const CatSvc = require("./services.cat")
const {deleteFile}=require("../../configuration/delteFiles")
const MenuSvc=require("../menu/services.menu")

class CategoryControl {
    create = async (req, res, next) => {
        try {
           
            const payload =  CatSvc.transformCreateObject(req.body, req.authUser._id)
            
            const category = await CatSvc.createCat(payload)
    
            res.json({
                result: category,
                message: "Category successfully created",
                meta: null
            })
        }
        catch (exception) {

            next(exception)
        }
    }
    index = async (req, res, next) => {
        try {
            const page = +req.query.page || 1
            const limit = +req.query.limit || 15
            if (page <= 0 || limit <= 0) {
                throw new AppError({ message: "Page number should begin from 1", code: 400 })
            }
            const offset = (page - 1) * limit
            let filter = {}
            if (req.query.search) {
                filter = {
                    $or: [
                        { name: new RegExp(req.query.search, 'i') },
                        { status: new RegExp(req.query.search, 'i') }
                    ]
                }
            }
            const count = await CatSvc.getTotalCount(filter)
            const data = await CatSvc.getDataByFilter({ offset, filter, limit })
            res.json({
                result: data,
                message: "Category Fetched",
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
    view = async (req, res, next) => {
        try {
            const id = req.params.id
            if (!id) {
                throw new AppError({ message: "ID is required", code: 400 })
            }
            const detail = await CatSvc.getDataById(id)
            if (!detail) {
                throw new AppError({ message: "ID doesn't exists", code: 400 })
            }
            res.json({
                result: detail,
                message: "ID detail fetched",
                meta: null
            })
        }
        catch (exception) {
            next(exception)
        }
    }
    update = async (req, res, next) => {
        try {
            const id=req.params.id
            
            const cat = await CatSvc.getDataById(id)
            if (!cat) {
                throw new AppError({ message: "No category was found ", code: 400 })
            }

            const payload = await CatSvc.transformUpdateObject(req.body, cat, req.authUser._id)
          
            const updatedData = await CatSvc.updateData(cat._id, payload)
            
            if(!updatedData){
                throw new AppError({message:"Category doesnot exists", code:400})
            }
            if(updatedData.image!==payload.image){
                deleteFile('./images/uploads/cat'+updatedData.image)
            }
            res.json({
                result:updatedData,
                message:"This is has been successfully updated",
                meta:null
            })
        }
        catch (exception) {
            next(exception)
        }
    }
    delete = async (req, res, next) => {
        try {
            const category = await CatSvc.getDataById(req.params.id)
            if (!category) {
                throw new AppError({ message: "Category doesnot exists", code: 400 })
            }
            const deleteCat = await CatSvc.deleteById(category._id)
            if (deleteCat.image) {
                deleteFile('./images/uploads/cat' + deleteCat.image)
            }
            res.json({
                result: category.name,
                message: "This category has been deleted",
                meta: null
            })
        }
        catch (exception) {
            next(exception)
        }
    }
    homeList = async (req, res, next) => {
        try {
            const catList=await CatSvc.getDataByFilter({
                offset:0,
                limit:(+req.query.limit || 3),
                filter:{
                    status:"active",
                    showInHome:true
                }
            }) 
            res.json({
                result:catList,
                message:"Category for homepage",
                meta:null
            })
        }
        catch (exception) {
            console.log(exception)
            next(exception)
        }
    }
    dataBySlug = async (req, res, next) => {
        try {
            const slug=req.params.slug
            
            const catDetail=await CatSvc.getDataByFilter({
                offset:0,
                limit:1,
                filter:{
                    slug:slug,
                    status:"active"
                }
            })
            const filter=MenuSvc.setFilters(req.query)
            filter.search={
                ...filter.search,
                category:{$in:[catDetail[0].id]}
            }
            const getTotalCount=await MenuSvc.getTotalCount(filter.search)
            
            
            const menu=await MenuSvc.getDataByFilter({
                offset:filter.offset,
                limit:filter.limit,
                filter:filter.search
            })
            res.json({
                result:{
                    category:catDetail[0],
                    menu:menu
                },
                message:"Data by slug has been fetched",
                meta:{
                    page:filter.page,
                    limit:filter.limit,
                    total:getTotalCount
                }
            })
        }
        catch (exception) {
            console.log(exception)
            next(exception)
        }
    }
}
const CatCtrl = new CategoryControl()
module.exports = CatCtrl