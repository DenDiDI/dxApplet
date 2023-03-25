// subPackageSelectShop/pages/selectShop/selectShop.js
import {baseUrl} from '../../../utils/config'
import request from '../../../utils/require'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopData:[],
    inputTxt:'请输入门店关键词',
    // shopTestData:["测试1","测试2","高级门店","高等门点"],
    searchData:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    let id = options.id;
    let roleid = wx.getStorageSync('loginMsg').identity;
    // let roleid = 2;
    console.log(id)
    // if(roleid&&roleid==2){
    //   this.getBShopData(id);
    //   return;
    // }
    this.getSalesShopData(id);
  

  },
  //获取门店列表
  getShopList(e){
    console.log(e.detail);
    let key = e.detail;
    if(key==""){
      this.setData({
        searchData:this.data.shopData
      })
      return;
    }
    let arr = this.data.searchData.filter((item)=>{
      return item.indexOf(key)>-1;
    })
    this.setData({
      searchData:arr
    })
  },
  // getBShopData(id){
  //   // let id = wx.getStorageSync('loginMsg').userId;
  //     request({
  //       url:'/delegate/appBusinessManager/selectShopByBmId',
  //       method:'post',
  //       data:{
  //         "id": id
  //       }
  //     }).then((res)=>{
  //       console.log(res);
  //       if(res.data.message=="success"&&res.data.code==200){
  //         let data = res.data.data;
  //         let newData = [];
  //           data.forEach((item)=>{
  //             newData.push(item.shopName);
  //           })
  //           this.setData({
  //             shopData:newData,
  //             searchData:newData
  //           })
  //       }
  //     }).catch((err)=>{
  //       console.log(err)
  //     })
  // },
//获取代理商门店接口
getSalesShopData(id){
  wx.request({
    url: baseUrl+'/manufacture/applets/shopList',
    method:'post',
    data:{
      id: id
    },
    success:(res)=>{
      console.log(res)
      let data = res.data.data;
      let newData = [];
        data.forEach((item)=>{
          newData.push(item.shopName);
        })
        this.setData({
          shopData:newData,
          searchData:newData
        })
    },
    fail:(err)=>{
      console.log(err);
    }
  })
},
getShopVal(e){
  console.log(e.target.dataset.id);
  let id = e.target.dataset.id;
  let val = this.data.searchData[id];
  console.log(this.data.searchData,val)
  let pages = getCurrentPages();
  let prevPage = pages[pages.length-2];
  prevPage.setData({
    shopV:val
  })
  wx.navigateBack({ delta: 1, })
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