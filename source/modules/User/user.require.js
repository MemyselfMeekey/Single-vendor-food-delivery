const joi=require("joi")
const {emailSchema}=require("../authorization/auth.require")
const UserCreateDto=joi.object({
    name:joi.string().min(2).max(50).required(),
    image:joi.object().required(),
    email:emailSchema,
    role:joi.string().pattern(/^(admin|customer)$/).default("customer"),
    phone:joi.number().min(10).required(),
    address:joi.object({
        shippingAddress:joi.object({
            state: joi.string().pattern(/^(Koshi|Madesh|Sudurpaschim|Lumbini|Gandaki|Bagmati|Karnali)$/),
            district: joi.string().allow(null,''),
            localDevCom: joi.string().allow(null,''),
            wardNo: joi.number().allow(null,''),
            stnName: joi.string().allow(null,'')
        }),
        billingAddress:joi.object({
            state:joi.string(),
            district: joi.string().allow(null,''),
            localDevCom: joi.string().allow(null,''),
            wardNo: joi.number().allow(null,''),
            stnName: joi.string().allow(null,'')
        })
    })
})
const UserUpdateDto=joi.object({
    name:joi.string().min(2).max(50).required(),
    image:joi.object().required(),
    email:emailSchema,
    role:joi.string().pattern(/^(admin|customer)$/).default("customer"),
    phone:joi.number().min(10).required(),
    address:joi.object({
        shippingAddress:joi.object({
            state: joi.string().pattern(/^(Koshi|Madesh|Sudurpaschim|Lumbini|Gandaki|Bagmati|Karnali)$/),
            district: joi.string().allow(null,''),
            localDevCom: joi.string().allow(null,''),
            wardNo: joi.number().allow(null,''),
            stnName: joi.string().allow(null,'')
        }),
        billingAddress:joi.object({
            state:joi.string(),
            district: joi.string().allow(null,''),
            localDevCom: joi.string().allow(null,''),
            wardNo: joi.number().allow(null,''),
            stnName: joi.string().allow(null,'')
        })
    })
})
module.exports={
    UserCreateDto,
    UserUpdateDto
}