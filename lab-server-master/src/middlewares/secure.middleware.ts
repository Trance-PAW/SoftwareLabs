import * as express from 'express';
import passport from 'passport';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { environment } from '../environments/environment';
import { DatabaseUtils } from "../utils/database_utils";

class Secure {
    public initialize() {
        passport.use('jwt', this.getStrategy());
        return passport.initialize();
    }

    private static authenticate(callback: any) {
        return passport.authenticate('jwt', { session: false, failWithError: true }, callback);
    }

    private getStrategy(): Strategy {
        const params = {
            secretOrKey: environment.jwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            passReqToCallback: true,
        };

        return new Strategy(params, async (request: any, payload: any, done: any) => {
            const userId = payload.userId;
            const utils = DatabaseUtils.getInstance();
            const user = await utils.findUserById(userId);
            if (!user) {
                return done(null, false, { message: 'The user in the token was not found' });
            }
            return done(null, { id: user.id, username: user.email, role: user.role });
        });
    }

    public adminRoute(request: express.Request, response: express.Response, next: express.NextFunction) {
        return Secure.authenticate((error: any, user: any, info: any) => {
            if (error) { return next(error); }
            if (!user) {
                if (info.name === "TokenExpiredError") {
                    return response.status(401).json({ message: "Your token has expired. Please generate a new one" });
                } else {
                    return response.status(401).json({ message: info.message });
                }
            }
            if (user.role === '1' || user.role === '2') {
                return response.status(401).json(
                    { message: "You don't have enough permissions to use this function" });
            }
            return next();
        })(request, response, next);
    }

    public authRoute(request: express.Request, response: express.Response, next: express.NextFunction) {
        return Secure.authenticate((error: any, user: any, info: any) => {
            if (error) { return next(error); }
            if (!user) {
                if (info.name === "TokenExpiredError") {
                    return response.status(401).json({ message: "Your token has expired. Please generate a new one" });
                } else {
                    return response.status(401).json({ message: info.message });
                }
            }
            return next();
        })(request, response, next);
    }
}
export default new Secure();
