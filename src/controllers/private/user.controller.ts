import { Request, Response, Router } from 'express';
import { connect } from 'mongodb';
import { getStatusFromToken } from '../../data/access.dao';
import { okurl } from '../../data/dao';
import User from '../../data/models/user.model';
const router = Router();

router.get('/:username', async (req:Request,res:Response) => {
  const username = req.params.username;
  const access_token = req.headers.authorization;

  const realToken = access_token?.split(' ', 2)[1];
  if(!realToken) {
    return res.status(401).json({
      message: "you need to provide an access_token in Bearer form"
    })
  }
  const status = await getStatusFromToken(realToken);
  if(status=='admin') { 
    const client = await connect(okurl, { useUnifiedTopology: true, useNewUrlParser: true});
    const result  = client.db('FinalProject').collection('users').find({ username: username });
    const results =await result.toArray() ;
    const data = results[0];
    const data1 =data as User;
 
    return res.json(data1);
  }else{
    return res.status(403).json({
     message: "Only ADMIN access_token can acces users"
    });
  }
});

router.get('/', async (req:Request,res:Response) => {
  
  const access_token = req.headers.authorization;

  const realToken = access_token?.split(' ', 2)[1];
  if(!realToken) {
    return res.status(401).json({
      message: "you need to provide an access_token in Bearer form"
    })
  }
  const status = await getStatusFromToken(realToken);
  if(status=='admin') { 
    const client = await connect(okurl, { useUnifiedTopology: true, useNewUrlParser: true});
    const result  = client.db('FinalProject').collection('users').find({});
    const results =await result.toArray() ;
    
 
    return res.json(results);
  }else{
    return res.status(403).json({
     message: "Only ADMIN access_token can acces users"
    });
  }
});


export {
router as userController
};