import { v4 } from 'uuid';
import { connect } from 'mongodb';
import { okurl } from './dao';
import User from './models/user.model';



export async function createTokenForUser(user: User): Promise<string> {
  const token = v4();

  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
  client.db('FinalProject').collection('token').insertOne({username:user.username,status:user.status,Token:token,EX:60000})
  return token;
}

export async function getUsernameFromToken(token: string): Promise<string | null> {
  
  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
  const result  = await client.db('FinalProject').collection('token').find({Token:token}).toArray();
  const data = result[0].username;
  if(!data) {
    return null;
  }
  return data;
}
export async function getStatusFromToken(token: string): Promise<string | null> {
  
  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
  const result  = await client.db('FinalProject').collection('token').find({Token:token}).toArray();
  //console.log(result);
  const data = result[0].status;
  if(!data) {
    return null;
  }
  return data;
}

export async function getOrdersStatusFromUsername(x: string): Promise<string | null> {
  
  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
  const result  = await client.db('FinalProject').collection('Orders').find({user:x,status:"processing"}).toArray();
  if(result.length==0) {
    return null;
  }else{
    const data = result[0]._id;
    return data;
  }
}