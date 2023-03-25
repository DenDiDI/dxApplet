import request from '../../../utils/require'
import * as echarts from '../../../ec-canvas/echarts.min.js'
import {_getShopList,_getGoodsScanNumByShopId,_getScanGoodsBaseSaleRadio,_getScanShopSaleRadio} from '../../../utils/getData'
import {initPieChartCommon } from '../../../utils/mychart.js'





Page({
  /**
   * 页面的初始数据
   */
  data: {
    // showQuarterFlg:false,
    shopFlg:false,
    goodsFlg:false,
    chartIndex:1,
    selectIdx:2, 
    show:false,
    dateData:{
      interval: 0,
      startT: "",
      endT:"",
      timeType: 1,
      echartFlg:true //所有图表默认显示
    },
    // endT: "",
    id: 0,
    wnum:"80%",
    interval: 0,
    startT: "",
    chartFlg1:true,
    chartData:[],
    pie2Show:true,
    timeType: 1,
    searchData:[],
    allShopData:[],
    inpShopValue:'',
    // selQuarter:"季度",
    hbList3:[],
    // ec1: {
    //   lazyLoad:true
    // },
    // ec2: {
    //   lazyLoad:true
    // },
    ec3: {
      lazyLoad:true
    },
    shopSeletId: 0,
    shopList:[],
    selShopTxt:'全部门店'
  },
  

  init_chart3:function(id,value){
    let Component = this.selectComponent(id) 
        Component.init((canvas,width,height,dpr)=> { 
        const chart= echarts.init(canvas, null, {
          width: width,
          height: height,
          devicePixelRatio:dpr
        });
        initPieChartCommon(chart,value)
        return chart;
      })
    },
    handleDateChange(e){
      this.setData({
        endT: e.detail.endT,
        interval: e.detail.interval,
        startT: e.detail.startT,
        pie2Show: e.detail.echartFlg,
        timeType: e.detail.timeType
      })
      if(e.detail.echartFlg){
        this.getPieEchartData()
      }
      this.getShopHongbaoEchartData()
    },
  showPopup() {
    this.setData({ show: true,pie2Show:false });
  },
  
  closeShow(){
    this.setData({
      show:false,
      pie2Show:true
    })
    this.getPieEchartData()
  },
 
  getSearchList(e){
    let key = e.detail;
    if(key==""){
      this.setData({
        searchData:this.data.allShopData
      })
      return;
    }
    console.log(this.data.allShopData)
    let arr = this.data.allShopData.filter((item)=>{
      return item.shopName.indexOf(key)>-1;
    })
    this.setData({
      searchData:arr
    })
  },
  //门店筛选获取零售额占比
  getSelectVal(e){
    let id = e.target.dataset.id;
    let val = this.data.searchData.find((item)=>{
      return item.shopId == id
    });
    this.setData({
      selShopTxt:val.shopName,
      shopSeletId:val.shopId,
      show:false,
      pie2Show:true,
      inpShopValue:'',
      searchData:this.data.allShopData
    })
    this.getPieEchartData()
  },
  //获取红包零售费用比
  getShopHongbaoEchartData(){
    let data = {
      "endT": this.data.endT,
	    "id": wx.getStorageSync('loginMsg').userId,
	    "interval": this.data.interval,
	    "startT": this.data.startT,
	    "timeType": this.data.timeType
    }
    _getScanShopSaleRadio(data,(res)=>{
      let data = res;
      if(data.length==0){
        this.setData({
          chartFlg1:false
        })
        return;
      }
      let maxNum = 0;
      data.forEach((item)=>{
        maxNum = maxNum>item.radio?maxNum:item.radio
      })
      let n  = []
      data.forEach((item)=>{
        let obj = {
          radio:(item.radio/maxNum)*100+'%',
          name:item.shopName,
          radioData:(item.radio*100).toFixed(1)+'%'
        }
        n.push(obj);
      })
      this.setData({
        chartData:n,
        chartFlg1:true
      })
    })
   
  },
  getChartSelShop(){
    this.setData({
      chartIndex:1
    })
    this.getShopHongbaoEchartData()
  },
  getChartSelGood(){
    this.setData({
      chartIndex:2
    })
    this.getGoodsHongbaoEchartData()
  },
  //商品零售比(柱状图)
  getGoodsHongbaoEchartData(){
    this.setData({
      chartData:[]
    })
    let data = {
      "endT": this.data.endT,
	    "id": wx.getStorageSync('loginMsg').userId,
	    "interval": this.data.interval,
	    "startT": this.data.startT,
	    "timeType": this.data.timeType
    }
    _getScanGoodsBaseSaleRadio(data,(res)=>{
      let data = res;
      if(data.length==0){
        this.setData({
          chartFlg1:false
        })
        return;
      }
      let maxNum = 0;
      data.forEach((item)=>{
        maxNum = maxNum>item.radio?maxNum:item.radio
      })
      let n  = []
      data.forEach((item,index)=>{
          let obj = {
            radio:(item.radio/maxNum)*100+'%',
            name:item.goodsbaseName,
            radioData:(item.radio*100).toFixed(1)+'%'
          }
          n.push(obj);
        
      })
      this.setData({
        chartData:n,
        chartFlg1:true
      })
    })
   
  },
   //获取商品零售额统计
   getPieEchartData(){
     this.setData({
      hbList3:[]
     })
    let data = {
      "endT": this.data.endT,
	    "id": this.data.shopSeletId,
	    "interval": this.data.interval,
	    "startT": this.data.startT,
	    "timeType": this.data.timeType
    }
    _getGoodsScanNumByShopId(data,(res)=>{
      let data = res;
      if(data.length==0){
        this.setData({
          pie2Show:false
        })
        return;
      }
      let pieList = []
      data.forEach((item,index)=>{
          let obj = {
            value: item.radio,
            name: item.goodsbaseName
          }
          pieList.push(obj);
      })
      this.setData({
        hbList3:pieList,
        pie2Show:true
      })
      console.log(this.data.hbList3)
      this.init_chart3("#hb-echart3",this.data.hbList3);
      
    })

  },
  //获取门店列表
  getShopData(){
    _getShopList((res)=>{
      if(res.length==0){
        return;
      }
      let data = res;
      let firstAll = {
        shopId:0,
        shopName:'全部门店'
      }
      data.unshift(firstAll);
      this.setData({
        allShopData:data,
        searchData:data
      })
        this.getPieEchartData()
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
  //1升序 2降序
  this.getShopHongbaoEchartData();
  this.getShopData();
  // this.getGoodsHongbaoEchartData()
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

  },
  onPageScroll: function(event) {
    let scroll = event.scrollTop; //当前的距离顶部的高度
    let scrollTop = this.data.scrollTop;  //记录的距离顶部的高度
    let height = this.data.menuHeight;  //菜单的高度
    let show = this.data.showMenu;  //菜单的显示状态
    //是否超过开始隐藏的高度
    if (scroll > height) {
      if ((scroll < scrollTop) == show) { //超过高度时的上滑或下滑状态一致时
        this.setData({
          scrollTop: scroll
        })
      } else { //超过高度时的上滑显示和下滑隐藏
        let anim = wx.createAnimation({
          timingFunction: 'ease-in-out',
          duration: 200,
          delay: 0
        })
        anim.translateY(scroll < scrollTop ? 0 : -height).step();
        this.setData({
          scrollTop: scroll,
          showMenu: scroll < scrollTop,
          menuAnim: anim.export()
        })
      }
    } else {
      //小于menuHeight并且隐藏时执行显示的动画
      if (!show) {
        let anim = wx.createAnimation({
          timingFunction: 'ease-in-out',
          duration: 200,
          delay: 0
        })
        anim.translateY(0).step();
        this.setData({
          scrollTop: scroll,
          showMenu: true,
          menuAnim: anim.export()
        })
      } else {
        this.setData({
          scrollTop: scroll
        })
      }
    }
  },
})