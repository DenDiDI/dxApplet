import request from '../../../utils/require'
import {baseUrl} from '../../../utils/config'
// 获取应用实例
const app = getApp()

Page({
  data: {
    login:'',
    role_Id: '',
    loginPhone:'',
    loginCode:'',
    delegateCode:'',
    isRegister:false,
    getCodeTxt:'获取验证码',
    hasUserInfo: false, //本地是否有用户信息
    canIUseGetUserProfile: false  //是否可以调用获取信息的函数
  },

 
  onLoad(options) {
   
    
  },
  //获取用户信息
  getUserProfile: async function(e){
    let loginMsg = wx.getStorageSync('loginMsg')
    let phone = wx.getStorageSync('phone');  //手机号
    let dcode = wx.getStorageSync('dCode');  //代理商
	 if(wx.getUserProfile){
		return new Promise((resolve, reject) => {
			wx.getUserProfile({
				lang: "zh_CN",
				desc: '用于完善会员资料',
				success: (res) => {
					wx.setStorageSync('userInfo', res.userInfo);
          wx.setStorageSync('hasUserInfo', true)
          console.log("userInfo",res.userInfo);
        //如果点击了注册按钮
          if(this.data.isRegister){
          wx.navigateTo({
            url: '/subPackageRegister/pages/sales/register/register',
          })
          return;
        }
        //如果有缓存 登录信息手机号码和代理商代码 快速登录
        if(loginMsg&&phone&&dcode){
          this.fastlogin();
        }else{
          //重新登录
          this.login();
        }
				}
                // 失败回调根据自己项目去设计
            })
        })
	}else{
		return new Promise((resolve, reject) => {
			wx.getUserInfo({
				provider: 'weixin',
				lang: "zh_CN",
				success: (res) => {
          wx.setStorageSync('userInfo', res.userInfo);
          wx.setStorageSync('hasUserInfo', true)
          console.log("userInfo",res.userInfo);
          //如果点击了注册按钮
          if(this.data.isRegister){
            wx.navigateTo({
              url: '/subPackageRegister/pages/sales/register/register',
            })

            return;
          }
          //如果有缓存 登录信息手机号码和代理商代码 快速登录
          if(loginMsg&&phone&&dcode){
            this.fastlogin();
          }else{
            //重新登录
            this.login();
          }
				}
                // 失败回调根据自己项目去设计
			})
		})
	}


    // wx.getUserProfile({
    //   desc: '用于完善个人信息',
    //   success: (res) => {
    //     console.log(res)
    //     this.setData({
    //       userinfo: res.userInfo,
    //       hasUserInfo: true,
    //       salesListFlg:true
    //     })
    //     wx.setStorageSync('userInfo', res.userInfo);
    //     wx.setStorageSync('hasUserInfo', true)
    //     console.log("userInfo",res.userInfo);
    //     //如果点击了注册按钮
    //     if(this.data.isRegister){
    //       wx.navigateTo({
    //         url: '/subPackageRegister/pages/sales/register/register',
    //       })
    //       return;
    //     }
    //     //如果有缓存 登录信息手机号码和代理商代码 快速登录
    //     if(loginMsg&&phone&&dcode){
    //       this.fastlogin();
    //     }else{
    //       //重新登录
    //       this.login();
    //     }
       
    //   },
    //   fail: function (e){
    //     console.log(e)
    //     wx.showToast({
    //       title: '已取消授权',
    //       icon: "none",
    //       duration: 1500,
    //       mask: true
    //     })
    //   }
    // })
  },
  //获取验证码点击事件
  getCode(){
    if(this.data.loginPhone.length==0){
      wx.showToast({
        title: '请先输入手机号码',
        icon:'none'
      })
      return;
    }
    let i = 60;
    let t = setInterval(()=>{
      if(i==1){
        this.setData({
          getCodeTxt:'获取验证码'
        })
        clearInterval(t);
        t = null;
        return;
      }
      this.setData({
        getCodeTxt:`重新获取(${i}s)`
      })
      i--;
    },1000)
      wx.request({
        url: baseUrl+'/manufacture/sms/loginSms',
        method:'post',
        data:{
          "phonenumber": this.data.loginPhone
        },
      success:(res)=>{
        if(res.data.code==200&&res.data.message=="success"){
          wx.showToast({
            title: "正在发送验证码,3分钟内有效",
            icon:'none',
            duration:2000
          })
        }else{
          wx.showToast({
            title: "请勿重复发送验证码",
            icon:'none',
            duration:1000
          })
        }
       
        console.log(res)
      },
      fail:(err)=>{
        wx.showToast({
          title: "服务异常！",
          icon:'error',
          duration:1000
        })
        console.log(err)
      },
    })
  },
  toRegister(){
    let hasUserInfo = wx.getStorageSync('hasUserInfo')
    this.setData({
      isRegister: true
    })
    if(!hasUserInfo){
      this.getUserProfile();
      return;
    }else{
      wx.navigateTo({
        url: '/subPackageRegister/pages/sales/register/register',
      })
      return;
    }
  
  },
 
  inputPhone(e){
    console.log(e)
    this.setData({
      loginPhone:e.detail.value
    })
  },
  inputCode(e){
    this.setData({
      loginCode:e.detail.value
    })
  },
  inputDelegateCode(e){
    this.setData({
      delegateCode:e.detail.value
    })
    // wx.setStorageSync('dCode', e.detail.value)
  },
 toLogin(){
  let hasUserInfo = wx.getStorageSync('hasUserInfo')
    if(this.data.delegateCode.length==0){
      wx.showToast({
        title: '请先输入代理商代码',
        icon:'error'
      })
      return;
    }
    if(this.data.loginPhone.length==0){
      wx.showToast({
        title: '请先输入手机号',
        icon:'error'
      })
      return;
    }
    if(this.data.loginCode==0){
      wx.showToast({
        title: '请先输入验证码',
        icon:'error'
      })
      return;
    }
 
    if(!hasUserInfo){
      this.getUserProfile();
      return;
    }else{
      this.login();
    }
  
 },
 login(){
  let dcode = this.data.delegateCode;
  //授权成功可以登录
    wx.request({
      url:baseUrl+'/manufacture/applets/login',
      method:'post',
      data:{
        "delegateCode": Number(dcode),
        "identity": 0,
        "phoneNumber": this.data.loginPhone,
        "verificationCode": this.data.loginCode,
        "wechatNumber":''
      },
      success:(res)=>{
        if(res.data.message!="success"){
          wx.showToast({
            title: res.data.message,
            icon:'none',
            duration:2000
          })
          return;
        }
      if(res.data.code==200&&res.data.message=="success"){
        wx.setStorageSync('phone',this.data.loginPhone);
        wx.setStorageSync('roleId',res.data.data.identity);
        wx.setStorageSync('loginMsg', res.data.data);
        wx.setStorageSync('dCode', this.data.delegateCode);
        let id = res.data.data.identity;
        console.log("login--------",id)
        if(Number(id)==1){
        //管理员
          wx.switchTab({
            url: '/pages/taskAndCode/taskAndCode',
          })
          return;
        }
        if(Number(id)==2){
        //业务员
          wx.switchTab({
            url: '/pages/bi/bi',
          })
          return;
        }
        if(Number(id)==3){
        //导购员
        wx.switchTab({
          url: '/pages/home/home',
        })
        return;
        }
      }else{
        wx.showToast({
          title: res.data.message,
          icon: 'none',
          duration:2000
        })
    }
  },
  fail:(err)=>{
    wx.showToast({
      title: "服务器异常！",
      icon: 'error',
      duration:2000
    })
  }
})

  
 },
 fastlogin(){
  let delegateCode = wx.getStorageSync('dCode');  //用户代理商代码
  let phone = wx.getStorageSync('phone');  //用户手机号
  let id = wx.getStorageSync('roleId');
  wx.request({
    url:baseUrl+'/manufacture/applets/fasetLogin',
    method:'post',
    data:{
      "delegateCode": Number(delegateCode),
      "identity": id,
      "phoneNumber": phone,
      "verificationCode": '',
      "wechatNumber": ""
    },
   success:(res)=>{
    console.log("快速登录",res)
    if(res.data.code==200 && res.data.message=="success"){
      wx.setStorageSync('loginMsg', res.data.data)
      let id = res.data.data.identity
      wx.setStorageSync('roleId', id);
      console.log("fastlogin--------",id)
      if(Number(id)==1){
        //管理员
        wx.switchTab({
         url: '/pages/taskAndCode/taskAndCode',
       })
     }else if(Number(id)==2){
       //业务员
       wx.switchTab({
         url: '/pages/bi/bi',
       })
     }else{
      //导购员
      wx.switchTab({
       url: '/pages/home/home',
       })
     }
    }else if(res.data.code==401){
      this.fastlogin()
     
    }else{
      wx.showToast({
        title: res.data.message,
        icon:'none',
        duration:3000
      })
    }
  },
  fail:(err)=>{
    wx.showToast({
      title: "服务器异常",
      icon:'error',
      duration:3000
    })
  }
})
 },
  onShow: function () {
  
    wx.hideHomeButton({
      success: function () {
        console.log("hide home success");
      },
      fail: function () {
        console.log("hide home fail");
      },
      complete: function () {
        console.log("hide home complete");
      },
    });
       //获取到微信角色id
      //1、页面加载判断缓存中是否有用户信息 如果有直接登录
      let hasUserInfo = wx.getStorageSync('hasUserInfo')
  
      if(!hasUserInfo){
        this.getUserProfile();
        return;
      }
      let loginMsg = wx.getStorageSync('loginMsg')
      let phone = wx.getStorageSync('phone');  //手机号
      let dcode = wx.getStorageSync('dCode');  //代理商
      if(loginMsg&&phone&&dcode){
        //可以快速登录 登录手机号,身份id
        this.fastlogin();
        return;
      }
  }


})
