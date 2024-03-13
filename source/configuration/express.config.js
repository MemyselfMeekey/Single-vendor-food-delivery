const express=require("express")
const router=require("../routing/route")
const food=express()



food.use(express.json())
food.use(express.urlencoded({
    extended:false
}))

food.use("/food/login",router)

food.use((req,res,next)=>{
    next({code:404,messsage:"not found",detail:""})
})

food.use((err,req,res,next)=>{
    console.log("Here is the error",err)

    let code=err.code || 500;
    let data=err.data || {}
    let message=err.message ||"SERVER ERROR"

    res.status(code).json({
        result:data,
        message:message,
        meta:null
    })
})

module.exports=food