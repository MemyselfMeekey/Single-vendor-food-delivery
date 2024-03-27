const fs=require("fs")
const deleteFile=(path)=>{
    if(fs.existsSync(+path)){
        fs.unlinkSync(path)
    }
}
module.exports={deleteFile}