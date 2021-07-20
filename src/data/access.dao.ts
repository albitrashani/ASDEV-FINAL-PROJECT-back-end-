import { v4 } from 'uuid';
import { connect,  ObjectId } from 'mongodb';
import { okurl } from './dao';
import User from './models/user.model';



export async function createTokenForUser(user: User): Promise<string> {
  const token = v4();

  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
  //client.db('FinalProject').collection('token').createIndex( { "createdAt": 1 }, { expireAfterSeconds: 3 } );

  client.db('FinalProject').collection('token').insertOne({"createdAt": new Date(),username:user.username,status:user.status,Token:token})
  return token;
}

export async function getUsernameFromToken(token: any): Promise<string | null> {
  
  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
  const result  = await client.db('FinalProject').collection('token').find({Token:token}).toArray();
  const data = result.length;
  if(data==0) {
    return null;
  }
  return result[0].username;
}
export async function getStatusFromToken(token: any) {
  
  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
  const result  = await client.db('FinalProject').collection('token').find({Token:token}).toArray();
  //console.log(result);
  const data = result.length;
  if(data==0) {
    return null;
  }
  return result[0].status;
}

export async function getOrdersStatusFromUsername(x: any): Promise<any | null> {
  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
  const id1=new ObjectId(x);
  const result  = await client.db('FinalProject').collection('Orders').find({_id:id1,status:'processing'}).toArray();
  //console.log(result)
  if(result.length==0) {
    return null;
  }else{
    const data = result[0]._id;
    return data;
  }
}

export async function getCartStatusFromUsername(x: string): Promise<string | null> {
   const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
  const result  = await client.db('FinalProject').collection('Cart').find({user:x}).toArray();
  if(result.length==0) {
    return null;
  }else{
    const data = result[0]._id;
    return data;
  }
}

export async function findCartFromUsername(x: string, y:string) {
  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
  const result  = await client.db('FinalProject').collection('Cart').find({user:x,'items.name':y}).toArray();
  if(result.length==0) {
   
    return null;
    
  }else{
    const data = result[0].items[0].qty;
    return data;
  }
}