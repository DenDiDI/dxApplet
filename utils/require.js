// const baseUrl = "http://192.168.10.55:9004"
import {baseUrl} from './config'
let app = getApp();

var exceptionAddrArr = ['/login','/verification'];
//请求头处理函数
function CreateHeader(url) {
  let header = {}
    header = {
      'content-type': 'application/json'
    }
  
  if (exceptionAddrArr.indexOf(url) == -1) {  //排除请求的地址不须要token的地址
    let token = wx.getStorageSync('loginMsg').token;
    // let token = app.globalData.loginMsg.token
   header['token'] = token;
  }
  return header;
}

export default function reqeust(params) {
  let header = CreateHeader(params.url)
  let loginMsg = wx.getStorageSync('loginMsg');
  let ip = loginMsg.ip;
  let port = loginMsg.port;
  //  let ip = wx.getStorageSync('dx_ip');
  //  let port = wx.getStorageSync('dx_port')
  return new Promise((resolve, reject) => {
    wx.request({
      url: baseUrl+"/"+ip+":"+port+params.url,
      method: params.method || 'get',
      data: params.data || {},
      header: header,
      success: res => {
        console.log(res)
        if(res.data.code=="401"){
          wx.navigateTo({
            url: '/pages/login/login',
          })
          return;
        }
        resolve(res)
      },
      fail: err => {
        console.log("request",err)
        reject(err)
      }
    })
  })
}