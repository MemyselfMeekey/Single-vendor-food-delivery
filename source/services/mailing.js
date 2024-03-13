require("dotenv").config()
const nodemailer=require("nodemailer")
class Mailing{
    #transporter
    constructor(){
        try{
            this.#transporter=nodemailer.createTransport({
                host:process.env.SMTP_HOST,
                port:587,
                secure:false,
                auth:{
                    user:process.env.SMTP_USER,
                    pass:process.env.SMTP_PASS
                }
            })

        }
        catch(exception){
            console.log("mail connection error", exception)
            throw exception
        }
        }
        sendEmail=async({to,subject,html=null,text})=>{
            console.log(to,subject,html,text)
            try{
                const status=await this.#transporter.sendMail({//to send the email
                    to:to,
                    subject:subject,
                    from:process.env.SMTP_FROM,
                    html:html,//if not text is itself as html
                    text:text || html
                    
                })
                return status
            }
            catch(exception){
                console.log("exception in send email mailing js", exception)
                throw exception
    
            }
        }
    
}
module.exports=new Mailing()
