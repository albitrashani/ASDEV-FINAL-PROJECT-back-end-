import express, { Request, Response } from 'express';
import { json } from 'body-parser';
import { authRouter } from './controllers/auth.controller';
import { privateRouter } from './controllers/private.controller';
import { restaurantRouter } from './controllers/restaurant.controller';


declare global {
  namespace Express {
    interface Request {
      user?: string
    }
  }
}

const port = 3000;
const app = express();

app.use((req, res, next)=>{
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST,PUT,DELETE');
  next();
});
app.use(json());
app.get('/', async (req: Request, res: Response) => {
  
  res.json({
    message: 'Welcome',
    example: true,
    idontknow: true,
    
  })
});

app.use('/auth', authRouter);
app.use('/private', privateRouter);
app.use('/public', restaurantRouter);

app.use(async (req: Request, res: Response) => {
  res.status(404).json({
    message: 'Endpoint not found'
  })
});

app.use(async (err: any, req: Request, res: Response, next: Function) => {
  if(err) {
    res.status(500).json({
      message: "Ooops, something went wrong",
      detail: err?.message || err
    })
  }
});

app.listen(port, () => {
  console.log(`listening to port ${port}`);
});