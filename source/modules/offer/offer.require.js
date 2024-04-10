const joi=require("joi")
const offerCreateDto=joi.object({
    description:joi.string().min(2).max(50).required(),
    startDate:joi.date().iso().required(),
    endDate:joi.date().iso().required(),
    menu: joi.array().items(joi.object({
        menuId: joi.string().required(),
        offerDiscount: joi.number().required().min(1)
    })).required(),
    showInHome:joi.boolean().default(false)
})
const OfferUpdateDto=joi.object({
    description:joi.string().min(2).max(50).required(),
    startDate:joi.date().iso().required(),
    endDate:joi.date().iso().required(),
    menu: joi.array().items(joi.object({
        menuId: joi.string().required(),
        offerDiscount: joi.number().required().min(1)
    })).required(),
    showInHome:joi.boolean().default(false)
})
module.exports={
    offerCreateDto,
    OfferUpdateDto
}