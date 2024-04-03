const joi=require("joi")
const offerCreateDto=joi.object({
    name:joi.string().min(2).max(50).required(),
    image:joi.object().optional(),
    startTime:joi.date().format('YYYY-MM-DDTHH:mmZ').required(),
    endDate:joi.date().format('YYYY-MM-DDTHH:mmZ').required(),
    menu:joi.array().object({
        menuId:joi.string().required(),
        offerDiscount:joi.number().required().min(1)
    })
})
module.exports={
    offerCreateDto
}