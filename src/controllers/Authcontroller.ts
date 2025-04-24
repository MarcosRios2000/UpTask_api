import type { Request, Response } from "express"
import User from "../models/User"
import { checkPassword, hashPassword } from '../utils/auth'
import Token from "../models/Token"
import { generateToken } from "../utils/token"
import { AuthEmail } from "../emails/AuthEmail"
import { generateJWT } from "../utils/jwt"


export class AuthController {

    static createAccount = async(req: Request, res: Response) => {
       try {
           const { password, email } = req.body 

            const userExists = await User.findOne({email})
            if(userExists){
                const error = new Error('Email already in use.')
                return res.status(409).json({error: error.message})
            }

            const user = new User(req.body)
            user.password = await hashPassword(password)

            const token = new Token()
            token.token = generateToken()
            token.user = user.id

            await AuthEmail.sendConfirmationEmail({
                email: user.email,
                name: user.name,
                token: token.token
            })

            await Promise.allSettled([user.save(), token.save()])
            res.send('Account created. Check your email to confirm.')
       } catch (error) {
            res.status(500).json({error: 'Something went wrong.'})
       }
    }

    static confirmAccount = async(req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExist = await Token.findOne({token})
            if(!tokenExist) {
                const error = new Error('Invalid token. Please request a new confirmation link.')
                return res.status(404).json({error: error.message})
            }

            const user = await User.findById(tokenExist.user)
            if (user) {
                user.confirmed = true
                await Promise.allSettled([ user.save(), tokenExist.deleteOne() ])
                res.send('Your account has been confirmed.')
            } else {
                return res.status(404).json({ error: 'User not found.' })
            }
        } catch (error) {
            res.status(500).json({error: 'Something went wrong.'})
        }
    }

    static login = async(req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            const user = await User.findOne({email})
            if(!user){
                const error = new Error('User not found.')
                return res.status(404).json({error: error.message})
            }

            if(!user.confirmed) {
                const token = new Token()
                token.user = user.id
                token.token = generateToken()
                await token.save()

                await AuthEmail.sendConfirmationEmail({
                    email: user.email,
                    name: user.name,
                    token: token.token
                })


                const error = new Error('Account not confirmed. Check your email.')
                return res.status(401).json({error: error.message})
            }

            const isPasswordCorrect = await checkPassword(password, user.password)
            if(!isPasswordCorrect){
                const error = new Error('Incorrect password.')
                return res.status(401).json({error: error.message})
            }
            const jwt = generateJWT({id: user.id})

            res.send(jwt)
        } catch (error) {
            res.status(500).json({error: 'Something went wrong.'})
        }
    }

    static requestConfirmationCode = async(req: Request, res: Response) => {
        try {
             const { email } = req.body 
 
             const user = await User.findOne({email})
             if(!user){
                 const error = new Error('Account not found.')
                 return res.status(404).json({error: error.message})
             }

             if(user.confirmed){
                const error = new Error('Account already confirmed.')
                return res.status(403).json({error: error.message})
             }
             const token = new Token()
             token.token = generateToken()
             token.user = user.id
             await token.save()
 
             await AuthEmail.sendConfirmationEmail({
                 email: user.email,
                 name: user.name,
                 token: token.token
             })
 
             res.send('We’ve sent you a new confirmation link.')
        } catch (error) {
             res.status(500).json({error: 'Something went wrong.'})
        }
     }

     static forgotPassword = async(req: Request, res: Response) => {
        try {
             const { email } = req.body 
 
             const user = await User.findOne({email})
             if(!user){
                 const error = new Error('Account not found.')
                 return res.status(404).json({error: error.message})
             }
 
             const token = new Token()
            token.token = generateToken()
            token.user = user.id
            await token.save()

            await AuthEmail.sendPasswordResetToken({
                email: user.email,
                name: user.name,
                token: token.token
            })

            res.send('Check your email for instructions to reset your password.')
        } catch (error) {
             res.status(500).json({error: 'Something went wrong.'})
        }
     }

     static validateToken = async(req: Request, res: Response) => {
        try {
            const { token } = req.body

            const tokenExist = await Token.findOne({token})
            if(!tokenExist) {
                const error = new Error('Invalid or expired link.')
                return res.status(404).json({error: error.message})
            }

            
            res.send('Link confirmed. Set your new password.')
        } catch (error) {
            res.status(500).json({error: 'Something went wrong.'})
        }
    }

    static updatePasswordWithToken = async(req: Request, res: Response) => {
        try {
            const { token } = req.params

            const tokenExist = await Token.findOne({token})
            if(!tokenExist) {
                const error = new Error('Invalid or expired link.')
                return res.status(404).json({error: error.message})
            }

            const { password } = req.body
            const user = await User.findById(tokenExist.user)
            user.password = await hashPassword(password)

            await Promise.allSettled([ user.save(), tokenExist.deleteOne() ])
            
            res.send('Your password has been updated.')
        } catch (error) {
            res.status(500).json({error: 'Something went wrong.'})
        }
    }

    static user = async(req: Request, res: Response) => {
        return res.json(req.user)
    }

    static updateProfile = async(req: Request, res: Response) => {
        const { name, email } = req.body

        const userExists = await User.findOne({email})
        if(userExists && userExists.id.toString() !== req.user.id.toString()) {
            const error = new Error('Email already in use.')
            return res.status(409).json({error: error.message})
        }

        req.user.name = name
        req.user.email = email

        try {
            await req.user.save()
            res.send('Your changes have been saved.')
        } catch (error) {
            res.status(500).json({error: 'Something went wrong.'})
        }
    }


    static updateCurrentUserPassword = async(req: Request, res: Response) => {
        const { current_password, password } = req.body

        const user = await User.findById(req.user.id)

        const isPasswordCorrect = await checkPassword(current_password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('Incorrect current password.')
            return res.status(401).json({error: error.message})
        }

        try {
            user.password = await hashPassword(password)
            await user.save()
            res.send('Your password has been updated.')
        } catch (error) {
            res.status(500).json({error: 'Something went wrong.'})
        }
    }

    static checkPassword = async(req: Request, res: Response) => {
        const { password } = req.body

        const user = await User.findById(req.user.id)

        const isPasswordCorrect = await checkPassword(password, user.password)
        if(!isPasswordCorrect) {
            const error = new Error('Incorrect password.')
            return res.status(401).json({error: error.message})
        }
        res.send('Your password has been verified.')
    }
}