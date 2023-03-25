import { baseUrl } from '../../utils/config'
import request from '../../utils/require'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role_Id:"",
    s_activity_list:[],
    b_rankTypeShow:false,
    b_rankTypeArr: ['导购员人数排名', '门店总数排名', '扫码商品总数排名', '疑似窜货总数排名', '红包领取总金额排名'],
    b_rankDataArr:[],
    b_rankNoTopArr:[],
    b_rankNoMoreData:false,
    selectIdx:2,
    rankId:0,
  },
  getSelect1(){
    this.setData({
      selectIdx:1
    })
    this.b_getRankData(this.data.rankId);
  },
  getSelect2(){
    this.setData({
      selectIdx:2
    })
    this.b_getRankData(this.data.rankId);
  },
  getSelect3(){
    this.setData({
      selectIdx:3
    })
    this.b_getRankData(this.data.rankId);
  },
  // 导购员 获取活动详情
  s_getActiveDetail(e){
    let goodsId = e.currentTarget.dataset.id;
    console.log(goodsId)
    wx.navigateTo({
      url: '/subPackageGoodsDetail/pages/sales/goodsDetail/goodsDetail?id='+ encodeURIComponent(goodsId)
    })
  },



  //业务员 选择排名类型按钮
  b_showRankType(){
    this.setData({
      b_rankTypeShow: true
    })
  },
  //业务员 选择排行类型
  onChange(event) {
    const { picker, value, index } = event.detail;
    console.log(picker, value, index)
  },
   //业务员选择排行类型
  b_getRankType(e){
    console.log(e.target.id);
    let index = e.target.id;
    this.setData({
      b_rankTypeShow: false,
      rankId:index
    })
    let selectType = this.data.b_rankTypeArr[index]; 
    console.log(selectType)
    wx.setNavigationBarTitle({
      title: selectType,
    })
    this.b_getRankData(index);
  },
  //获取龙虎榜的数据
  b_getRankData(index){
    this.setData({
      b_rankDataArr:[],
      b_rankNoTopArr:[]
    })
    let url = "";
    if(Number(index) == 0){
      //调用导购员人数接口接口
      url = "/delegate/appBusinessManager/saleCountList"
    }else if(Number(index) == 1){
      //门店总数
      url = "/delegate/appBusinessManager/shopCountList"
    }else if(Number(index) == 2){
      //扫码商品总数
      url = "/delegate/appBusinessManager/scanGoodsbaseCountList"
    }else if(Number(index) == 3){
      //疑似窜货总数
      url = "/delegate/appBusinessManager/bmGoodsFleeingCountList"
    }else if(Number(index) == 4){
      //红包领取总金额
      url = "/delegate/appBusinessManager/rewardTotalList"
    }else{
      return;
    }
    let selectType = this.data.selectIdx;
    request({
      url: url,
      method:'post',
      data:{
        "tunit": Number(selectType)
      }
    }).then((res)=>{
      let data = res.data.data;
      if(data.length == 0){
        this.setData({
          b_rankDataArr:[],
          b_rankNoTopArr:[]
        })
      };
      if(data.length < 3 || data.length == 3){
        this.setData({
          b_rankDataArr: data,
          // b_rankNoMoreData: true,
          b_rankNoTopArr:[]
        })

      }
      this.setData({
        b_rankDataArr:data.slice(0,3),
        b_rankNoTopArr: data.slice(3),
        // b_rankNoMoreData: false
      })
      console.log(this.data.b_rankDataArr,this.data.b_rankNoTopArr)
    }).catch((err)=>{
      console.log(err)
    })
  },
  b_getRankTypeCancel(){
    this.setData({
      b_rankTypeShow: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  getActiveGoods(){
    let loginMsg = wx.getStorageSync('loginMsg');
    request({
      url:'/delegate/activity/list',
      method:'get'
    }).then((res)=>{
      console.log("活动列表",res);
      let data = res.data.data;
      if(data.length==0)return;
      let nlist = [];
      data.forEach((item)=>{
        item.picUrl = `${baseUrl}/${loginMsg.ip}:${loginMsg.port}/${item.picUrl}`
        nlist.push(item)
      })
      this.setData({
        s_activity_list:nlist
      })
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
    if(Number(num)==3){
      this.getActiveGoods()
      this.getTabBar().setData({
        selected: 2,
        backgroundColor:'#fff',
        list:[  {
          "pagePath": "../../pages/home/home",
          "text": "首页",
          "iconPath": "../assets/images/shouye.png",
          "selectedIconPath": "../assets/images/shouyeA@2x.png"
      },
      {
          "pagePath": "../../pages/taskAndCode/taskAndCode",
          "text": "扫码",
          "iconPath": "../assets/images/saomasoudan.png",
          "selectedIconPath": "../assets/images/saomasoudanA.png"
      },
      {
        "pagePath": "../../pages/rankAndActive/rankAndActive",
        "text": "活动",
        "iconPath": "../assets/images/huodong.png",
        "selectedIconPath": "../assets/images/huodongA@2x.png"
      },
      {
        "pagePath": "../../pages/mine/mine",
        "text": "我的",
        "iconPath": "../assets/images/mine@2x.png",
        "selectedIconPath": "../assets/images/mineA@2x.png"
      }]
      })
      //导购员的活动页
      this.setData({
        role_Id:3
      })
      wx.setNavigationBarTitle({
        title: "活动列表"
      })
      wx.setNavigationBarColor({
        frontColor:"#000000",
        backgroundColor:"#FFFFFF"
      })
      return;
    }
    if(num==2){
      this.b_getRankData(1);
      this.getTabBar().setData({
        selected: 1,
        backgroundColor:'#fff',
        list:[
          {
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
        }
        ]
      })
      //业务员的的龙虎榜
      this.setData({
        role_Id:2
      })
      wx.setNavigationBarTitle({
        title: "导购员人数排名",
      })
      return;
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