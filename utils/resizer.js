import { nanoid } from 'nanoid'

const resizeImage = (
  inputImage,
  maxWidth = null,
  maxHeight = null,
  type = 'image/jpeg',
  randomName = true,
  quality = 0.75
) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    img.onload = function () {
      let width = img.width
      let height = img.height

      if (maxWidth && (width > maxWidth)) {
        height = (maxWidth / width) * height
        width = maxWidth
      }
    
      if (maxHeight && (height > maxHeight)) {
        width = (maxHeight / height) * width
        height = maxHeight
      }

      canvas.width = width
      canvas.height = height

      ctx.drawImage(img, 0, 0, width, height)

      const currentRandomName = nanoid(10)

      canvas.toBlob((blob) => {
        resolve({
          blob: new File([blob], randomName ? currentRandomName : inputImage.name, { type, lastModified: Date.now() }),
          dataUrl: {
            name: currentRandomName,
            url: canvas.toDataURL(type, quality)
          }
        })
      }, type, quality)
    }

    img.onerror = reject

    img.src = URL.createObjectURL(inputImage)
  })
}

export const Resizer = async (event, maxWidth = null, maxHeight = null, type = 'image/jpeg') => {
  const { files } = event.target

  if (!files?.length) return

  const dataUrlArray = []

  // We'll store the files in this data transfer object
  const dataTransfer = new DataTransfer()

  // For every file in the files list
  for (const file of files) {
    // We don't have to compress files that aren't images
    if (!file.type.startsWith('image')) {
        // Ignore this file, but do add it to our result
        dataTransfer.items.add(file)
        continue
    }

    const resizedFile = await resizeImage(file, maxWidth, maxHeight, type)

    // Save back the compressed file instead of the original file
    dataTransfer.items.add(resizedFile.blob)
    dataUrlArray.push(resizedFile.dataUrl)
  }

  event.target.files = dataTransfer.files

  // Set value of the file input to our new files list
  return { blob: event.target.files, dataUrl: dataUrlArray}
}
