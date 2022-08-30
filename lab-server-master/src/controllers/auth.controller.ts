import * as bcrypt from 'bcrypt';
import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as passport from 'passport';
import { DatabaseUtils } from "../utils/database_utils";

import { environment } from '../environments/environment';
import { User } from '../models/user';

class AuthController {
    public authRoute = '/login';
    public signUpRoute = '/signup';
    public assignRoute = '/assign';
    public usersRoute = '/users';
    public userDelete = '/users/delete';
    public usersAdmin = '/users/admin';

    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(this.authRoute, this.login);
        this.router.post(this.signUpRoute, this.createOrUpdateAccount);
        this.router.post(this.assignRoute, this.assignClassroomAdmin);
        this.router.get(this.usersRoute, this.getAdminUsers);
        this.router.post(this.userDelete, this.deleteUSer);
        this.router.get(this.usersAdmin, this.getAdminUser);
    }

    public async assignClassroomAdmin(request: express.Request, response: express.Response) {
        const { id, classroom } = request.body;
        if (!(id && classroom)) {
            return response.status(400).send();
        }
        const utils = DatabaseUtils.getInstance();
        try {
            await utils.assignClassroomAdmin(id, classroom);
        } catch (error) {
            response.status(400).send({ errno: error.errno, msg: error.sqlMessage });
        }
        return response.send();
    }

    public async getAdminUsers(request: express.Request, response: express.Response) {
        const utils = DatabaseUtils.getInstance();
        const data = await utils.getClassroomAdmins();
        response.json(data);
    }

    public async getAdminUser(request: express.Request, response: express.Response) {
        const { classroom } = request.query;
        if (!classroom) {
            return response.status(400).send();
        }
        const utils = DatabaseUtils.getInstance();
        try {
            const data: any = await utils.getClassroomAdmin(classroom);
            response.json(data[0]);
        } catch (error) {
            response.status(400).send({ errno: error.errno, msg: error.sqlMessage });
        }
    }

    public async createOrUpdateAccount(request: express.Request, response: express.Response) {
        const { email, password, name, role } = request.body;
        let { id } = request.body;
        if (!(email!.length > 0 && password!.length > 0 && name!.length > 0)) {
            return response.status(400).send();
        }
        const hashedPassword = bcrypt.hashSync(password, 10);
        const utils = DatabaseUtils.getInstance();
        try {
            if (id) {
                // Update
                await utils.updateUser(id, email, hashedPassword, name);
            } else {
                // Create
                const data: any = await utils.createUserWithEmailAndPassword(email, hashedPassword, name, role);
                id = data.insertId;
            }
        } catch (error) {
            response.status(400).send({ errno: error.errno, msg: error.sqlMessage });
        }
        return response.json(id);
    }

    public async deleteUSer(request: express.Request, response: express.Response) {
        const { userId } = request.body;
        if (!userId) {
            return response.status(400).send();
        }
        const utils = DatabaseUtils.getInstance();
        utils.deleteUserById(userId).then(() => {
            response.send({ msg: 'user deleted' });
        }).catch((error) => {
            response.status(400).send({ errno: error.errno, msg: error.sqlMessage });
        });
    }

    public async login(request: express.Request, response: express.Response) {
        const { email, password } = request.body;
        if (!(email && passport)) {
            return response.status(400).send();
        }

        const utils = DatabaseUtils.getInstance();
        let result: any = await utils.getUserWithEmail(email);
        if (result.length === 0) {
            return response.status(404).send();
        }
        const raw = result[0];
        result = await utils.getAssignedClassroomOfUser(raw.user_id);
        let classroom: string;
        if (result.length > 0) {
            classroom = result[0].classroom;
        }
        const user = new User(raw.user_id, raw.email, raw.name, raw.role);
        const hashedPassword = raw.password;
        const passwordMatch = bcrypt.compareSync(password, hashedPassword);

        if (!passwordMatch) {
            return response.status(401).send();
        }
        const token = jwt.sign(
            { userId: user.id, username: user.email },
            environment.jwtSecret,
        );
        response.json({
            token,
            email: user.email,
            name: user.name,
            role: user.role,
            classroom,
        });
        response.json(token);
    }

}
export default new AuthController();
