class menuCtrl{
    create=(req,res,next)=>{
        try{

        }
        catch(exception){

        }
    }

    index=(req,res,next)=>{
       try{

       }
       catch(exception){
        next(exception)
       }
    }
    view=(req,res,next)=>{
        try{

        }
        catch(exception){
         next(exception)
        }
    }
    update=(req,res,next)=>{
        try{

        }
        catch(exception){
            next(exception)
        }
    }
    delete=(req,res,next)=>{
        try{

        }
        catch(exception){
            next(exception)
        }
    }
    homeList=(req,res,next)=>{
        try{

        }
        catch(exception){
         next(exception)
        }
    }

}
const MenuCtrl=new menuCtrl()
module.exports=MenuCtrl