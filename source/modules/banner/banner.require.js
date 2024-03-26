const joi=require("joi")

const CreateBanDto=joi.object({
    title:joi.string().min(2).required(),
    url:joi.string().uri().default(null),
    status:joi.string().pattern(/^(active|inactive)$/).default('inactive'),
    image:joi.object().required()
})
module.exports={CreateBanDto}