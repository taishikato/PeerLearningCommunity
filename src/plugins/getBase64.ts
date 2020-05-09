export default (img: File, callback: (imageUrl: TImageUrl) => void) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result as TImageUrl))
  reader.readAsDataURL(img)
}

type TImageUrl = string | null
