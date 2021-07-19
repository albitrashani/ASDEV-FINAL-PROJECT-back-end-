import { Request, Response, Router } from 'express';
import { connect } from 'mongodb';
import { getStatusFromToken, getUsernameFromToken } from '../../data/access.dao';
import { okurl } from '../../data/dao';
 
const router = Router();

//get specific user as admin
router.get('/asadmin/:username', async (req:Request,res:Response) => {
  const username = req.params.username;
  const access_token = req.headers.authorization;
  const realToken = access_token?.split(' ', 2)[1];
  const status = await getStatusFromToken(realToken);
  if(status=='admin') { 
    const client = await connect(okurl, { useUnifiedTopology: true, useNewUrlParser: true});
    const result  = client.db('FinalProject').collection('users').find({ username: username });
    const results =await result.toArray() ;
    if(results.length==0){
      return res.status(403).json({
        message: "This username does not exists"
       });
    }
     
     return res.json(results);
  }else{
    return res.status(403).json({
     message: "Only ADMIN access_token can acces users"
    });
  }
});

//get specific user when username=token
router.get('/:username', async (req:Request,res:Response) => {
  const username = req.params.username;
  const access_token = req.headers.authorization;

  const realToken = access_token?.split(' ', 2)[1];
  if(!realToken) {
    return res.status(401).json({
      message: "you need to provide an access_token in Bearer form"
    })
  }
  const namestatus = await getUsernameFromToken(realToken);
  if(namestatus==username) { 
    const client = await connect(okurl, { useUnifiedTopology: true, useNewUrlParser: true});
    const result  = client.db('FinalProject').collection('users').find({ username: username });
    const results =await result.toArray() ;
    return res.json(results);
       
  }else{
    return res.status(403).json({
      message: "You can acces only your data"
     });
    
  }
});

//return all users if token is from admin
router.get('/', async (req:Request,res:Response) => {
  
  const access_token = req.headers.authorization;
  const realToken = access_token?.split(' ', 2)[1];
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