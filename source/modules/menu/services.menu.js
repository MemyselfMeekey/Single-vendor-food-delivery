const MenuDB = require("./menu.db")

class MenuService{
    tranformCreateObject=(data,authUser)=>{
        try{
            const formattedData={
                ...data
            }
            formattedData.slug=slugify(data.name,{lower:true})
            let images=[]
            if(data.images){
                images=data.images.map(image=>image.filename)
            }
            if(images.length){
                formattedData.images=images
            }
            else{
                formattedData.images=null
            }
            if(!data.category ||data.category===''||data.category===null){
                formattedData.category=null
            }
            formattedData.afterDisount=data.price-data.price*data.discount/100
            formattedData.createdBy=authUser
            return formattedData
        }
        catch(exception){
            console.log(exception)
            throw exception
        }
    }
    createMenu=async(data)=>{
        try{
            const menu= new MenuDB(data)
            return await menu.save()
        }
        catch(exception){
            console.log(exception)
            throw exception
        }
    }
    getPageCount=async(filter)=>{
        try{
            const count=await MenuDB.countDocuments(filter)
            return count
        }
        catch(exception){
            console.log(exception)
            throw exception
        }
    }
    getDataByFiler=async({offset,filter,limit})=>{
        try{
            const data=await MenuDB.findById(filter)
            .populate('createdBy',['_id','name','email'])
            .populate('category',['_id','name','slug'])
            .sort({'_data':'desc'})
            .skip(offset)
            .limit(limit)
            return data
        }
        catch(exception){
            console.log(exception)
            throw exception
        }
    }
}
const MenuSvc=new MenuService()
module.exports=MenuSvc