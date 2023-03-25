import request from '../../../utils/require'
import * as echarts from '../../../ec-canvas/echarts.min.js'
import { _getShopList } from '../../../utils/getData';
import { initPieChart } from '../../../utils/mychart.js'
//饼图
// function getOption(listData){
 
// }
//饼图初始化
// function initChart(chart,listData) {
//   var option = getOption(listData)
//   chart.setOption(option);
//   return chart;
// }


Page({
  /**
   * 页面的初始数据
   */
  data: {
    echart1Show:true,
    echart2Show:true,
    shopData:{},
    shopList:[],
    testPieList1:[],
    testPieList2:[],
    ec1: {
      lazyLoad:true
    },
    ec2: {
      lazyLoad:true
    },
  },
 
 
  //门店合作率
  getShopEchart(){
    let id = wx.getStorageSync('loginMsg').userId;
    request({
      url:'/delegate/appBusinessManager/shopEnabelInfo',
      method:'post',
      data:{
        'id':id
      }
    }).then((res)=>{
      if(res.data.message=="success"&&res.data.code==200){
        let data = res.data.data;
        let enableNum = data.enableCount; //合作的
        let disenableNum = Number(data.shopCount)-Number(enableNum);  //未合作的
        let shopList = [
          {value:enableNum,name:'合作'},
          {value:disenableNum,name:'未合作'},
        ]
        this.setData({
          shopData: data,
          shopList:shopList,
          echart1Show:true
        })
        if(enableNum==0&&disenableNum==0){
          this.setData({
            echart1Show:false
          })
          return;
        }
        this.init_chart("#dgy-echart1",this.data.shopList);
      }else{
        wx.showToast({
          title: '门店合作率：'+res.data.message,
          icon:'none'
        })
        this.setData({
          echart1Show:false
        })
      }
    }).catch((err)=>{
      console.log(err)
    })
  },
  //导购员使用率
  getSalesEchart(){
    let id = wx.getStorageSync('loginMsg').userId;
    request({
      url:'/delegate/appBusinessManager/saleUseInfo',
      method:'post',
      data:{
        'id':id
      }
    }).then((res)=>{
      if(res.data.message=="success"&&res.data.code==200){
        let data = res.data.data;
        let useCount = data.useCount; //使用的
        let disuseCount = Number(data.saleCount)-Number(useCount);  //未使用的
        let salesList = [
          {value:useCount,name:'使用'},
          {value:disuseCount,name:'未使用'},
        ]
        this.setData({
          salesData: data,
          salesList: salesList,
          echart2Show:true
        })
        if(useCount==0&&disuseCount==0){
          this.setData({
            echart2Show:false
          })
          return;
        }
        
        this.init_chart("#dgy-echart2",this.data.salesList);
      }else{
        wx.showToast({
          title: '导购员使用率：'+res.data.message,
          icon:'none'
        })
        this.setData({
          echart2Show:false
        })
      }
    }).catch((err)=>{
      console.log(err)
    })
  },
  //饼图
  init_chart:function(id,value){
  let Component = this.selectComponent(id) 
    Component.init((canvas,width,height,dpr)=> { 
      const chart= echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio:dpr
      });
    initPieChart(chart,value)
    return chart;
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
    this.getShopEchart()
    this.getSalesEchart();
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