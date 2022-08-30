import * as express from 'express';
import { DatabaseUtils } from '../utils/database_utils';

class ConfigController {
    public configRoute = '/config';

    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    public initializeRoutes() {
        this.router.post(this.configRoute, this.setValue);
        this.router.get(this.configRoute, this.getValue);
    }

    public async setValue(request: express.Request, response: express.Response) {
        const { key, value } = request.body;
        if (!(key && value)) {
            return response.status(400).send();
        }

        const db = DatabaseUtils.getInstance();
        const sql = 'REPLACE INTO config(_key, _value) VALUES (?, ?)';
        await db.queryPromise(sql, [key, value]);
        return response.send();
    }

    public async getValue(request: express.Request, response: express.Response) {
        const { key } = request.query;
        if (!key) {
            return response.status(400).send();
        }

        const db = DatabaseUtils.getInstance();
        const sql = 'SELECT _value FROM config WHERE _key = ?';
        const data: any = await db.queryPromise(sql, [key]);
        if (data.length === 0) {
            return response.status(404).send();
        }
        const result = data[0]._value;
        return response.json(result);
    }
}

export default new ConfigController();
