require("dotenv").config()
const services = require("./services.db")
const { myEvent, sendOtp } = require("../../eventlistener/myevent.listener")
const AppError = require("../../exception/error.app")
const bcrypt = require("bcrypt")
const { genRanStr, genRanOtp } = require("../../configuration/randomstring.generator")
const jwt = require("jsonwebtoken")

class AuthorizationControl {
  registration = async (req, res, next) => {
    try {
      const data = services.transformRegisterData(req.body)
      //  console.log(data.activationToken)
      const user = await services.userStore(data)


      if (user) {
        myEvent.emit('sendRegisterMail', user)//make a new folder named events and add the event listener there
      }
      else {
        throw AppError({ message: "this couldnot be executed in registration" })
      }

      res.json({
        result: user,
        message: "Use the activation token to activate your account",
        meta: null
      })
    }
    catch (exception) {
      console.log(exception)
      next(exception)
    }

  }
  verificationToken = async (req, res, next) => {
    try {
      const token = req.params.token
      if (token.length < 100) {
        throw new AppError({ message: "Invalid Token" })
      }

      const user = await services.getSingleUserByFilter({
        activationToken: token

      })

      if (!user) {
        throw new AppError({ message: "Token doesnot exist anymore" })
      }
      const today = new Date().getTime()
      const tokenExpiryDate = new Date(user.expiryDate).getTime
      if (today > tokenExpiryDate) {
        throw new AppError({ message: "Token is expired " })
      }
      res.json({
        result: user,
        message: "You are verified",
        meta: null
      })
    }
    catch (exception) {
      console.log("exception in verification of authctrl", exception)
      next(exception)
    }
  }

  resendActivationToken = async (req, res, next) => {
    try {
      const email = req.body.email
      const user = await services.getSingleUserByFilter({
        email: email,

      })
      if (!user) {
        throw new AppError({ message: "User has not been registered yet " })
      }
      const token = genRanStr()

      const expiryDate = new Date()
      expiryDate.setHours(expiryDate.getHours() + 2)
      await services.updateUser(user._id, {
        activationToken: token,

        expiryDate: expiryDate
      })
      const myEvent = req.myEvent
      myEvent.emit('sendRegisterMail', { name: user.name, email: user.email, activationToken: token })
      res.json({
        result: {
          activationToken: token,
          expiryDate: expiryDate
        },
        message: "Please note your acgtivation token for activation and otp to login.",
        meta: null
      })
    }
    catch (exception) {
      console.log("exeption in authroirzation control", exception)
      next(exception)
    }
  }
  activation = async (req, res, next) => {
    try {
      const token = req.params.token

      const user = await services.getSingleUserByFilter({
        activationToken: token,

      })
      if (!user) {
        throw new AppError({ message: "Invalid token" })
      }
      const today = new Date().getTime()
      const expiryDate = new Date(user.expiryDate).getTime()
      if (today > expiryDate) {
        throw new AppError({ message: "Token has already been expired" })
      }
      const hash = bcrypt.hashSync(req.body.password, 10)
      const updateBody = {
        password: hash,
        activationToken: null,
        expiryDate: null,
        status: "active"
      }
      const update = await services.updateUser(user._id, updateBody)
      res.json({
        result: null,
        message: "Your account has been successfully activated",
        meta: null
      })
    }
    catch (exception) {
      console.log("exception in authroirzation control", exception)
      next(exception)
    }
  }
  login = async (req, res, next) => {
    try {

      const { email, password } = req.body

      const userDetail = await services.getSingleUserByFilter({
        email: email,
        //  otp:otp,
        ///checking if the email exists or not
      })

      if (!userDetail) {
        throw new AppError({ message: "User does not exists", code: 400, data: { email: "user doesnot exist" } })
      }
      if (!bcrypt.compareSync(password, userDetail.password)) {
        throw new AppError({ message: "Password doesnot match", code: 400 })
      }
      if (userDetail.status !== "active") {
        throw new AppError({ message: "user has not been activated", code: 400 })
      }

      const otp = genRanOtp()
      const userWithotp = await services.updateUser(userDetail._id, { otp:otp})
      //sending otp to mail
      if (userWithotp) {
        sendOtp.emit('sendOtpMail', {email:userDetail.email,otp:otp})
        res.json({
          result: {
           otp:otp
          },
          message: "Please check your email for otp verification",
          meta: null
        })
      }
      else {
        throw new AppError({ message: "OTP not sent in mail" })
      }
    }
    catch (exception) {
      console.log("exception in authroirzation control login", exception)
      next(exception)
    }
  }
  verifyOtp = async (req, res, next) => {
    try {
      const { email, otp } = req.body
      const userDetail = await services.getSingleUserByFilter({
        email: email
      })
      if (!userDetail) {
        throw new AppError({ message: "Please type the otp to verify" })
      }
      if (otp !== userDetail.otp) {
        throw new AppError({ message: "Wrong otp" })
      }
      await services.updateUser(userDetail._id, { otp: null })


      // generating token
      const accessToken=jwt.sign({
        id:userDetail._id,
      },process.env.JWT_SECRET,{
        expiresIn:"4h"
      })
      const refreshToken=jwt.sign({
        id:userDetail._id,
        type:"refresh"
      },process.env.JWT_SECRET,{
        expiresIn:"1d"
      })
      res.json({
        result: {
          accessToken:accessToken,
          refreshToken:refreshToken
        },
        message: "Otp verified successfully. You are logged in now",
        meta: null
      })
    }
    catch (exception) {
      console.log(exception)
      next(exception)
    }
  }
  dashboard = (req, res, next) => {
    try {

    }
    catch (exception) {
      console.log("eception in dashboard control", exception)
      next(exception)
    }
  }
  changepass = (req, res, next) => {
    try {

    }
    catch (exception) {
      console.log("eception in changepass control", exception)
      next(exception)
    }
  }
  frogetpass = (req, res, next) => {
    try {

    }
    catch (exception) {
      console.log("eception in forget control", exception)
      next(exception)
    }
  }
  frogetpasstokenverify = (req, res, next) => {
    try {

    }
    catch (exception) {
      console.log("eception in forgetpasstokenverify control", exception)
      next(exception)
    }
  }
  setpasstoken = (req, res, next) => {
    try {

    }
    catch (exception) {
      console.log("eception in setpasstoken control", exception)
      next(exception)
    }
  }
}
const authCtrl = new AuthorizationControl()
module.exports = authCtrl