import * as bcrypt from 'bcrypt';
import { Repository } from "typeorm";
import { databaseSource } from "../../ormconfig";
import { UserDto } from "../dtos/user-dto";
import { UserModel } from "../entities/user-model";
import { TokenService } from "../service/token-service";
export class UserService {
    private userRepository: Repository<UserModel>;
    private tokenService: TokenService

    constructor() {
        this.userRepository = databaseSource.getRepository(UserModel);
        this.tokenService = new TokenService();
    }


    async registration(id: string, password: string) {
        const candidate = await this.userRepository.findOne({ where: { id } })

        if (candidate) {
            throw new Error("User already exist")
        }
        const hashPassword = await bcrypt.hash(password, 3)
        const user = await this.userRepository.save({ id, password: hashPassword })
        const userDto = new UserDto(user)
        const tokens = await this.tokenService.generateTokens({ ...userDto, })
        await this.tokenService.saveToken(userDto.id, tokens.refreshToken)


        return {
            ...tokens,
            user: userDto
        }
    }


    async login(id: string, password: string) {

        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) {
            throw new Error('Bad request')
        }

        const isPassEquals = await bcrypt.compare(password, user.password)
        if (!isPassEquals) {
            throw new Error('Bad request')
        }
        const userDto = new UserDto(user)
        const tokens = await this.tokenService.generateTokens({ ...userDto })
        await this.tokenService.saveToken(userDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: userDto
        }
    }

    async logout(refreshToken: string) {
        const token = await this.tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken: string) {
        if (!refreshToken) {
            throw new Error('Unauthorized')
        }

        const userData: any = await this.tokenService.validateRefreshToken(refreshToken)
        const tokenFromDb = await this.tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDb) {
            throw new Error('lala')
        }


        const user = await this.userRepository.findOne({ where: { id: userData.id } })
        const userDto = new UserDto(user)
        const tokens = await this.tokenService.generateTokens({ ...userDto })
        await this.tokenService.saveToken(userDto.id, tokens.refreshToken)


        return {
            ...tokens,
            user: userDto
        }



    }



}