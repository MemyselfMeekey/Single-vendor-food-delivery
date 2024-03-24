const express=require("express")
require("./database.connection")
const router=require("../routing/route")
const food=express()
const myEvent=require("../../source/eventlistener/myevent.listener")
const {MongooseError}=require('mongoose')

food.use((req,res,next)=>{
    req.myEvent=myEvent
    next()
})

food.use(express.json())
food.use(express.urlencoded({
    extended:false
}))

food.use("/food",router)

food.use((req,res,next)=>{
    next({code:404,messsage:"not found",detail:""})
})

food.use((err,req,res,next)=>{
    console.log("Garbage Collector",err)

    let code=err.code || 500;
    let data=err.data || {}
    let message=err.message ||"SERVER ERROR"

    if(err.code===11000){
        const keys=Object.keys(err.keyPattern)
        console.log({keys})
        keys.map((fieldMap)=>{
            data[fieldName]=fieldName+"should be unique"
        })
        message="validation failed",
        code="422"
    }

    res.status(code).json({
        result:data,
        message:message,
        meta:null
    })
})

module.exports=food