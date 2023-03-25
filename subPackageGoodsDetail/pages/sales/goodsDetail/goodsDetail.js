import request from '../../../../utils/require'
import { baseUrl } from '../../../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options.id);
    this.setData({
      goods_Id: options.id
    })
  

    //根据id获取活动详情
    this.getActiveDetail()

  },
  getActiveDetail(){
    let loginMsg = wx.getStorageSync('loginMsg');
    request({
      url:'/delegate/activity/select',
      method:'post',
      data:{
        "id": this.data.goods_Id
      }
    }).then((res)=>{
      let data = res.data.data;
      data.picUrl = `${baseUrl}/${loginMsg.ip}:${loginMsg.port}/${data.picUrl}`
      let activeName = data.title
      wx.setNavigationBarTitle({
        title: activeName,
      })
       this.setData({
         goodsDetail:data 
       })
    }).catch((err)=>{
      console.log(err)
    })
  },
  toActivityPage(){
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