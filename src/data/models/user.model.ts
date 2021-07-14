import { ObjectId } from "mongodb";

export default interface User {
  _id?:ObjectId;
  name: string;
  surname: string;
  username: string;
  password: string;
  status: { type: String, default: 'user' }
  
  
}