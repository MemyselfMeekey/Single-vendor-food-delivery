const {genRanStr}=require("../../configuration/randomstring.generator")
const UserModel = require("../../database/db.mongoose")
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
                <p>Your account has been registered successfully. Please click the link below to activate your account or copy paste the url</p>
                <a href="${process.env.FRONTEND_URL}activate/${user.activationToken}">${process.env.FRONTEND_URL}</a><br>
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
    userStore=async(data)=>{
        try{
            const user=new UserModel(data)
            return await user.save()
        }
        catch(exception){
            throw exception
        }
    }
}
module.exports=new services()