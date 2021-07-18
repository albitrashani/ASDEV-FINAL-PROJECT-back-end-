import {  Request, Response, Router } from 'express';
import { connect } from 'mongodb';
import { getOrdersStatusFromUsername } from '../../data/access.dao';
import { okurl } from '../../data/dao';
import Order from '../../data/models/order.model';
//import ID from './ID';
const router = Router();

router.get('/order/list', async (req:Request,res:Response)  => {
  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
  const result  = await client.db('FinalProject').collection('Orders').find().toArray();
  const data =result;
  res.send(data);
});
router.get('/order/:username', async (req: Request, res: Response) => {
  const username= req.params.username ;
  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true}) ;
  const result  = await client.db('FinalProject').collection('Orders').find({user:username});
  const data = await result.toArray();
  if(data.length==0) res.json("No orders");
  else res.json(data);
});
router.post('/order/new', async (req:Request,res:Response) => {
  //const username = req.user;
  const { username, items, status } = req.body;
  if(!items || !status) {
    return res.status(400).json({
      message: 'items and status fields are needed'
    })
  }
  const orderStatus = await getOrdersStatusFromUsername(username);
  
  if(orderStatus!==null){
    
    const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
    client.db('FinalProject').collection('Orders').updateOne({_id:orderStatus},{$push: {items:items[0]}})
    return res.send({ message: "Uploaded to db"});
  }else{
    const object ={user:username,items:items,status:status} as Order
    const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
    client.db('FinalProject').collection('Orders').insertOne(object)
    return res.send({ message: "Uploaded to db"});
  }
});

router.put('/order/:username', async (req:Request,res:Response) => {
  const username  = req.params.username ;
  const { status } = req.body;
 

  const orderStatus = await getOrdersStatusFromUsername(username);
  
  if(orderStatus!==null){
    
    const client =await connect(okurl,  {useNewUrlParser: true, useUnifiedTopology: true});
    client.db('FinalProject').collection('Orders').updateOne({_id:orderStatus},{$set: {status:status}})
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