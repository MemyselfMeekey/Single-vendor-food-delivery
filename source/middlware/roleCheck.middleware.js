const rolePermission=(role)=>{
    return (req,res,next)=>{
        const user= req.authUser
        if(
            (typeof role==='string'&&role===user.role)
                ||
            (Array.isArray(role)&&role.includes(user.role))
        ){
            next()
        }
        else{
            next({code:403,message:"This is an error in roleCheck"})
        }
    }
}
module.exports=rolePermission