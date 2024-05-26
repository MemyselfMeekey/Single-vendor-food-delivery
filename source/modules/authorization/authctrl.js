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
        message: "Please check your provided email",
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
   
      const updateUser=await services.updateUser(user._id, {
        activationToken: token,

        expiryDate: expiryDate
      })
      console.log("updateUser")
  
      myEvent.emit('sendRegisterMail',updateUser)
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
      const userWithotp = await services.updateUser(userDetail._id, { otp: otp })
      //sending otp to mail
      if (userWithotp) {
        sendOtp.emit('sendOtpMail', { email: userDetail.email, otp: otp })
        res.json({
          result: {
            otp:otp,
            userWithotp:userWithotp
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
      const accessToken = jwt.sign({
        id: userDetail._id,
      }, process.env.JWT_SECRET, {
        expiresIn: "4h"
      })
      const refreshToken = jwt.sign({
        id: userDetail._id,
        type: "refresh"
      }, process.env.JWT_SECRET, {
        expiresIn: "1d"
      })
      const personalAccessToken=await services.pat({
        userId:userDetail._id,
        token:accessToken,
        refreshToken:refreshToken
      })
      res.json({
        result: {
          accessToken: accessToken,
          refreshToken: refreshToken,
          userDetail:userDetail
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
      const dashboard = req.authUser
      res.json({
        result: {
          _id: dashboard._id,
          name: dashboard.name,
          email: dashboard.email,
          role: dashboard.role,
          status: dashboard.status,
        },
        message: "Your profile",
        meta: null
      })
    }
    catch (exception) {
      console.log("exception in dashboard control", exception)
      next(exception)
    }
  }
  changepass = async (req, res, next) => {
    try {
      const payload = req.body//oldpass,newpass,comfirmpass
      const loggedInUser = req.authUser
      if (!bcrypt.compareSync(payload.oldPassword, loggedInUser.password)) {
        throw new AppError({ message: "Old password does't match", code: 400 })
      }
      if (payload.newPassword !== payload.confirmPassword) {
        throw new AppError({ message: "new password doesn't match", code: 400 })
      }
      const hash = bcrypt.hashSync(payload.newPassword, 10)
      await services.updateUser(loggedInUser._id, {
        password: hash
      })
      res.json({
        result: null,
        message: "Password Changed Successfully",
        meta: null
      })
    }
    catch (exception) {
      console.log("eception in changepass control", exception)
      next(exception)
    }
  }
  forgetpass = async (req, res, next) => {
    try {
      const email = req.body.email
      const userDetail = await services.getSingleUserByFilter({
        email: email,
      })
      if (!userDetail) {
        throw new AppError({ message: "Given user hasnot been registered yet", code: 400 })
      }
      const token = genRanStr()
      const expiryDate = new Date(Date.now() + (2 * 60 * 60 * 1000))
      const updateBody = {
        forgetToken: token,
        expiryDate: expiryDate
      }
      const updateUser = await services.updateUser(userDetail._id, updateBody)
      if (updateUser) {
        await services.forgetPassEmail({ email: userDetail.email, name: userDetail.name, token: token })
        res.json({
          result:{
            forgetToken:updateBody.forgetToken
          },
          message: "Please check your email",
          meta: null
        })
      }
      else{
        throw new AppError({message:"Sorry! your request cannnot be processed at this moment",code:400})
      }
    }
    catch (exception) {
      console.log("eception in forget control", exception)
      next(exception)
    }
  }
  frogetpasstokenverify = async(req, res, next) => {
    try {
      const token=req.params.token
      if(token.length>100){
        throw new AppError({message:"Wrong token",code:400})
      }
      const user=await services.getSingleUserByFilter({
        forgetToken:token
      })
      if(!user){
        throw new AppError({message:"The given token does not exist"})
      }
      const today=new Date().getTime()
      const tokenExpiryDate=new Date(user.expiryDate).getTime()
      if(today>tokenExpiryDate){
        throw new AppError({message:"Token already expoired",code:400})
      }
      res.json({
        result:{
          _id:user._id,
          name:user.name,
          email:user.email,
          forgetToken:user.forgetToken,
          expiryDate:user.expiryDate,
          role:user.role,
          status:user.status
        },
        message:"Verfied forget-pass",
        meta:null
      })
    }
    catch (exception) {
      console.log("eception in forgetpasstokenverify control", exception)
      next(exception)
    }
  }
  setforgetPass = async(req, res, next) => {
    try {
      const payload=req.body
      const user=await services.getSingleUserByFilter({
        forgetToken:req.params.token
      })
      if(!user){
        throw new AppError({message:"Token does not exits",code:400})
      }
      const today=new Date().getTime()
      const tokenExpiryDate=new Date(user.expiryDate).getTime()
      if(today>tokenExpiryDate){
        throw new AppError({message:"This token has been expired",code:400})
      }
      await services.updateUser(user._id,{
        password:bcrypt.hashSync(payload.password,10),
        forget:null,
        expiryDate:null
      })
      res.json({
        result:user,
        message:"Password Changed Successfully",
        meta:null
      })
    }
    catch (exception) {
      console.log("eception in setpasstoken control", exception)
      next(exception)
    }
  }

  logOut=async(req,res,next)=>{
    try{
      //Once run this by  sir
      let token=req.headers['authorization']
      if(token){
        token=token.split(" ").pop()
        await services.deleteAcessToken(token)
        res.status(200).json({
          result:token,
          message:"Log Out has been successfull",
          meta:null
        })
      }
      else{
        throw new AppError({message:"Token has a problem",code:401})
      }
    }
    catch(exception){
      console.log("exception in logout",exception)
      next(exception)
    }
  }
}
const authCtrl = new AuthorizationControl()
module.exports = authCtrl