import ILoginUser from './ILoginUser'

export default interface IInitialState {
  loginUser: ILoginUser
  isLogin: boolean
  isCheckingLogin: boolean
}