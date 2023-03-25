// pages/sales/cashRecord/cashRecord.js
import request from '../../../../utils/require'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cashRecordList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  
  },
  getCashRecord(){
    let userid = wx.getStorageSync('loginMsg').userId;
    request({
      url: '/delegate/appSales/salesWithdrawalList',
      method:'post',
      data:{
        id: userid
      }
    }).then((res)=>{
      let data = res.data.data;
      if(data.length==0)return;
      // let testData= data.concat(data,data)
    
      this.setData({
        cashRecordList: data
      })
    }).catch((err)=>{
      console.log(err);
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
    wx.setNavigationBarColor({
      frontColor:"#000000",
      backgroundColor:"#FFFFFF"
    })
    this.getCashRecord();
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