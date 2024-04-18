import dotenv from 'dotenv';
import * as jwt from 'jsonwebtoken'
import { Repository } from 'typeorm';
import { databaseSource } from '../../ormconfig';
import { TokenModel } from '../entities/token-model';
dotenv.config();
export class TokenService {
    private tokenRepository: Repository<TokenModel>;
    private accessSecretKey: string;
    private refreshSecretKey: string;

    constructor() {
        this.tokenRepository = databaseSource.getRepository(TokenModel);
        this.accessSecretKey = process.env.JWT_ACCESS_SECRET as string;
        this.refreshSecretKey = process.env.JWT_REFRESH_SECRET as string
    }

    async generateTokens(payload: any) {
        const accessToken = jwt.sign(payload, this.accessSecretKey, { expiresIn: '10m' })
        const refreshToken = jwt.sign(payload, this.refreshSecretKey, { expiresIn: '1h' })
        return {
            accessToken,
            refreshToken
        }
    }

    async saveToken(userId: string, refreshToken: string) {

        const tokenData = await this.tokenRepository.findOne({ where: { user: { id: userId } }, relations: { user: true } });

        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            await this.tokenRepository.update(tokenData.id, tokenData);
            return tokenData;
        }

        const token = await this.tokenRepository.save({ user: { id: userId }, refreshToken: refreshToken });
        return token;
    }

    async removeToken(refreshToken: string) {
        await this.tokenRepository.delete({refreshToken})
    }
    async findToken(refreshToken: string) {
        const tokenData = await this.tokenRepository.findOne({ where: { refreshToken } })
        return tokenData
    }

    async validateAccessToken(token: string) {
        try {
            const userData:any = jwt.verify(token, this.accessSecretKey)
            const userId = userData.id
            const userHasRefresh = await this.tokenRepository.findOne({where:{user:{id:userId}}})

            if(!userHasRefresh){
                return null
            }
            return userData

        } catch (error) {
            return null
        }
    }

    async validateRefreshToken(token: string) {
        try {
            const userData = jwt.verify(token, this.refreshSecretKey)
            return userData
        } catch (error) {
            console.log(error)
        }
    }
}