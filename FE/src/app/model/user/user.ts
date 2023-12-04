import {Account} from "./account";

export interface User {
  id?: number;
  name?: string;
  account?: Account;
  phoneNumber?: string;
  birthDay?: string;
  address?: string;
  idCard?: string;
  gender?: string;
}
