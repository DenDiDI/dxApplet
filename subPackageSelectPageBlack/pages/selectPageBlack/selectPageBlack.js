// subPackageSelectShop/pages/selectShop/selectShop.js
import {baseUrl} from '../../../utils/config'
import request from '../../../utils/require'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allData:[],
    inputTxt:'请输入关键词',
    // shopTestData:["测试1","测试2","高级门店","高等门点"],
    searchData:[],
    dataArr:[], //请求到的所有数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    // let id = options.id;
    let roleid = wx.getStorageSync('loginMsg').identity;

    if(options.url&&options.arg){
      this.setData({
        url:options.url,
        arg:options.arg,
        argName:options.argName
      })
       //传过来url和参数
    if(Number(roleid)==2){
      this.getBAllData();
      return;
     }
    }
  
   
   
  },
  //获取门店列表
  getSearchList(e){
    let key = e.detail;
    if(key==""){
      console.log("key")
      this.setData({
        searchData:this.data.allData
      })
      return;
    }
    let arr = this.data.allData.filter((item)=>{
      return item.indexOf(key)>-1;
    })
    this.setData({
      searchData:arr
    })
  },
  getBAllData(){
    if(this.data.argName=="shop"){
      wx.request({
        url:baseUrl+this.data.url,
        method:'post',
        data:{
          id:this.data.arg
        },
        success:(res)=>{
        if(res.data.message=="success"&&res.data.code==200){
          let data = res.data.data;
          let newData = [];
            if(data.length==0)return;
            data.forEach((item)=>{
              newData.push(item.shopName);
            })
            this.setData({
              allData:newData,
              searchData:newData,
              dataArr:data
            })
        }
        },
        fail:(err)=>{
          console.log(err)
        }
      })
    }
    if(this.data.argName=="goods"){
     let data = {
        "barCode": this.data.arg,
        "brandName": "",
        "goodsBaseName": "",
        "isGift": 0,
        "longCode": "",
        "priceMax": 0,
        "priceMin": 0,
        "recordCount": 0,
        "startIndex": 0
      }
      request({
        url:this.data.url,
        method:'post',
        data:data
      }).then((res)=>{
        if(res.data.message=="success"&&res.data.code==200){
          let data = res.data.data;
          let newData = [];
          if(data.length==0)return;
          data.forEach((item)=>{
            newData.push(item.goodsBaseName);
          })
            this.setData({
              allData:newData,
              searchData:newData,
              dataArr:data
            })
        }
      }).catch(err=>{
        console.log(err)
      })
    }
    
  },

getSelectVal(e){
  let id = e.target.dataset.id;
  let val = this.data.searchData[id];
  
  console.log("eeee",e,val)
  let pages = getCurrentPages();
  let prevPage = pages[pages.length-2];

  if(this.data.argName=="shop"){
    let selobj = this.data.dataArr.find((item)=>{
      return item.shopName == val
    })
    prevPage.setData({
      shopV:val,
      shopDetail:selobj
    })
  }else{
    let selobj = this.data.dataArr.find((item)=>{
      return item.goodsBaseName == val
    })
    prevPage.setData({
      goodsV:val,
      goodsDetail:selobj
    })
  }

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
    this.getBAllData()
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