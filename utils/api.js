import md5 from './md5.min.js'

const appid = '20190116000257364'  //注册百度翻译api
const key = 'FDET_Adm9RXb9yDnky10'    //注册百度翻译api

function translate(q, { from = 'auto', to = 'auto' } = { from: 'auto', to: 'auto' }) {
  // { from = 'auto', to = 'auto' } = { from: 'auto', to: 'auto' } 表示默认传递参数传递的值
  //Promise 对象
  return new Promise((resolve, reject) => {
    let salt = Date.now()  //随机数
    let jointid = `${appid}${q}${salt}${key}`
    let sign = md5(jointid)  //拼接 MD5进行加密
    wx.request({
      url: 'https://api.fanyi.baidu.com/api/trans/vip/translate',
      data: {
        q: q,  //待翻译文本
        appid: appid,
        salt: salt,  //随机数
        from: from,  //待翻译的原始语言
        to: to,   //待翻译成的目标语言
        sign: sign   //拼接 MD5进行加密
      },
      success(res) {
        if (res.data && res.data.trans_result) {
          resolve(res.data)
        } else {
          reject({ status: 'error', msg: '翻译失败' })
          wx.showToast({
            title: '翻译空',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail(e) {
        reject({ status: 'error', msg: '翻译失败' })
        wx.showToast({
          title: '网络异常',
          icon: 'none',
          duration: 3000
        })
      }
    })
  })
}
module.exports.translate = translate
