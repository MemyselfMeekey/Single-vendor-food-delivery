const joi=require('joi')
const CatCreateDto=joi.object({
    name:joi.string().min(2).required(),
    status:joi.string().pattern(/^(active|inactive)$/).default('inactive'),
    image:joi.object().required(),
    showInHome:joi.boolean().default(false)
})
const CatUpdateDto=joi.object({
    name:joi.string().min(2).required(),
    status:joi.string().pattern(/^(active|inactive)$/).default('inactive'),
    image:joi.string().optional(),
    showInHome:joi.boolean().default(false)
})
module.exports={
    CatCreateDto,
    CatUpdateDto
}