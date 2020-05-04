export default (value: string): string | null => {
  const pattern = /[#＃][Ａ-Ｚａ-ｚA-Za-z一-鿆0-9０-９ぁ-ヶｦ-ﾟー]+/
  const regResult = pattern.exec(value)
  if (regResult === null) return null
  return regResult[0]
}
