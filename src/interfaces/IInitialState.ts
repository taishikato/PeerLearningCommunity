import ILoginUser from './ILoginUser';
import { ITodoNew } from './ITodo';
import { ITodoData } from '../interfaces/ITodoData';

export default interface IInitialState {
  timeline: ITodoData[];
  loginUser: ILoginUser;
  isLogin: boolean;
  isCheckingLogin: boolean;
  myTodos: ITodoNew[];
}
