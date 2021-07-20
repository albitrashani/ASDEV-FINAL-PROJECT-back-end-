import {  Request, Response, Router } from 'express';
import { connect, ObjectId } from 'mongodb';
import {   getOrdersStatusFromUsername, getStatusFromToken, getUsernameFromToken } from '../../data/access.dao';
import { okurl } from '../../data/dao';
import Order from '../../data/models/order.model';

const router = Router();

//Get all orders
router.get('/order/list', async (req:Request,res:Response)  => {
  const access_token = req.headers.authorization;
  const realToken = access_token?.split(' ', 2)[1];
  const status = await getStatusFromToken(realToken);
  if(status=='admin') { 
    const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
    const result  = await client.db('FinalProject').collection('Orders').find().toArray();
    const data =result;
    if(data.length==0){
      return res.status(403).json({
        message: "there are no orders"
       });
    }
    return res.json(data);
  }else{
    return res.status(403).json({
     message: "Only ADMIN access_token can acces Orders"
    });
  }
});
  
//get order with matchin username
router.get('/order/:username', async (req: Request, res: Response) => {
  const username= req.params.username ;
  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true}) ;
  const result  = await client.db('FinalProject').collection('Orders').find({user:username});
  const data = await result.toArray();
  const access_token = req.headers.authorization;
  const realToken = access_token?.split(' ', 2)[1];
  
  const namestatus = await getUsernameFromToken(realToken);
  if(namestatus==username) {
    if(data.length==0) return res.json("No orders");
    else return res.json(data);
  }else{
    return res.status(403).json({
      message: "You can acces only your data"
     });
    
  }
});

//add new order
router.post('/order/new', async (req:Request,res:Response) => {
  //const username = req.user;
  const { username, items, status, amount } = req.body;
  if(!items || !status) {
    return res.status(400).json({
      message: 'items and status fields are needed'
    })
  }
 
    const object ={user:username,items:items,status:status,totalamount:amount} as Order
    const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
    client.db('FinalProject').collection('Orders').insertOne(object)
    return res.send({ message: "Uploaded to db"});
  
});

router.put('/order/:id', async (req:Request,res:Response) => {
  const id  = req.params.id ;
  //const { status } = req.body;
 

  const orderStatus = await getOrdersStatusFromUsername(id);
 // console.log(orderStatus)
  if(orderStatus!==null){
    const id1=new ObjectId(orderStatus)
    const client =await connect(okurl,  {useNewUrlParser: true, useUnifiedTopology: true});
    client.db('FinalProject').collection('Orders').updateOne({_id:id1},{$set: {status:"delivered"}})
    return res.json(true);
  }else{
    
    return res.send("Status can't be changed");
  }


 })
router.delete('/order/:username', async (req:Request,res:Response)  => {
  //const username  = req.params.username ;
  const id= req.body.param;
  const client =await connect(okurl,  {useNewUrlParser: true, useUnifiedTopology: true});
  client.db('FinalProject').collection('Orders').deleteOne({_id:id})
  return res.json(true);

});



export {
  router as orderController
};


 