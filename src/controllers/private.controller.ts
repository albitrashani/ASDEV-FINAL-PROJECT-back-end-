import { Request, Response, Router } from 'express';
import { getUsernameFromToken } from '../data/access.dao';
import { orderController } from './private/Order.controller';
import { userController } from './private/user.controller';

const router = Router();

router.use(async (req: Request, res: Response, next: Function) => {
  const access_token = req.headers.authorization;

  const realToken = access_token?.split(' ', 2)[1];
  if(!realToken) {
    return res.status(401).json({
      message: "you need to provide an access_token in Bearer form"
    })
  }
  const username = await getUsernameFromToken(realToken);
  if(!username) {
    return res.status(403).json({
      message: "invalid access_token"
    })
  }

  req.user = username;
  return next(undefined, req);
});

router.use('/user',userController);
router.use('/order',orderController);

router.get('/', async (req: Request, res: Response) => {
  //TODO private business logic
  res.json({
    something: "Welcome to private area",
    username: req.user
  })
});

export {
  router as privateRouter
};
