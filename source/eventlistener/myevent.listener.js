const {EventEmitter}=require("events")
const services=require("../modules/authorization/services.db")
const myEvent=new EventEmitter()
myEvent.addListener("sendRegisterMail",async(data)=>{
    await services.sendRegEmail(data)
})
module.exports=myEvent