// 1. 将文件阅读转码功能封装成 promise 风格的函数

/**
 * 01 将用户选择的二进制路径格式图片转为 img.src 可识别的 base64 码
 * @param {Blob} 用户选择的 File 对象文件，二进制格式
 * @returns Promise
 */
export const resolveToBase64 = (file) => {
  return new Promise((resolve) => {
    const fr = new FileReader()
    fr.readAsDataURL(file) // 读取成 base64 码，还能读取到别的格式 readAsText()...
    fr.onload = (e) => {
      // console.log(e.target.result)
      resolve(e.target.result)
    }
  })
}
