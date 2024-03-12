import { IUser } from "../users/IUser";

export interface IOngs {
  id_ong : string,
  name : string,
  resposable : IUser,
  document : string,
  adress : string,
  city : string,
  state : string,
  email : string,

}
