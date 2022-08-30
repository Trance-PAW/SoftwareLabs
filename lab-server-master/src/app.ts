import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';
import secure from './middlewares/secure.middleware';

class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: any[], port: number) {
    this.app = express();
    this.port = port;

    this.app.use(express.static(path.join(__dirname, 'public')));

    this.initializeMiddlewares();
    this.initializeControllers(controllers);

    this.app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile('index.html', { root: 'public' });
    });

  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`server started at http://localhost:${this.port}`);
    });
  }

  private initializeMiddlewares() {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cors());
    this.app.use(secure.initialize());
    this.secureRoutes();
  }

  private secureRoutes() {
    // Admin only routes
    this.app.use('/api/signup', secure.adminRoute);
    this.app.use('/api/updateDatabase', secure.adminRoute);
    this.app.use('/api/assign', secure.adminRoute);

    // User routes
    this.app.use('/api/users', secure.authRoute);
    this.app.use('/api/programs', secure.authRoute);
    this.app.use('/api/student', secure.authRoute);
    this.app.use('/api/student/groups', secure.authRoute);
    this.app.use('/api/student/schedule', secure.authRoute);
    this.app.use('/api/professor', secure.authRoute);
    this.app.use('/api/professor/groups', secure.authRoute);
    this.app.use('/api/professor/schedule', secure.authRoute);
    this.app.use('/api/group', secure.authRoute);
    this.app.use('/api/classroom', secure.authRoute);
  }

  private initializeControllers(controllers: any[]) {
    controllers.forEach((controller) => {
      this.app.use('/api/', controller.router);
    });
  }
}

export default App;
