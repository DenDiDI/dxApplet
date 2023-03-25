
import Dialog from '@vant/weapp/dialog/dialog';
import request from '../../utils/require'
var app = getApp();
let SCREEN_WIDTH = 750
let RATE = wx.getSystemInfoSync().screenHeight /wx.getSystemInfoSync().screenWidth
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ScreenTotalW: SCREEN_WIDTH,
    ScreenTotalH: SCREEN_WIDTH * RATE,
    role_Id:'',
    avatarUrl:'',
    userInfo:'',
    name:'',
    s_shop:'',
    s_phone:'',
    callNum:'',
    s_all_money:0,  //总额
    s_all_gmoney:0, //已
    s_all_agm:0, //可
    s_gmoney_ing:0  //中
  },
  //导购员 提现记录按钮
  s_getCashRecord(){
    wx.navigateTo({
      url: '/subPackageCashRecord/pages/sales/cashRecord/cashRecord',
    })
  },
  //导购员注销账号
  s_delCount(){
    Dialog.confirm({
      title: '是否选择注销账号',
      message: '此操作会删除您的账号信息，无法再使用该账号登陆，请确认操作？',
    }).then(() => {
      let loginMsg = wx.getStorageSync('loginMsg');
      request({
        url:'/delegate/sales/delete',
        method:'post',
        data:{
          id: loginMsg.userId
        }
      }).then((res)=>{
        if(res.data.code==200&&res.data.message=="success"){
          wx.showToast({
            title: '注销成功！',
            icon:'success',
            duration:2000
          })
          wx.clearStorageSync();
          wx.setStorageSync('key', 0);
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }else{
          wx.showToast({
            title: '注销出错！',
            icon:'error',
            duration:2000
          })
        }
      }).catch((err)=>{
        wx.showToast({
          title: '服务器异常！',
          icon:'error',
          duration:2000
        })
      })
    }).catch(() => {
    });

   
  },
  s_getMoney(){
    wx.navigateTo({
      url: '/subPackageCash/pages/sales/cash/cash',
    })

  },
  //导购员联系客服
  s_call(){
    let n = this.data.callNum;
    if(n.length==0){
      wx.showToast({
        title: "当前号码为空",
        icon:'error',
        duration:2000
      })
      return;
    };
    Dialog.confirm({
      title: '呼叫',
      message: n,
    }).then(() => {
      wx.makePhoneCall({
        phoneNumber: n,
        success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          console.log("拨打电话失败！")
        }
      })
    })
  },
  //业务员 新增门店
  b_AddShop(){
    wx.navigateTo({
      url: '/subPackageAddShop/pages/business/addShop/addShop',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      //获取用户头像信息等
      // this.getUserMsg();
      let that=this
      wx.getStorage({//异步获取缓存
          key:"userInfo",//本地缓存中指定的 key
          success:(res)=>{ 
            console.log('获取缓存成功',res.data)      
              this.setData({
                  name:res.data.nickName, //将得到的缓存给key 
                  avatarUrl:res.data.avatarUrl         
              })        
          },
          fail(res){
              console.log(res)
              wx.showModal({
                  title: '感谢您使用！',
                  content: '请允许小程序可以使用您的头像和名字！',
                  success (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                      that.getUserProfile()
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
          }   
      })
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗    
    wx.getUserProfile({
      desc: '用于保存用户的昵称', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        let userInfo = res.userInfo;
        this.setData({
          userInfo: res.userInfo,
        })
        wx.setStorage({
            key:'userInfo',//本地缓存中指定的 key(类型：string)
            data:res.userInfo,//需要存储的内容。只支持原生类型、Date、及能够通过JSON.stringify序列化的对象(类型:any)
            success:(res)=>{  
              console.log("userInfo",res)
                this.setData({
                  avatarUrl:userInfo.avatarUrl,         
                  name:userInfo.nickName
                })
            },
            fail:(f)=>{
            }
        })
      }
    })
  },
  s_getPhoneById(){
    request({
      url:'/delegate/activityConfig/select',
      method:'get'
    }).then((res)=>{
      if(res.data.code==200&&res.data.message=="success"){
        let num = res.data.data.customerService
       this.setData({
         callNum: num
       })
      }else{
      }
    }).catch((err)=>{
      wx.showToast({
        title: '服务器异常！',
        icon:'error',
        duration:2000
      })
    })
  },
  s_getShopById(){
    let loginmsg = wx.getStorageSync('loginMsg');
    let id = loginmsg.userId;
    request({
      url:'/delegate/shop/getShopName',
      method:'post',
      data:{
        "saleId":id
      }
    }).then((res)=>{
      
      if(res.data.code==200&&res.data.message=="success"){
        let sname = res.data.data
       this.setData({
        s_shop:sname
       })
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none',
          duration:2000
        })
      }
    }).catch((err)=>{
      wx.showToast({
        title: '服务器异常！',
        icon:'error',
        duration:2000
      })
    })
  },
  //导购员提现总额
  s_getAllMoney(){
    let loginmsg = wx.getStorageSync('loginMsg');
    let id = loginmsg.userId;
    request({
      url:'/delegate/appSales/salesRewardWithdrawal',
      method:'post',
      data:{
        id:id
      }
    }).then((res)=>{
      if(res.data.code==200&&res.data.message=="success"&&res.data.data){
        let m = '';
        if(res.data.data.reward){
           m = res.data.data.reward.zpmoney;  //总收益
        }
        let getm ='';
        if(res.data.data.withdrawal){
           getm = res.data.data.withdrawal.zpmoney  //已提现
        }
        let getma = '';
        if(res.data.data.withdrawalable){
          getma = res.data.data.withdrawalable.zpmoney  //可提现
        }
        let getming = '';
        if(res.data.data.withdrawaling){
          getming = res.data.data.withdrawaling.zpmoney  //提现中
        }
       this.setData({
        s_all_money:m||0,  //总
        s_all_gmoney:getm||0,  //已提现
        s_all_agm:getma||0, //可提现
        s_gmoney_ing:getming||0   //提现中
       })
      }else{
        wx.showToast({
          title: res.data.message,
          icon:'none',
          duration:2000
        })
      }
    }).catch((err)=>{
    })
  },
  loginOut(){
    Dialog.confirm({
      title: '是否选择退出账号？',
      message: '',
    }).then(() => {
      wx.clearStorageSync();
      wx.setStorageSync('key', 0);
      wx.reLaunch({
        url: '/pages/login/login',
      })
    }).catch(() => {

    });
    
  },
  getUserMsg(){
    let userinfo = wx.getStorageSync('userInfo');
    // let loginMsg = wx.getStorageSync('loginMsg')
    // let userName = loginMsg.userName;
    let phone = wx.getStorageSync('phone');
    // let avatarUrl = userinfo.avatarUrl;
    // if(userinfo&&userName&&phone){
    //   this.setData({
    //     s_img:avatarUrl,
    //     s_name:userName,
    //     s_phone:phone
    //   })
    // }
   
  },
  b_ScanCode(){
    wx.navigateTo({
      url: '/subPackageSaleScanCode/pages/saleScanCode/saleScanCode',
    })
  },
  b_Return(){
    wx.navigateTo({
      url: '/subPackageSaleReturn/pages/saleReturn/saleReturn',
    })
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
    this.s_getPhoneById();
    let str = app.globalData.log
    this.setData({
      str: str
    })
    let num = wx.getStorageSync('roleId');
    if(Number(num)==3){
       //导购员
      this.setData({
        role_Id:3
      })
      this.getTabBar().setData({
        selected: 3,
        backgroundColor:'#FFFFFF'
      })

      this.s_getAllMoney();
      this.s_getShopById();
      wx.setNavigationBarColor({
        frontColor:"#000000",
        backgroundColor:"#FFFFFF"
      })
      return;
    }
     if(Number(num)==2){
      //业务员
      this.setData({
        role_Id:2
      })
      this.getTabBar().setData({
        selected: 2,
        backgroundColor:'#fff'
      })
    }
    if(Number(num)==1){
      //管理员
      this.setData({
        role_Id:1
      })
      this.getTabBar().setData({
        selected: 2,
        backgroundColor:'#fff'
      })
      return;
    }
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