// pages/sales/cash/cash.js
import request from '../../../../utils/require'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:0,
    inpMoney:'',
    loadingFlg:false,
  },
  getInpMoney(e){
    console.log(e);
    let val = e.detail.value
    this.setData({
      inpMoney: val
    })
  },
  getCash(){
    if(Number(this.data.inpMoney)==0){
      wx.showToast({
        title: '请先输入金额',
        icon:'error'
      })
      return;
    }
    let m = this.data.inpMoney;
    this.setData({
      loadingFlg:true
    })
    wx.login({
      success: (res) => {
        request({
          url:'/delegate/salebill/withdrawal',
          method:'post',
          data:{
            code:res.code,
            zpmoney: m
          }
        }).then((res)=>{
          if(res.data.code==200&&res.data.message=="success"){
            this.setData({
              loadingFlg:false,
            })
            wx.showModal({
              title: '提现',
              content: `您已成功提现${m}元,请注意查收！`,
              showCancel:false,
              complete: (res) => {
                if(res.confirm){}
              }
            })
            this.setData({
              inpMoney:''
            })
            this.getAllMoney();
          }else{
            wx.showToast({
              title: res.data.message,
              icon:'none',
              duration:2000
            })
            this.setData({
              inpMoney:'',
              loadingFlg:false
            })
          }
        }).catch((err)=>{
          this.setData({
            loadingFlg:false
          })
          wx.showToast({
            title: '服务器异常！',
            icon:'error',
            duration:2000
          })
        })
      },
    })
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  getAllMoney(){
    let loginmsg = wx.getStorageSync('loginMsg');
    let id = loginmsg.userId;
    request({
      url:'/delegate/appSales/salesRewardWithdrawal',
      method:'post',
      data:{
        id:id
      }
    }).then((res)=>{
      if(res.data.code==200&&res.data.message=="success"){
      //  let m = res.data.data.reward.zpmoney;
       let gm = res.data.data.withdrawalable.zpmoney
       this.setData({
        money:gm
       })
      }else{
        wx.showToast({
          title: res.data.message,
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
    this.getAllMoney()
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