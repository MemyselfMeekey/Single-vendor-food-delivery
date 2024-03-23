
const joi=require("joi")
const emailSchema=joi.string().email().required()
const regSchema=joi.object({
    name:joi.string().min(5).max(50).required(),
    email:emailSchema,
    role:joi.string().pattern(/^(admin,seller,customer)$/).default("customer"),
    phone:joi.string().min(10).required()
})
const resendToken=joi.object({
    email:emailSchema
})
const passwordSetSchema=joi.object({
    password:joi.string().min(8).max(12).required(),
    confirmPassword:joi.string().valid(joi.ref('password')).messages({'any.only':"confirm passwrod must match with password"})
})
const loginDto=joi.object({
    email:emailSchema,
    password:joi.string().required()
})
module.exports={
    regSchema,
    passwordSetSchema,
    emailSchema,
    resendToken,
    loginDto
}