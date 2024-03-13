
const joi=require("joi")
const regSchema=joi.object({
    name:joi.string().min(5).max(50).required(),
    email:joi.string().email().required(),
    role:joi.string().pattern(/^(admin,seller,customer)$/).default("customer"),
    phone:joi.string().min(10).required()
})
module.exports={
    regSchema
}