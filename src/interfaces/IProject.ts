export default interface IProject {
  name: string
  description: string
  url?: string
  tag: string
  created: number
  userId: string
  id?: string
  hasImage?: boolean
  image?: string
}
