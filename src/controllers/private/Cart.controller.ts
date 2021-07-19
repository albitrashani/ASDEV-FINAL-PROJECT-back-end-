import {  Request, Response, Router } from 'express';
import { connect } from 'mongodb';
import { findCartFromUsername, getCartStatusFromUsername, getUsernameFromToken } from '../../data/access.dao';
import { okurl } from '../../data/dao';
import Order from '../../data/models/order.model';
 
const router = Router();

//Add new item to cart, if cart is empty it wil create a new cart for user.
//if item exists it will increase qnt by 1
//otherwise add the item
router.post('/cart/new', async (req:Request,res:Response) => {
  //const username = req.user;
  const { username, items, status } = req.body;
  if(!items || !status) {
    return res.status(400).json({
      message: 'items and status fields are needed'
    })
  }
  const orderStatus = await getCartStatusFromUsername(username);
  const nr = await findCartFromUsername(username,items[0].name);
  
  if(orderStatus!==null){
    if(nr!==null){
       
      var numri = +nr;
      numri++;
       console.log(numri.toString());
      const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
      client.db('FinalProject').collection('Cart').updateOne({_id:orderStatus,'items.name':items[0].name},{$set:{"items.$.qty":numri.toString()}})
      return res.send({ message: "Cart updated"});

    }else{
      const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
      client.db('FinalProject').collection('Cart').updateOne({_id:orderStatus},{$push: {items:items[0]}})
      return res.send({ message: "Uploaded to cart"});
    }
    
    
  }else{
    const object ={user:username,items:items,status:status} as Order
    const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
    client.db('FinalProject').collection('Cart').insertOne(object)
    return res.send({ message: "Uploaded to db"});
  }
});

//Get the cart element by giving username 
//if cart emty it will return "No Items"
//if token and username dont match you cant access cart
router.get('/cart/:username', async (req: Request, res: Response) => {
  const username= req.params.username ;
  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true}) ;
  const result  = await client.db('FinalProject').collection('Cart').find({user:username});
  const data = await result.toArray();
  const access_token = req.headers.authorization;
  const realToken = access_token?.split(' ', 2)[1];

  const namestatus = await getUsernameFromToken(realToken);
  if(namestatus==username) {
    if(data.length==0) return res.json({
        message: "No Items"
       });
    else return res.json(data);
  }else{
    return res.status(403).json({
      message: "You can acces only your data"
     });
    
  }

});

//delete Cart by username usually is done ofer order is submitet by fronend
router.delete('/delete/:username', async (req:Request,res:Response)  => {
  const username  = req.params.username ;
  const client =await connect(okurl,  {useNewUrlParser: true, useUnifiedTopology: true});
  client.db('FinalProject').collection('Cart').deleteOne({user:username})
  return res.json('cart deleted');

});



export {
  router as cartController
};


 