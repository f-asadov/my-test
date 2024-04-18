import { NextFunction, Request, Response } from 'express';
import { UserService } from "../service/user-service";

export class UserController {
    public userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async signUp(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, password } = req.body;
            const userData = await this.userService.registration(id, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async signIn(req: Request, res: Response, next: NextFunction) {
        try {
            const { id, password } = req.body;
            const userData = await this.userService.login(id, password)
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.cookies
            const token = await this.userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(token)
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    async refresh(req: Request, res: Response) {
        try {
            const { refreshToken } = req.cookies
            const userData = await this.userService.refresh(refreshToken);
            res.cookie('refreshToken', userData?.refreshToken, { maxAge: 60 * 60 * 1000, httpOnly: true });
            return res.json(userData);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

}
