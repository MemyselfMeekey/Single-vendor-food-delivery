const joi=require("joi")
const MenuCreateDto=joi.object({
    name:joi.string().required(),
    description:joi.string().optional(),
    price:joi.number().min(1).required(),
    category:joi.string().required(),
    discount:joi.number().min(0).max(100).default(0).allow(null,'',0),
    status:joi.string().pattern(/^(active|inactive)$/).default('inactive'),
    images:joi.array().items(joi.object()).allow(null,''),
    showInHome:joi.boolean().default(false)
})
const MenuUpdateDto=joi.object({
    name:joi.string().required(),
    description:joi.string().optional(),
    price:joi.number().min(1).required(),
    category:joi.string().required(),
    discount:joi.number().min(0).max(100).default(0).allow(null,'',0),
    status:joi.string().pattern(/^(active|inactive)$/).default('inactive'),
    images:joi.array().items(joi.object()).allow(null,''),
    showInHome:joi.boolean().default(false)
})
module.exports={
    MenuCreateDto,
    MenuUpdateDto
}