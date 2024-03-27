const AppError = require("../../exception/error.app")
const BannerSvc = require("./services.banner")

class BannerCtrl {
    create = async (req, res, next) => {
        try {
            // console.log(req.body)
            const payload = BannerSvc.transformCreateObject(req.body, req.authUser._id)
            await BannerSvc.createBanner(payload)
            res.json({
                result: payload,
                message: "Banner has been created",
                meta: null
            })
        }
        catch (exception) {
            console.log("This is exception in bannerCtrl", exception)
            next(exception)
        }
    }
    index = async (req, res, next) => {
        try {
            
            const page = +req.query.page || 1 //ignores: 0,null,undefined,false,empty
            const limit = +req.query.limit || 10
            if (page <= 0 || limit <= 0) {
                throw new AppError({ message: "Page number should begin from 1", code: 400 })
            }
           
            const offset = (page - 1) * limit
            let filter = {}
            if (req.query.search) {
                filter = {
                    $or: [
                        { title: new RegExp(req.query.search, 'i') },
                        { url: new RegExp(req.query.search, 'i') },
                        { status: new RegExp(req.query.search, 'i') }
                    ]
                }

            }
            
            const count = await BannerSvc.getTotalCount(filter)
            
            const data = await BannerSvc.getDataByFilter({ offset, filter, limit })
            res.json({
                result: data,
                message: "Banner has been fetched",
                meta: {
                    page: page,
                    limit: limit,
                    count: count
                }
            })
        }
        catch (exception) {
            next(exception)
        }
    }
}
const BanCtrl = new BannerCtrl()
module.exports = BanCtrl