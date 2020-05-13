import ILoginUser from './ILoginUser';
import { ITodoNew } from './ITodo';
import { ITodoData } from '../interfaces/ITodoData';

export default interface IInitialState {
  timeline: ITodoData[];
  loadMoreCount: number;
  loginUser: ILoginUser;
  isLogin: boolean;
  isCheckingLogin: boolean;
  myTodos: ITodoNew[];
}
