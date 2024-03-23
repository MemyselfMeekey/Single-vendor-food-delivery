const router=require('express').Router()//routing middleware 
const authCtrl=require("../authorization/authctrl")
const bodyvalidator=require("../../middlware/validator")
const { regSchema,passwordSetSchema,emailSchema,resendToken, loginDto}=require("../authorization/auth.require")
const { pathSet,uploader } = require('../../middlware/imageupload')
const loginCheck = require('../../middlware/loginCheck.midd')


router.post("/registration",pathSet("/uploads/images"),uploader.single("image"),bodyvalidator(regSchema),authCtrl.registration)
router.get("/verification/:token",authCtrl.verificationToken)
router.post("/resendverification",bodyvalidator(resendToken),authCtrl.resendActivationToken)
router.get("/activation/:token",bodyvalidator(passwordSetSchema),authCtrl.activation)

router.post("/login",bodyvalidator(loginDto),authCtrl.login)
router.post("/verify-otp",authCtrl.verifyOtp)
router.get("/dashboard",loginCheck,authCtrl.dashboard)
router.post("/change-pass",loginCheck,authCtrl.changepass)

router.post("/forgetpass",authCtrl.frogetpass)
router.post("/forgetpass/:token/verification",authCtrl.frogetpasstokenverify)
router.post("/setpass/:token",authCtrl.setpasstoken)


module.exports=router

