const bodyvalidator=(schema)=>{
    return async(req,res,next)=>{
       //you need to use multer
        try{
            
            const data=req.body
          
            if(req.files && req.files.length>0){
               
                let images=[]
                let fieldName=""
                Object.keys(req.files).map((index)=>{
                    const image=req.files[index]
                    images.push(image)
                    fieldName=images.fieldname
                })
                data[fieldName]=images
            }else if(req.file){
                
                data[req.file.fieldname]=req.file
               
            }
            await schema.validateAsync(data,{abortEarly:false})
         
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