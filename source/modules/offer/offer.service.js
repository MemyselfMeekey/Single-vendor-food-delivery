const MenuDB = require("../menu/menu.db");
const OfferDB = require("./db.offer");

class OfferService{
    create=async(data)=>{
        try{
            const offer=new OfferDB(data)
            return await offer.save()
            // offer table data entry 

            // obj ===> return
        }
        catch(exception){
            throw exception
        }
    }
    addMenu= async(menu)=>{
        try{
           
               
                if (menu && Array.isArray(menu)) {
                     

                    const menuId = menu.map((item) => item.menuId)  // ['id', 'id']
                    //const menuItems = Menu.find({_id: {$in: menuId}})
                    // const storeData = []
                    // menuItems.map((menuDetail, ind) => {
                        // const singleItem = {}  
                        // menu.map((item) => { 
                            // if(menuDetail._id.equals(item.menuId)) {
                                // const offerPrice = menuDetail.price - menuDetail.price * item.offerDiscount/100
                            // singleItem = {...item, }    
                            //}
                            
                        //})
                    // })
                    // [{menuId: '', offerDiscount: '', offerId: ''}]

                    return menuId
                } 
            
        }
        catch(exception){
            throw exception
        }
    }
    getDetailsById=async(menuId)=>{
        try{
            const menuItems= await MenuDB.find({_id:{$in:menuId}})//search menu according to id as it is in array
            return menuItems
        }
        catch(exception){
            throw exception
        }
    }
    getAllDetails=async(menuItems,menu)=>{
        try{    
        let storeData=[]
       
            // let menuItem=menu.map(item=>item._id.equals(menuDetailItem.menuId))
            // if(menuItem){
            //     let offerPrice=menuItem.price-(menuItem.price*menuDetailItem.offerDiscount / 100)
            //     let singleItem={
            //         ...menuItem,
            //         offerPrice
            //     }
            //     storeData.push(singleItem)
            // }
          console.log(menuItems,menu)
            menuItems.map((menuDetail,ind)=>{
                let singleItem={}
                menu.menu.map((item) => { 
                    if(menuDetail._id.equals(item.menuId)) {
                        const offerPrice = menuDetail.price - menuDetail.price * item.offerDiscount/100
                        
                        singleItem = {...item,offerPrice}
                      
                    }
                    console.log(singleItem)
                    
                })
               
                storeData.push(singleItem)
            })
          
        return storeData
        }
        catch(exception){
            throw exception
        }
    }
}
const OfferSvc= new OfferService()
module.exports=OfferSvc