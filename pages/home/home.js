import { baseUrl } from '../../utils/config'
import request from '../../utils/require'
var app = getApp();
var code = app.globalData.code
Page({

  /**
   * 页面的初始数据
   */
  data: {
      role_Id:3,
      condition:false,
      swiperList: []
  },
  toRewardRecord(){
    wx.navigateTo({
      url: '/subPackageRewardRecord/pages/sales/rewardRecord/rewardRecord',
    })
  },
  toCode(){
    wx.switchTab({
      url: '/pages/taskAndCode/taskAndCode',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   console.log("loadcode",app)
  },

  getSwiperImg(){
    let loginMsg = wx.getStorageSync('loginMsg');
    request({
      url: '/delegate/banner/list',
      method:'get',
    }).then((res)=>{
     let list = res.data.data;
     let nlist = [];
     list.forEach((item)=>{
       item.picUrl = `${baseUrl}/${loginMsg.ip}:${loginMsg.port}/${item.picUrl}`
       nlist.push(item)
     })
     this.setData({
      swiperList:nlist,
      condition:true
     })
    }).catch((err)=>{
      console.log(err)
    })
  },
  toActive(){
    wx.switchTab({
      url: '/pages/rankAndActive/rankAndActive',
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
    
    this.getSwiperImg()
    let num = wx.getStorageSync('roleId');
    if(Number(num)==3){
      
      if (typeof this.getTabBar === 'function'&&this.getTabBar()) {
        this.getTabBar().setData({
          selected: 0,
          backgroundColor:'#FFFFFF',
          list:[
            {
              "pagePath": "../../pages/home/home",
              "text": "首页",
              "iconPath": "../assets/images/shouye.png",
              "selectedIconPath": "../assets/images/shouyeA@2x.png"
          },
          {
              "pagePath": "../../pages/taskAndCode/taskAndCode",
              "text": "扫码",
              "iconPath": "../assets/images/saomasoudan.png",
              "selectedIconPath": "../assets/images/saomasoudanA.png"
          },
          {
            "pagePath": "../../pages/rankAndActive/rankAndActive",
            "text": "活动",
            "iconPath": "../assets/images/huodong.png",
            "selectedIconPath": "../assets/images/huodongA@2x.png"
          },
          {
            "pagePath": "../../pages/mine/mine",
            "text": "我的",
            "iconPath": "../assets/images/mine@2x.png",
            "selectedIconPath": "../assets/images/mineA@2x.png"
          }
          ]
        })
    }
    }
    this.getStorage()
  },
  getStorage(){
    let loginMsg = wx.getStorageSync('loginMsg');
    let roleId = wx.getStorageSync('roleId');
    let dCode = wx.getStorageSync('dCode');
    if(roleId&&dCode&&loginMsg){
      return;
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
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