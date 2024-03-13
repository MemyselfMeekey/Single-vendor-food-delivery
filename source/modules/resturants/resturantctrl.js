class resturantsCtrl{
    nearyou=((req,res,next)=>{
        res.json({
            message:"Resturants near you"
        })
        next()
    })
    fivestar=((req,res,next)=>{
        res.json({
            message:"LIST OF FIVE STAR HOTELS"
        })
        next()
    })
    toprated=((req,res,next)=>{
        res.json({
            message:"TOP RATED"
        })
    })

}
const restctrl=new resturantsCtrl()
module.exports=restctrl