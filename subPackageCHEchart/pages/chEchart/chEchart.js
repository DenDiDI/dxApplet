import request from '../../../utils/require'
import {
  _getGoodsCuanHuoByShopId,               
  _getShopGoodsFleeingCount,
  _getShopList
} from '../../../utils/getData'
import { initLineChartCommon } from '../../../utils/mychart'
import * as echarts from '../../../ec-canvas/echarts.min.js'

//柱状图
function getOption2(list,value){
  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    // color:['#47B3FC','#50DAAE'],
    grid: {
      left: '3%',
      top: '4%',
      right: '10%',
      bottom: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      splitLine: {
        show: true,
        lineStyle: {
         color: ['#999999']
        }
      },
      axisLine: {
        show: true
      },
    },
    yAxis: {
      type: 'category',
      axisTick:{
        show:false
      },
      data: list
    },
    series: [
      {
        barWidth: '16',
        type: 'bar',
        label : {
          normal : {
            show : true,//显示数字
            position : 'right',
            color: '#fff'
          }
        },
        itemStyle: {
          barBorderRadius:[0, 25, 25, 0],
          color:new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
            offset: 0,
            color: 'rgba(78, 213, 175, 1)'
              }, {
                offset: 1,
                color: 'rgba(93, 253, 168, 1)'
          }]),
        },
        data: value
      }
    ]
  };
}

//柱状图初始化
function initChart2(chart,title,list,value1,value2) {
  var option = getOption2(title,list,value1,value2)
  chart.setOption(option);
  return chart;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dateData:{
      interval: 0,
      startT: "",
      endT:"",
      timeType: 1,
      echartFlg:true //所有图表默认显示
    },
    endT: "",
    id: 0,
    inpShopValue:'',
    showShop:false,
    selShopTxt:'全部门店',
    chartFlg:true,
    chartData:[],
    allShopData:[],
    searchData:[],
	  interval: 0,
	  startT: "",
    timeType: 1,
    selectIdx:2,
    echart1Show:true,
    echart2Show:true,
    chEchart1X:[],//趋势图测试数据
    chEchart1Y:[],  //趋势图测试数据
    chEchart1List: [],
    chEchart1Value: [],
    chEchart2Y:[],  //趋势图测试数据
    ec1: {
      lazyLoad:true
    },
    show:false,
    shopSelectList: [], //门店选择列表
    shopSelectId: 0,//门店选择
  },
   //折线图
  init_chart1:function(list,value){
    let Component = this.selectComponent('#ch-echart1') 
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
   //柱状图
   init_chart2:function(list,value){
    let Component = this.selectComponent('#ch-echart2') 
      Component.init((canvas,width,height,dpr)=> { 
        const chart= echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio:dpr
      });
        initChart2(chart,list,value)
        return chart;
      })
  },
 //日期选择器的关闭按钮
 onClose(){
  this.setData({
    show: false
  })
  }, 
  formatDate(date) {
  date = new Date(date);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },
  handleDateChange(e){
    this.setData({
      endT: e.detail.endT,
      interval: e.detail.interval,
      startT: e.detail.startT,
      echart1Show: e.detail.echartFlg,
      timeType: e.detail.timeType
    })
    if(e.detail.echartFlg){
      this.getEchart1()
    }
    this.getEchart2()
  },
  getSelectVal(e){
    let id = e.target.dataset.id;
    let val = this.data.searchData.find((item)=>{
      return item.shopId == id
    });
  
    this.setData({
      selShopTxt:val.shopName,
      showShop:false,
      inpShopValue:'',
      echart1Show:true,
      shopSelectId:id,
      searchData:this.data.allShopData
    })
    this.getEchart1()
  },
 
  getSearchList(e){
    let key = e.detail;
    console.log(key)
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
  //获取门店数据
  getShopList(){
    _getShopList((res)=>{
      if(res.length==0){
        return;
      }
      let data = res;
      let fobj = {
        shopName:"全部门店",
        shopId: 0
      }
      data.unshift(fobj)
      this.setData({
        allShopData:data,
        searchData:data
      })
      this.getEchart1()
    })
  },
  closePopup(){
    this.setData({
      showShop:false,
      echart1Show:true
    })
    this.getEchart1()
  },


  //选择门店修改了
  showPopup(){
    this.setData({ showShop: true,echart1Show:false })
  },
  //获取折线图 门店窜货数量趋势
  getEchart1(){
    let data = {
      "id": this.data.shopSelectId
    }
    
    this.setData({
      chEchart1List:[],
      chEchart1Value:[]
    })
    _getGoodsCuanHuoByShopId(data,(res)=>{
      let data = res;
      if(data.length==0){
        this.setData({
          echart1Show:false
        })
        return;
      }
      let chEchart1X = [];
      let chEchart1Y = [];
      data.forEach((item)=>{
        chEchart1X.push(item.zpmonth);
        chEchart1Y.push(item.zpcount);
      })
      this.setData({
        echart1Show:true,
        chEchart1List: chEchart1X,
        chEchart1Value: chEchart1Y
      })
      this.init_chart1(this.data.chEchart1List,this.data.chEchart1Value);
    },()=>{
      this.setData({
        echart1Show:false
      })
    })
  },
  //获取柱状图
  getEchart2(){
    let data = {
      "endT": this.data.endT,
	    "id":wx.getStorageSync('loginMsg').userId,
	    "interval": this.data.interval,
	    "startT": this.data.startT,
	    "timeType": this.data.timeType
    }
    _getShopGoodsFleeingCount(data,(res)=>{
      let data = res;
      if(data.length==0){
        this.setData({
          echart2Show:false
        })
        return;
      }
    
      let maxNum = 0;
      data.forEach((item)=>{
        maxNum = maxNum>item.salescount?maxNum:item.salescount
      })
      let n = []
      data.forEach((item)=>{
       let obj = {
         name: item.shopName,
         num: item.salescount/maxNum*100+'%',
         dataNum:item.salescount
       }
       n.push(obj)
     })
     console.log(n)
      this.setData({
        chartData:n,
        chartFlg:true,
      })
    },()=>{
      this.setData({
        echart2Show:false
      })
      wx.showToast({
        title: res.data.message,
        icon:'none',
        duration:3000
      })
    })

   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.getEchart1();
    // this.getEchart2();
    // this.init_chart1(this.data.chEchart1X,this.data.chEchart1Y);
    // this.init_chart2(this.data.chEchart2X,this.data.chEchart2Y);
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
    this.getShopList();
    this.getEchart2();
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