class AppError extends Error{
    constructor({message=null,code=400,data=null}){
        super()
        throw{
            code:code,detail:detail,message:message
        }
    }
}
module.exports=AppError