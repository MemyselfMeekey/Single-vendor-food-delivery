require("dotenv").config()
const nodemailer=require("nodemailer")
class Mailing{
    #transporter
    constructor(){
        try{
            this.#transporter=nodemailer.createTransport({
                service:'gmail',
                host:'smtp.gmail.com',
                port:587,
                auth:{
                    user:'nuwakotedon2062@gmail.com',
                    pass:'porsiempreenmisrecuerdos_1011'
                }
            })

        }
        catch(exception){
            console.log("mail connection error", exception)
            throw exception
        }
        }
        sendEmail=async({to,subject,html=null,text})=>{
          
            try{
                const status=await this.#transporter.sendMail({//to send the email
                    to:to,
                    subject:subject,
                    from:'fooddelivery123@gmail.com',
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
