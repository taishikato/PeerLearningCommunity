export default interface ILoginUser {
  id: string
  displayName: string
  userName: string
  email: string
  picture: string
}

export const defaultUser = {
  id: '',
  displayName: '',
  userName: '',
  email: '',
  picture: ''
}