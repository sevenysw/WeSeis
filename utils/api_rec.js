
function recognize_seis(src,method) {
  return new Promise((resolve, reject) => {
    let API_URL = 'https://www.siweiyu.top/demo'
    // let API_URL = 'http://127.0.0.1:5000/demo'
    console.log(method)
    wx.uploadFile({
      url: API_URL,
      filePath: src,
      formData: {
        method: method[0],
        method_dt: method[1]  
      },
      name: 'file',
      success(res) {
        var seis_res = JSON.parse(res.data)
        resolve(seis_res)
      },
    });
  })

}

module.exports.recognize_seis = recognize_seis