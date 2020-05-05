import ILoginUser from './ILoginUser'
import { ITodoNew } from './ITodo'

export default interface IInitialState {
  loginUser: ILoginUser
  isLogin: boolean
  isCheckingLogin: boolean
  myTodos: ITodoNew[]
}
