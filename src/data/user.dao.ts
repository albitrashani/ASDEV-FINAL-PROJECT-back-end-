import { connect } from 'mongodb';
import { okurl } from './dao';
import User from './models/user.model';



export async function insertUser(user: User): Promise<void> {
  

  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
  //console.log("ktu");
  if(user.status==null) {
     client.db('FinalProject').collection('users').insertOne(
       {name:user.name,
        surname:user.surname,
        username:user.username,
        password:user.password,
        status:"user"
        
      });
  }else {
     client.db('FinalProject').collection('users').insertOne(
       {name:user.name,
        surname:user.surname,
        username:user.username,
        password:user.password,
        status:user.status
        
      });
    }
}

export async function checkIfExists(usr: string) {
  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
  const result  = await client.db('FinalProject').collection('users').find({username:usr});
  const results =await result.toArray() ;
  if(results.length===0)return false;
   
  return true;

}

export async function getUser(usr: string): Promise<User> {
  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
  const result  = await client.db('FinalProject').collection('users').find({username:usr});

 const results =await result.toArray() ;
 const data = results[0];
 const data1 =data as User;
 
 return data1;

}