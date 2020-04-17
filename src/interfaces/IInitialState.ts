import ILoginUser from './ILoginUser'
import ITaskData from './ITaskData'

export default interface IInitialState {
  loginUser: ILoginUser
  isLogin: boolean
  isCheckingLogin: boolean,
  myTask: ITaskData
}