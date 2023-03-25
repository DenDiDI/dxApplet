
import request from '../../utils/require'
import {initLineChartCommon} from '../../utils/mychart'
import * as echarts from '../../ec-canvas/echarts.min.js'
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    test:'',
    b_chCount: 0,
    b_retailRatio: 0,
    b_rewardTotal: 0,
		b_saleRatio: 0,
		b_salesCount: 0,
		b_scanCount: 0,
		b_shopCount: 0,
    b_role_Id:2,
    hbList:[],
    hbVals:[],
    ec: {
      lazyLoad:true
    },
    ec1: {
      lazyLoad:true
    },
    a_hbXArr: [],
    a_hbYArr: []
  },
  init_chart:function(id,list,value){
    let Component = this.selectComponent(id) 
      Component.init((canvas,width,height,dpr)=> { 
        const chart= echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio:dpr
      });
      initLineChartCommon(chart,list,value)
        return chart;
      })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   
  },
  //红包扫码金额页面
  toHongBaoScanEchart(){
    wx.navigateTo({
      url: '/subPackageHBSacnEchart/pages/hbScanEchart/hbScanEchart',
    })
  },
  //红包零售比echart页面
  toHongBaoEchart(){
    wx.navigateTo({
      url: '/subPackageHBEchart/pages/hbEchart/hbEchart',
    })
  },
   //动销率echart页面
  toDongXiaoEchart(){
    wx.navigateTo({
      url: '/subPackageDXEchart/pages/dxEchart/dxEchart',
    })
  },    
  //商品扫码echart页面
  toShangPinEchart(){
    wx.navigateTo({
      url: '/subPackageSPEchart/pages/spEchart/spEchart',
    })
  },
  //疑似窜货echart页面
  toCuanHuoEchart(){
    wx.navigateTo({
      url: '/subPackageCHEchart/pages/chEchart/chEchart',
    })
  },
  //导购员echart页面
  toDaoGouYuanEchart(){
    wx.navigateTo({
      url: '/subPackageDGYEchart/pages/dgyEchart/dgyEchart',
    })
  },
  //导购员echart页面
  toMenDianEchart(){
    wx.navigateTo({
      url: '/subPackageMDEchart/pages/mdEchart/mdEchart',
    })
  },
  //业务员获取bi数据
  getBBi(){
    let userid = wx.getStorageSync('loginMsg').userId;
    request({
      url:'/delegate/appBusinessManager/biData',
      method:'post',
      data:{
        "id": Number(userid)
      }
    }).then((res)=>{
      let data = res.data.data;
      let b_rewardList = data.rewardList
      let b_rewardListX = [];
      let b_rewardListY = [];
      b_rewardList.forEach((item)=>{
        b_rewardListY.push(item.zpmoney);
        b_rewardListX.push(item.zpmouth);
      })
      this.setData({
        b_chCount: data.chCount,
        b_retailRatio: Number(data.retailRatio*100),
        b_rewardTotal: data.rewardTotal,
		    b_saleRatio: Number(data.saleRatio*100),
		    b_salesCount: data.salesCount,
		    b_scanCount: data.scanCount,
        b_shopCount: data.shopCount,
        hbList: b_rewardListX,
        hbVals: b_rewardListY
      })
      this.init_chart('#b-b-hb-echart',this.data.hbList,this.data.hbVals);
    }).catch((err)=>{
      console.log(err)
    })
  },
  //管理员bi数据
  getABi(){
    //获取管理员bi页面头部的数据
    // this.getAHeaderNum();
    //获取所有的echart图表数据
    this.getAEchartData();
  },
  getAEchartData(){
    this.aHBEchart(); //红包
    this.aMDEchart(); //门店
    // this.aHBLSEchart();//红包零售
    // this.aSMEchart();//商品扫码
    // this.aCHEchart(); //窜货
    // this.aShopNumEchart();//门店总数
    // this.aDGYNumEchart();//导购员总数
  },
  //管理员红包扫码领取金额
  aHBEchart(){
    request({
      url:'/delegate/appBoss/rewardList',
      method:'post',
      data:{}
    }).then((res)=>{
      let data = res.data.data;
      let xArr = [];
      let yArr = [];
      data.forEach((item)=>{
        yArr.push(item.zpmoney);
        xArr.push(item.zpmouth);
      })
      this.setData({
        a_hbXArr: xArr,
        a_hbYArr: yArr
      })
      this.init_chart('#a-hb-echart',this.data.a_hbXArr,this.data.a_hbYArr);
    }).catch((err)=>{
      console.log(err)
    })
  },
  aMDEchart(){
    request({
      url:'/delegate/appBoss/rewardList',
      method:'post',
      data:{}
    }).then((res)=>{
      let data = res.data.data;
      let xArr = [];
      let yArr = [];
      data.forEach((item)=>{
        yArr.push(item.zpmoney);
        xArr.push(item.zpmouth);
      })
      this.setData({
        a_hbXArr: xArr,
        a_hbYArr: yArr
      })
      this.init_chart('#a-hb-echart',this.data.a_hbXArr,this.data.a_hbYArr);
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
   
    let num = wx.getStorageSync('roleId');
    if(Number(num)==2){
      this.getBBi()
      //业务员
      if(typeof this.getTabBar === "function" && this.getTabBar()){
        this.setData({
          role_Id: 2
        })
        this.getTabBar().setData({
          list:[{
            "pagePath": "../../pages/bi/bi",
            "text": "BI",
            "iconPath": "../assets/images/shuju.png",
            "selectedIconPath": "../assets/images/shujuA.png"
          },
          {
              "pagePath": "../../pages/rankAndActive/rankAndActive",
              "text": "龙虎榜",
              "iconPath": "../assets/images/bangyanglveying.png",
              "selectedIconPath": "../assets/images/bangyanglveyingA@2x.png"
          },
          {
            "pagePath": "../../pages/mine/mine",
            "text": "我的",
            "iconPath": "../assets/images/mine@2x.png",
            "selectedIconPath": "../assets/images/mineA@2x.png"
        }],
          selected: 0
        })
      }
    
    }else if(Number(num)==1){
       //管理员
       this.setData({
        role_Id: 1
      })
      this.getTabBar().setData({
        selected: 1,
        list:[
          {
            "pagePath": "../../pages/taskAndCode/taskAndCode",
            "text": "代办",
            "iconPath": "../assets/images/task.png",
            "selectedIconPath": "../assets/images/taskA.png"
          },
          {
              "pagePath": "../../pages/bi/bi",
              "text": "BI",
              "iconPath": "../assets/images/shuju.png",
              "selectedIconPath": "../assets/images/shujuA.png"
          },
          {
            "pagePath": "../../pages/mine/mine",
            "text": "我的",
            "iconPath": "../assets/images/mine@2x.png",
            "selectedIconPath": "../assets/images/mineA@2x.png"
        }
        ]
      })
      this.getABi();
      this.getBBi();
    }else{
      return
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