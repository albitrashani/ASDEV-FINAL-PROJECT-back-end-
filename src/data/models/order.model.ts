import { BSONType } from 'mongodb';
export default interface Order {
    user: string;
    items: {type:Array<BSONType>, required: true, default: [] }
    status: { type: String, default:"processing" }

     
    
  }