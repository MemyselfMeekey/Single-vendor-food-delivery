const {EventEmitter}=require("events")
const services=require("../modules/authorization/services.db")
const myEvent=new EventEmitter()
const sendOtp=new EventEmitter()
myEvent.addListener("sendRegisterMail",async(data)=>{
    await services.sendRegEmail(data)
})
sendOtp.addListener("sendOtpMail",async(data)=>{
    await services.sendOtp(data)
})
module.exports=myEvent