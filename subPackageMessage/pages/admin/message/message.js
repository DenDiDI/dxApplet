// pages/admin/message/message.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    a_msg_list:[
      {
        status:'1',
        money:'2000',
        time:'2022-01-01 20:11:11',
        checkStatus:1
      },
      {
        status:'0',
        money:'2000',
        time:'2022-01-01 20:11:11',
        checkStatus:0
      }
    ]
  },

  getTaskDetail(){
    wx.navigateTo({
      url: '/pages/admin/messageDetail/messageDetail',
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