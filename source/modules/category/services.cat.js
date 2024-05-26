const slugify = require("slugify")
const AppError = require("../../exception/error.app")
const CatDB = require("./db.cat")

class CategoryService {
    transformCreateObject = (data, authUserId) => {
        try {
            const formattedData = {
                ...data
            }
        
            formattedData.slug = slugify(data.name, { lower: true })
           
            if (!data.image) {
                throw new AppError({ message: "Your data must consist of an image", code: 400 })
            }
            else {
                formattedData.image = formattedData.image.filename
            }
            formattedData.createdBy = authUserId
            return formattedData
        }
        catch (exception) {
            throw exception
        }
    }
    createCat = async (data) => {
        try {
            console.log("backend",data)
            const cat = new CatDB(data)
            return await cat.save()
        }
        catch (exception) {
            console.log("Exception in createCat", exception)
            throw exception
        } 
    }
    getTotalCount=async(filter)=>{
        try{
            const data=await CatDB.countDocuments(filter)
            return data
        }
        catch(exception){
            console.log("Exception in getTotalCOunt",exception)
            throw exception
        }
    }
    getDataByFilter=async({offset,filter,limit})=>{
        try{
            console.log(offset,limit,filter)
            const data=await CatDB.find(filter)
                .populate('createdBy',['_id','name','email'])//user table column
                .populate("parentId", ['name', "_id", "slug"])
                .sort({'_id':"desc"})
                .skip(offset)
                .limit(limit)
            return data
        }
        catch(exception){
            console.log("Exception in getDataByFilter",exception)
            throw exception
        }
    }
    getDataById=async(id)=>{
        try{
            const data=await CatDB.findById(id)
            .populate('createdBy',['_id','name','email'])
            return data
        }
        catch(exception){
            throw exception
        }
    }
    transformUpdateObject=async(data,oldCat,authUserId)=>{
        try{
            let formattedData={
                ...data
            }
            if(data.image){
                formattedData.image=data.image.filename
            }
            else{
                formattedData.image=oldCat.image
            }
            formattedData.updatedBy=authUserId
            return formattedData
        }
        catch(exception){
            throw exception
        }
    }
    updateData=async(id,data)=>{
        try{
            console.log(id,data)
            const updateCat=await CatDB.findByIdAndUpdate(id,{
                $set:data
            },{new:true})
            console.log(updateCat)
            return updateCat
        }
        catch(exception){
            throw exception
        }
    }
    deleteById=async(id)=>{
        try{
            const deleteCat=await CatDB.findByIdAndDelete(id)
            if(!deleteCat){
                throw new AppError({message:"Category not delted. Please check your code",code:400})
            }
            return deleteCat
        }
        catch(exception){
            throw exception
        }
    }
    
}
const CatSvc = new CategoryService()
module.exports = CatSvc