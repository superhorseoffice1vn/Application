import {User} from "../user/user";

export interface Agent {
  id:number;
  nameAgent:string;
  nameUser: string;
  phoneNumber:string;
  address:string;
  locationGoogleMap:string;
  user:User
}
