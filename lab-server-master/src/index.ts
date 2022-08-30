import App from "./app";
import AuthController from "./controllers/auth.controller";
import ConfigController from './controllers/config.controller';
import DatabaseController from "./controllers/database.controller";
import FilesController from "./controllers/files.controller";
import RecordController from "./controllers/record.controller";

// Defines the port to listen
const port = 8080;

const app = new App([
  DatabaseController,
  FilesController,
  AuthController,
  RecordController,
  ConfigController,
], port);

app.listen();
