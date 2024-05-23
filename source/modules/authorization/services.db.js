const Mail = require("nodemailer/lib/mailer")
const {genRanStr}=require("../../configuration/randomstring.generator")
const {UserModel,PatModel} = require("../../database/db.mongoose")
const AppError = require("../../exception/error.app")
const Mailing = require("../../services/mailing")
class services{
    transformRegisterData=(data)=>{
        try{
            data.status="inactive"
            const token=genRanStr()
            data.activationToken=token
            const date=new Date()

            date.setHours(date.getHours()+3)
            data.expiryDate=date
            
            return data
        }
        catch(exception){
            console.log("This is in authservices tranformRegisterdata",exception)
            throw exception
        }
    }
    //sending email after registration
    sendRegEmail=async(user)=>{
       
        try{
            
            await Mailing.sendEmail({
                to:user.email,
                subject:"About activation",
                html:`
                Dear <b>${user.name}</b>, <br>
                <p>Your account has been registered successfully. Please click the link below to activate your account or copy paste the url.</p>
                <a href="${process.env.FRONTEND_URL}activation/${user.activationToken}">${process.env.FRONTEND_URL}activation/${user.activationToken}</a><br>
                <h1>Donot reply to this email</h1>
                <b>Best Regards</b>
                `,
                text:`
                Dear ${user.name}\n
                Your account has been registered successfully. Please click the link to activate your account or copy paste the given url\n
                ${process.env.FRONTEND_URL}activate/${user.activationToken}\n
                Best Regards \n
                `
            })
        }
        catch(exception){
            console.log("This is in authservices sendRegEmail",exception)
            throw exception
        }
    }
    sendOtp=async({email,otp})=>{
        try{
            console.log(otp)
            await Mailing.sendEmail({
                to:email,
                subject:"Otp for logging in",
                html:`Your otp is ${otp}`,
                text:`Dear ${email},\n <p>Please verify the otp given below</p><br><h1>Otp</Otp>${otp}`
            })
        }
        catch(exception){
            console.log("This is an error in sendOtp services",exception)
            throw exception
        }
    }
    userStore=async(data,authUser)=>{
        try{
            const user=new UserModel(data)
            user.createdBy=authUser
            return await user.save()
        }
        catch(exception){
            throw exception
        }
    }
    getSingleUserByFilter=async(filter)=>{
        try{
           
            const user=await UserModel.findOne(filter)
          
            return user
        }   
        catch(exception){
            throw exception
        }
    }
    updateUser=async(id,data)=>{
        try{
            console.log("came data",data)

            const update = await UserModel.findByIdAndUpdate(id, {
                $set: data
            },{
                new:true
            });
    
            // Log the updated data to verify changes
           
            console.log(update)
            if (!update) {
                throw new AppError({ message: "User does not exist" });
            }
    
            return update;
        }
        catch(exception){
            throw exception
        }
    }
    forgetPassEmail=async({email,name,token})=>{
        try{    
            await Mailing.sendEmail({
                to:email,
                subject:"RESETTING THE PASSWORD",
                html:`
                Dear <b> ${name}</b>,</br>
                <p>You have requested for the password change.</p><br>
                <p>if this is your request please click the link below, or ignore the request</p>
                <p>Your account has been registered successfully. Please click the link below to activate your account or copy psatethe url</p>
                <a href="${process.env.FRONTEND_URL}forgetpass/${token}/verification">${process.env.FRONTEND_URL}forgetpass/${token}/verification
                </a><br>
                <p>Your link is activated only for 2 hours</p>
                <b> Regards</b>
                `,
                text:`
                Dear ${name}\n
                You have requested to change the password. If this is your request, please copy and paste the link below,or ignore this message
                ${process.env.FRONTEND_URL}activate/${token}\n
                Regards\n
                `
            })
        }
        catch(exception){
            throw exception
        }
    }
    pat=async({userId,token,refreshToken})=>{
        try{
            const user=await PatModel({userId,token,refreshToken})
            return await user.save()
        }
        catch(exception){
            throw exception
        }
    }
    deleteAcessToken=async(token,refreshToken)=>{
        try{
            
            const personalToken=await PatModel.deleteOne({
                token:token,
                refreshToken:refreshToken
                
            })
            return personalToken
        }
        catch(exception){
            throw exception
        }
    }
}
module.exports=new services()