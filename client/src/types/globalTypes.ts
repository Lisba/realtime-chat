export type ObjectType = Record<string, string>

export type Message = {
  room: string,
  author: string,
  message: string,
  time: string
}