//this file foucses on image only but multer is used to convert data from params into body
const multer=require("multer")
const fs=require("fs")
const {genRanStr}=require("../configuration/randomstring.generator")
const path=require("path")//inbuilt function
const myStorage=multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,req.uploadPath)
    },
    filename:(req,file,callback)=>{
        const ext=file.originalname.split(".").pop()
        const filename=Date.now()+"-"+genRanStr(20)+"."+ext
        callback(null,filename)
    }
})
const pathSet=(dirPath)=>{
    return(req,res,next)=>{

    const path="./images"+dirPath

    if(!fs.existsSync(path)){
        fs.mkdirSync(path,{recursive:true})
    }
    req.uploadPath=path

    next()
    }
}

const imageFilt=(req,file,callback)=>{
    const extension=file.originalname.split(".").pop()
   
    const allowedExt=['jpeg','jpg','webp','png','svg','bmp','gif']
    if(allowedExt.includes(extension.toLowerCase())){
        callback(null,true)
    }
    else{
        callback({message:"Invalid image formant was uploaded",code:400})
    }
    
}
const uploader=multer({
    storage:myStorage,
    fileFilter:imageFilt,
    limits:{
        fileSize:50000000
    }
})

module.exports={uploader,pathSet}