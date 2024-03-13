//Making a server 
const http=require("http")
const food=require("./source/configuration/express.config.js")

const httpServ=http.createServer(food)

httpServ.listen(4005,'127.0.0.1',(err)=>{
    if(!err){
        console.log("Server is finally running")
    }
    else{
        console.log(err)
    }
})