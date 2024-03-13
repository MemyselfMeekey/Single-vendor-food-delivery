const bodyvalidator=(schema)=>{
    return (req,res,next)=>{
       //you need to use multer
        try{
            const data=req.body
            console.log(data)
           res.json({
            result:data,
            message:"this is data",
            meta:null
           })
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