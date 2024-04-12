const AppError = require("../../exception/error.app")
const MenuDB = require("./menu.db")
const slugify = require("slugify")
const OfferDB=require("../offer/db.offer")

class MenuService {
    tranformCreateObject = (data, authUser) => {
        try {
            const formattedData = {
                ...data
            }
            console.log(data.name)
            formattedData.slug = slugify(data.name, { lower: true })
            let images = []
            if (data.images) {
                images = data.images.map(image => image.filename)
            }
            if (images.length) {
                formattedData.images = images
            }
            else {
                formattedData.images = null
            }
            formattedData.category = data.category || null
            formattedData.afterDiscount = data.price - data.price * data.discount / 100

            formattedData.createdBy = authUser
            return formattedData
        }
        catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    createMenu = async (data) => {
        try {
            const menu = new MenuDB(data)
            return await menu.save()
        }
        catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    getPageCount = async (filter) => {
        try {
            const count = await MenuDB.countDocuments(filter)
            return count
        }
        catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    getDataByFilter = async ({ offset, filter, limit }) => {
        try {
            const data = await MenuDB.find(filter)
                .populate('createdBy', ['_id', 'name', 'email'])
                .populate('category', ['_id', 'name', 'slug'])
                .sort({ '_data': 'desc' })
                .skip(offset)
                .limit(limit)
            return data
        }
        catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    getDataById = async (id) => {
        try {
            const data = await MenuDB.findById(id)
                .populate('createdBy', ['_id', 'name', 'email'])
                .populate('category', ['_id', "name", 'slug'])
            return data
        }
        catch (exception) {
            throw exception
        }
    }
    tranformUpdateObject = async (data, oldMenu, authUserId) => {
        try {
            const formattedData = {
                ...data
            }
            formattedData.slug = slugify(data.name, { lower: true })
            let images = oldMenu.images
            if (data.images) {
                images = data.images.map(image => image.filename)
            }

            if (data.images.length >= 0) {
                formattedData.images = images
            }
            else {
                formattedData.images = null
            }
            formattedData.category = data.category || null
            formattedData.afterDiscount = data.price - data.price * data.discount / 100
            formattedData.updatedBy = authUserId
            return formattedData
        }
        catch (exception) {
            throw exception
        }
    }
    updateData = async (id, data) => {
        try {
            const update = await MenuDB.findByIdAndUpdate(id, {
                $set: data
            })
            return update
        }
        catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    deleteById = async (id) => {
        try {
            const deleteMenu = await MenuDB.findByIdAndDelete(id)
            if (!deleteMenu) {
                throw new AppError({ message: "MenuId doesnot exists", code: 400 })
            }
            return deleteMenu
        }
        catch (exception) {
            console.log(exception)
            throw exception
        }
    }
    setFilters = (query) => {
        let filter = {
            offset: 0,
            limit: +query.limit || 5,
            search: {},
            page: +query.page || 1
        }
        if (filter.page <= 0 || filter.limit <= 0) {
            throw new AppError({ message: " Page number and limit should begin from 1", code: 400 })
        }

        filter.offset = (filter.page - 1) * filter.limit

        filter.search = {
            status: "active"
        }
        if (query.search) {
            filter.search = {
                ...filter.search,
                $or: [
                    { name: new RegExp(req.query.search, 'i') },
                    { description: new RegExp(req.query.search, 'i') },
                    { price: new RegExp(req.query.search, 'i') },
                    { status: new RegExp(req.query.search, 'i') }
                ]
            }
        }
        return filter
    }
    getTotalCount = async (filter) => {
        try {
            const data = await MenuDB.countDocuments(filter)
            return data
        }
        catch (exception) {
            console.log("Exception in getTotalCOunt menu", exception)
            throw exception
        }
    }
    getSingleDataByFilter = async (filter) => {
        try {
            let data = null
            data= await MenuDB.findOne({
                _id: filter._id
            })
            
            const offerExits=await OfferDB.findOne({
                menu:{$elemMatch:{menuId:filter._id}},
                startDate: {$lte: new Date()},
                endDate: {$gte: new Date()}
            }).sort({'startDate': 'desc'})

            if(offerExits){
                const offerItem = offerExits.menu.filter((menuItem) => menuItem.menuId.equals(filter._id));
                data.offerPrice = offerItem[0].offerPrice
            } else {
                data.offerPrice = data.afterDiscount
            }
            return data
        }
        catch (exception) {
            throw exception
        }
    }
}
const MenuSvc = new MenuService()
module.exports = MenuSvc