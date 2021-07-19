import { connect } from 'mongodb';
import { okurl } from './dao';
import Restaurant from './models/restaurant.model'
import Menu from './models/menu.model'


export async function insertRestaurant(rest: Restaurant): Promise<void> {
  

  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
     client.db('FinalProject').collection('Restaurant').insertOne(
       { 
         name:rest.name,
         address:rest.address,
         rating:rest.rating,        
      });
  
}

export async function insertMenuItem(rest: Menu): Promise<void> {
  

  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
     client.db('FinalProject').collection('Menu').insertOne(
       { 
         restaurantname:rest.restaurantname,
         name:rest.name,
         description:rest.description,
         price:rest.price,        
      });
  
}

export async function getRestaurant() {
    const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
    const result  = await client.db('FinalProject').collection('Restaurant').find().toArray();
      
 return result;
 }

 export async function getRestaurantMenu(y: string) {
  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true});
  const result  = await client.db('FinalProject').collection('Menu').find({restaurantname:y}).toArray();
  

  
return result;
 }