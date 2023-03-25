
import {baseUrl} from '../../../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    getCodeTxt:'获取验证码',
    registerName:'',
    registerPhone:'',
    registerCode:'',
    registerIdNumber:'',
    registerWeChat:'',
    registerAgent:'',
    shopV:'请选择门店',
    registerRemarks:'',
    registerChecked:false,
    array: ['美国', '中国', '巴西', '日本'],
    businessData:[],
    show:false,
    registerBusinessVal:'',
    loadingFlg:false,
    // registerSucShow: false
  },

  register(){
    let that = this;
    wx.login({
      success (res) {
        if (res.code) {
          console.log(res.code)
          that.submitRegister(res.code);
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    
  },
  submitRegister(code){
    let flg = this.getRegisterCheck();
    if(!flg)return;
    let userinfo = wx.getStorageSync('userInfo');
    console.log(userinfo)
    this.setData({
      loadingFlg:true
    })
    wx.request({
      url: baseUrl+'/manufacture/applets/regist',
      method:'post',
      data:{
        "appCode": code,
        "delegateCode": this.data.registerBusinessVal,  //代理商code
        "idcard": this.data.registerIdNumber,
        "identity": 3,
        "name": this.data.registerName,
        "phoneNumber": this.data.registerPhone,
        "remarks": this.data.registerRemarks,
        "shopName": this.data.shopV,
        "verificationCode": this.data.registerCode,
        "wechatHeaderPath": userinfo.avatarUrl,
        "wechatNickName": userinfo.nickName,
        "wechatNumber": this.data.registerWeChat
      },
      success:(res)=>{
        this.setData({
          loadingFlg:false
        })
        if(res.data.code == 200 && res.data.message=="success"){
          // wx.setStorageSync('delegateName', this.data.businessVal);
          wx.showModal({
            title: '注册成功！',
            content: '您已提交申请，请等待后台审核',
            showCancel: false,
            success (res) {
              if (res.confirm) {
               //直接进入主页面
               //授权成功可以登录
              wx.navigateTo({
                url: '/pages/login/login',
              }) 
            } 
          }
      })
    }else{

          wx.showModal({
            title: '注册失败！',
            content: res.data.message,
            showCancel: false
          })
        }
      },
      fail:(err)=>{
        this.setData({
          loadingFlg:false
        })
        wx.showToast({
          title: '服务器异常',
          icon:'error',
          duration:2000
        })
      }
    })
  },
  getRegisterCode(){
    if(this.data.registerPhone.length==0){
      wx.showToast({
        title: '请先输入手机号',
        icon:'error',
        duration:2000
      })
      return;
    }
    if(this.data.getCodeTxt!="获取验证码")return;
    console.log("注册页面的验证码",this.data.registerPhone);

    let phone = this.data.registerPhone;  
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
      url: baseUrl+'/manufacture/sms/verification',
      method:'post',
      data:{
        "phonenumber": phone
      },
      success:(res)=>{
        if(res.data.code==200&&res.data.message=="success"){
          wx.showToast({
            title: '正在发送验证码,3分钟内有效',
            icon:'none',
            duration:2000
          })
        }else{
          wx.showToast({
            title: "请勿重复发送验证码",
            icon:'none',
            duration:2000
          })
        }
       
      },
      fail:(err)=>{
        wx.showToast({
          title:"服务器异常",
          icon:'error',
          duration:2000
        })
      }
    })
  },
  //单选
  onChangeChecked(){
    let flg = !this.data.registerChecked
    console.log(flg)
    this.setData({
      registerChecked: flg,
    });
  },
  inputRegisterName(e){
    this.setData({
      registerName:e.detail.value
    })
  },
  inputRegisterPhone(e){
    this.setData({
      registerPhone:e.detail.value
    })
  },
  inputRegisterCode(e){
    this.setData({
      registerCode:e.detail.value
    })
  },
  inputRegisterIdNumber(e){
    
    this.setData({
      registerIdNumber:e.detail.value
    })
  },
  inputRegisterWeChat(e){
    this.setData({
      registerWeChat:e.detail.value
    })
  },
  inputBusinessVal(e){
   
      this.setData({
        registerBusinessVal:e.detail.value
      })
      // if(e.detail.value==42||e.detail.value==809||e.detail.value==811||e.detail.value==816){
      //   this.getSalesShopData();
      // }
     
  },
 
  bindPickerShopChange(){
    let n = this.data.registerBusinessVal;
    wx.navigateTo({
      url: '/subPackageSelectShop/pages/selectShop/selectShop?id='+n,
    })
  },
  inputRegisterRemarks(e){
    this.setData({
      registerRemarks:e.detail.value
    })
  },
  getRegisterCheck(){
    if(this.data.registerName==0){
      wx.showToast({
        title: '请先输入姓名',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(this.data.registerPhone==0){
      wx.showToast({
        title: '请先输入手机号码',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(this.data.registerCode==0){
      wx.showToast({
        title: '请先输入验证码',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(this.data.registerIdNumber==0){
      wx.showToast({
        title: '请先输入身份证号码',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(this.data.registerBusinessVal==0){
      wx.showToast({
        title: '请先输入代理商代码',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(this.data.shopV=="请选择门店"){
      wx.showToast({
        title: '请选择门店',
        icon:'none',
        duration:2000
      })
      return false;
    }
    if(!this.data.registerChecked){
      wx.showToast({
        title: '未勾选网络服务使用协议',
        icon:'none',
        duration:2000
      })
      return false;
    }
    return true;
  },
  
  getAgreeTxt(){
    this.setData({
      show: true
    })
  },
  confirmTxt(){
    this.setData({
      show: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
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
    // let shopName = wx.getStorageSync('shopName');
    // if(shopName&&shopName!=''){
    //   this.setData({
    //     registerShop:shopName
    //   })
    //   wx.removeStorageSync('shopName');
    // }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})