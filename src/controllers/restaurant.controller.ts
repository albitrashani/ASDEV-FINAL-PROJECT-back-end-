import { Request, Response, Router } from 'express';
import { connect } from 'mongodb';
import { getStatusFromToken } from '../data/access.dao';
import { okurl } from '../data/dao';
import { getRestaurant, insertMenuItem, insertRestaurant } from '../data/restaurant.dao';
const router = Router();

// Add restaurant
router.post('/add-res', async (req: Request, res: Response, next: Function) => {
  const {name, address, rating } = req.body;
  const access_token = req.headers.authorization;

  if(!name || !address || !rating ) {
    return res.status(400).json({
      message: 'name, address and rating fields are needed'
    })
  }
  
  const realToken = access_token?.split(' ', 2)[1];
  if(!realToken) {
    return res.status(401).json({
      message: "you need to provide an access_token in Bearer form"
    })
  }
  const username = await getStatusFromToken(realToken);
  if(username=='admin') {
    insertRestaurant({
      name,
      address,
      rating,
      
    });
    return res.json("Restaurant added to list");
  }else{
    return res.status(403).json({
      message: "Only ADMIN access_token can add restaurant"
    })
  }
     
});

router.get('/restaurant/list', async (req:Request,res:Response)  => {
  
  res.json(await getRestaurant()
  );
});
router.get('/biglietto/:idBiglietto', async (req: Request, res: Response) => {
  const idBiglietto= req.params.idBiglietto ;
  const client = await connect(okurl, {useNewUrlParser: true, useUnifiedTopology: true}) ;
  const result  = await client.db('DB').collection('concerts').find({iDBiglietto:idBiglietto});
  const data = await result.toArray();
  const data1 = data[0];
  res.json({iDBiglietto:data1.iDBiglietto,username:data1.username,price:data1.price});
});

router.post('/add-menuitem', async (req: Request, res: Response, next: Function) => {
  const {restaurantname,name, description, price } = req.body;
  const access_token = req.headers.authorization;

  if(!restaurantname || !name || !description || !price ) {
    return res.status(400).json({
      message: 'restaurantname, name, address and rating fields are needed'
    })
  }
  
  const realToken = access_token?.split(' ', 2)[1];
  if(!realToken) {
    return res.status(401).json({
      message: "you need to provide an access_token in Bearer form"
    })
  }
  const username = await getStatusFromToken(realToken);
  if(username=='admin') {
    insertMenuItem({
      restaurantname,
      name,
      description,
      price,
      
    });
    return res.json("Item added to menu list");
  }else{
    return res.status(403).json({
      message: "Only ADMIN access_token can add menu"
    })
  }
     
});




export {
  router as restaurantRouter
};

