const AppError = require("../../exception/error.app")
const MenuDB = require("./menu.db")
const slugify=require("slugify")
class MenuService {
    tranformCreateObject = (data, authUser) => {
        try {
            const formattedData = {
                ...data
            }
            console.log(data.name)
            formattedData.slug = slugify(data.name, { lower: true })
            let images = []
            if (data.images) {
                images = data.images.map(image => image.filename)
            }
            if (images.length) {
                formattedData.images = images
            }
            else {
                formattedData.images = null
            }
            formattedData.category=data.category || null
            formattedData.afterDiscount = data.price - data.price * data.discount / 100
            
            formattedData.createdBy = authUser
            return formattedData
        }
        catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    createMenu = async (data) => {
        try {
            const menu = new MenuDB(data)
            return await menu.save()
        }
        catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    getPageCount = async (filter) => {
        try {
            const count = await MenuDB.countDocuments(filter)
            return count
        }
        catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    getDataByFilter = async ({ offset, filter, limit }) => {
        try {
            const data = await MenuDB.find(filter)
                .populate('createdBy', ['_id', 'name', 'email'])
                .populate('category', ['_id', 'name', 'slug'])
                .sort({ '_data': 'desc' })
                .skip(offset)
                .limit(limit)
            return data
        }
        catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    getDataById=async(id)=>{
        try{
            const data=await MenuDB.findById(id)
            .populate('createdBy', ['_id', 'name', 'email'])
            .populate('category', ['_id', "name", 'slug'])
            return data
        }
        catch(exception){
            throw exception
        }
    }
    tranformUpdateObject=async(data,oldMenu,authUserId)=>{
        try{
            const formattedData={
                ...data
            }
            formattedData.slug=slugify(data.name,{lower:true})
            let images=oldMenu.images
            if(data.images){
                images=data.images.map(image=>image.filename)
            }
            
            if(data.images.length>=0){
                formattedData.images=images
            }
            else{
                formattedData.images=null
            }
            formattedData.category=data.category || null
            formattedData.afterDiscount=data.price-data.price*data.discount/100
            formattedData.updatedBy=authUserId
            return formattedData
        }
        catch(exception){
            throw exception
        }
    }
    updateData=async(id,data)=>{
        try{
        const update=await MenuDB.findByIdAndUpdate(id,{
            $set:data
        })
        return update
    }
    catch(exception){
        console.log(exception)
        throw exception
    }
    }
    deleteById=async(id)=>{
        try{
            const deleteMenu=await MenuDB.findByIdAndDelete(id)
            if(!deleteMenu){
                throw new AppError({message:"MenuId doesnot exists",code:400})
            }
            return deleteMenu
        }
        catch(exception){
            console.log(exception)
            throw exception
        }
    }
}
const MenuSvc = new MenuService()
module.exports = MenuSvc