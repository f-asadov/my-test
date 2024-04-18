import { NextFunction } from "express";
import { TokenService } from "../service/token-service";
const tokenService = new TokenService()

 async function AuthMiddleware(req: any, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) {
            throw new Error()
        }

        const accessToken = authHeader.split(' ')[1]

        if (!accessToken) {
            throw new Error()
        }

        const userData = await tokenService.validateAccessToken(accessToken)

        if(!userData){
            return next(new Error('Unauthorized'))
        }

        req.user = userData
        next()
    } catch (error) {
        return next(new Error("Unauthorized"))
    }
}

module.exports = AuthMiddleware;