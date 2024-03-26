const router=require('express').Router()//routing middleware 
const authCtrl=require("../authorization/authctrl")
const bodyvalidator=require("../../middlware/validator")
const { regSchema,passwordSetSchema,resendToken, loginDto,passwordChangeSchema,forgetPass}=require("../authorization/auth.require")
const { pathSet,uploader } = require('../../middlware/imageupload')
const loginCheck = require('../../middlware/loginCheck.midd')


router.post("/registration",pathSet("/uploads/images"),uploader.single("image"),bodyvalidator(regSchema),authCtrl.registration)
router.get("/verification/:token",authCtrl.verificationToken)
router.post("/resendverification",bodyvalidator(resendToken),authCtrl.resendActivationToken)
router.get("/activation/:token",bodyvalidator(passwordSetSchema),authCtrl.activation)

router.post("/login",bodyvalidator(loginDto),authCtrl.login)
router.post("/verify-otp",authCtrl.verifyOtp)
router.get("/dashboard",loginCheck,authCtrl.dashboard)
router.post("/change-pass",loginCheck,bodyvalidator(passwordChangeSchema),authCtrl.changepass)

router.post("/forgetpass",bodyvalidator(forgetPass),authCtrl.forgetpass)
router.post("/forgetpass/:token/verification",authCtrl.frogetpasstokenverify)
router.post("/setpass/:token",bodyvalidator(passwordSetSchema),authCtrl.setforgetPass)
router.post('/logout',loginCheck,authCtrl.logOut)


module.exports=router

