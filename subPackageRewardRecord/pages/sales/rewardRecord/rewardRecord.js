// pages/sales/rewardRecord/rewardRecord.js
import request from '../../../../utils/require'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:0,
    // 导购员审核通过
    s_code_data:[],
    test: -3,
    sdownFlg:true,
    sdownIndex:-1
  },
  // 提现按钮
  toCash(){
    wx.navigateTo({
      url: '/subPackageCash/pages/sales/cash/cash',
    })
  },
  //查看详情
  sCheckDetail(e){
    let sdownIndex = e.currentTarget.dataset.id;
    this.setData({
      sdownIndex:sdownIndex
    })
    let index = e.currentTarget.dataset.id;
    //先判断是否有数据 有则不请求
    let adAll = this.data.s_code_data;
    let ad = this.data.s_code_data[index];
        console.log(ad);
        ad.sdownIndex = !ad.sdownIndex;
        adAll.splice(index,1,ad);
        this.setData({
          s_code_data:adAll
        })
        console.log(this.data.s_code_data)
        if(ad.antiCodesDetail.length!=0)return;
   //根据id获取到数据中的防窜码billid
   let scanData = this.data.s_code_data;
   let obj = scanData[index];
   let idArr = obj.billIds.split(",");
   this.getCodeDetail(idArr);

  },
  getCodeDetail(idArr){
    request({
      url: '/delegate/salebill/settlementScanGoodsbaseList',
      method:'post',
      data: idArr
    }).then((res)=>{
      console.log(res);
      if(res.data.code==200&&res.data.message=="success"){
        let data = this.data.s_code_data;
        let index = this.data.sdownIndex
        let obj = data[index];
        obj.antiCodesDetail = res.data.data;
        this.setData({
          s_code_data:data
        })
      }else{
        wx.showToast({
          icon: 'none',
          title: res.data.message,
          duration: 1000
        })
      }

    }).catch((err)=>{
      console.log(err)
    })  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // wx.setNavigationBarColor({
    //   frontColor:"#000000",
    //   backgroundColor:"#FFFFFF"
    // })
    //奖励金额总钱

  },
  sEdit(e){
    let idx = e.currentTarget.dataset.id;
    let obj = this.data.s_code_data[idx];
    
    if(obj.billIds.indexOf(",")>-1){
      let arr = obj.billIds.split(",");
      app.globalData.billIds = arr;
    }else{
      app.globalData.billIds.push(obj.billIds);
    }
    wx.switchTab({
      url: '/pages/taskAndCode/taskAndCode',
      })
  },
  getRewardMoney(){
    let id = wx.getStorageSync('loginMsg').userId;
    request({
      url:'/delegate/appSales/salesRewardWithdrawal',
      method:'post',
      data:{
        "id": id
      }
    }).then((res)=>{
      if(res.data.code==200&&res.data.message=="success"){
        let m = res.data.data.withdrawalable.zpmoney;
        this.setData({
          money:m
        })
      }
      
    }).catch((err)=>{
      console.log(err)
    })
  },
  //红包领取列表
  getRewardList(){
    let id = wx.getStorageSync('loginMsg').userId;
    request({
      url:'/delegate/appSales/salesRewardList',
      method:'post',
      data:{
        "id": id
      }
    }).then((res)=>{
      if(res.data.code==200&&res.data.message=="success"){
        let data = res.data.data;
        console.log(data)
        if(data.length==0)return;
        let newData = [];
        data.forEach((item)=>{
          item.antiCodesDetail = [];
          item.sdownIndex = false
          newData.push(item)
        })
        this.setData({
          s_code_data:newData
        })
      }else{
        
      }
     
    }).catch((err)=>{
      console.log(err)
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
    this.getRewardMoney();
    this.getRewardList()
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