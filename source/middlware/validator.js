const bodyvalidator=(schema)=>{
    return (req,res,next)=>{
       //you need to use multer
        try{
            const data=req.body
        
            next()
        }
        catch(exception){
            let errors={}
            console.log(exception)
            next({details:errors,code:422,message:"validation failed"})
        }
    } 
}
module.exports=bodyvalidator