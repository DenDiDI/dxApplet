import request from '../../utils/require'
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    role_Id:'',
    inputList:[""],
    s_result:"",
    s_result_show:false,
    s_code_len:0,
    t:null,
    loadingFlg:false,
  },
  //扫码
  scanShop(e){
    let inputIndex = e.currentTarget.dataset.id;
    let arr = this.data.inputList;
    var that = this;
    console.log(e)
    wx.scanCode({ //扫描API
      onlyFromCamera:false,
      scanType:['barCode'],
      success(res) { //扫描成功
        console.log(res)
        //1、防窜码格式正确
        if(res.result){ 
          if(res.result.indexOf("69")==0){
            wx.showToast({
              icon: 'none',
              title: "扫错了，请扫防窜码",
              duration: 1000
            })
            return;
          }
          if(res.result.length!=12)return;
          if(res.result.indexOf(".")>-1)return;
          //2、防窜码不能重复
          let obj =  arr.find((item)=>{
            return item==res.result
          })
         
          if(obj){
            wx.showModal({
              title: '',
              content: '防窜码已存在，请勿重复扫码！',
              showCancel:false,
              complete: (res) => {
              }
            })
          }else{
            //判断防窜码的状态
            arr.splice(inputIndex,1,res.result);
            that.setData({
              inputList:arr
            })
            that.getSCodeStatus(res.result);
          }     
        }else{
          wx.showModal({
            title: '',
            content: '识别错误，请重新扫码！',
            showCancel:false,
            complete: (res) => {
            }
          })
        }
      },
      fail(err){
        wx.showToast({
          title: '扫码失败！',
          icon:'error',
          duration: 1000
        })
      }
    })
    
  },
  getSCodeStatus(code){
    let data = {
      "anticode": code
    }
    request({
      url: '/delegate/salebill/scanCheck',
      method:'post',
      data:data
    }).then((res)=>{
      console.log(res);
      if(res.data.code==200&&res.data.message=="success"){
      }else{
        wx.showToast({
          icon: 'none',
          title: res.data.message,
          duration: 3000
        })
      }

    }).catch((err)=>{
      console.log(err)
    })  
  },
  //输入监听
  getInp(e){
    let index = e.target.dataset.id;
    let arr = this.data.inputList;
    //替换原来的值
    arr.splice(index,1,e.detail.value)
    this.setData({
      inputList:arr
    })
  },
  //失去焦点
  getBlur(e){
  
    if(e.detail.value!=""){
      this.getSCodeStatus(e.detail.value);
    }
  },
  //扫码
  addScanShop(){
    let arr = this.data.inputList;
    if(arr.length==this.data.s_code_len){
      wx.showModal({
        title: '',
        content: '本次提交防窜码数量已达上限',
        showCancel:false,
        complete: (res) => {
          if(res.confirm){
            return;
          }
          if(res.cancel){
            return;
          }
        }
      })
      return;
    }

      arr.push("");
      this.setData({
        inputList:arr
      })
  
  },
  delCode(e){
    let indexId = e.target.dataset.id;
    let arr = this.data.inputList;
    if(this.data.inputList.length==1){
      wx.showToast({
        title: '最后一个不能删啦！',
        icon: 'none',
        duration: 2000
      })
      return;
    }else{
      if(arr[indexId]==''){
        arr.splice(indexId,1);
          this.setData({
            inputList: arr
          })
          return;
      }
      wx.showModal({
        title: '',
        content: '确定删除此防窜码？',
        complete: (res) => {
          if(res.confirm){
            arr.splice(indexId,1);
            this.setData({
             inputList: arr
            })
            return;
          }
          if(res.cancel){
            return;
          }
        }
      })
     
    }
  },
  checkIsEmpty(){
    let dataArr = this.data.inputList;
    if(dataArr.length==0){
      wx.showModal({
        title: '',
        content: '未输入防窜码',
        showCancel:false,
        complete: (res) => {
        }
      })
      return false;
    }
  let flg = true
  dataArr.forEach((item)=>{
    if(item==""){
      flg = false
      return;
    }
  })
  if(flg){
    return true;
  }else{
    wx.showModal({
      title: '',
      content: "防窜码不能为空!",
      showCancel:false,
      complete: (res) => {
       return;
      }
    })
    return false;
  }
  },
  submit(){
    let dataArr = this.data.inputList;
    let data = []
    let flg = this.checkIsEmpty();
    console.log(flg)
    if(!flg)return;
    dataArr.forEach((item)=>{
        let obj = {
          "anticode":item
        }
        data.push(obj)
       
      })
    
    if(data.length!==dataArr.length)return;
    let t = this.data.t;
    if(t){
      clearTimeout(t);
      t = null;
      this.setData({
        t:t
      })
    }
    this.setData({
      loadingFlg:true,
    })
    t = setTimeout(()=>{
   
    request({
      url: '/delegate/salebill/scanCodeSettlement',
      method:'post',
      data:data
    }).then((res)=>{
      console.log(res);

      this.setData({
        loadingFlg:false
      })
      if(res.data.code==200&&res.data.message=="success"){
          wx.showToast({
            icon: 'success',
            title: '提交成功！',
            duration: 1000
          })
          let arr = [""];
          //提交成功之后清空页面
          this.setData({
            inputList: arr
          })
             
        return;
      }else{
    
        let arr = [""];
        //提交成功之后清空页面
        this.setData({
          inputList: arr,
          loadingFlg:false
        })
      }
      this.setData({
        s_result_show:true,
        s_result:res.data.message
      })
      setTimeout(()=>{
        this.setData({
          s_result_show:false,
          s_result:""
        })
      },3000)
   
    }).catch((err)=>{
      this.setData({
        loadingFlg:false
      })
      console.log(err)
    })
  },1000)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  toMsg(){
    wx.navigateTo({
      url: '/subPackageMessage/pages/admin/message/message',
    })
  },
  toAudit(){
    wx.navigateTo({
      url: '/subPackageAudit/pages/admin/audit/audit',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  //获取导购员扫码长度
  getScanCodeLen(){
    request({
      url: '/delegate/activityConfig/select',
      method:'get'
    }).then((res)=>{
      if(res.data.code==200&&res.data.message=="success"){
        this.setData({
          s_code_len:res.data.data.everytimeAnticodeCommitNum
        })
      }

    }).catch((err)=>{
      console.log(err)
    })
  },
  getCodeByBillIds(idArr){
    this.setData({
      inputList:[""]
    })
    app.globalData.billIds = [];
    request({
      url: '/delegate/salebill/settlementScanGoodsbaseList',
      method:'post',
      data: idArr
    }).then((res)=>{
      console.log(res);
      if(res.data.code==200&&res.data.message=="success"){
        let data = res.data.data;
        let arr = [];
          data.forEach((item)=>{
            arr.push(item.antiCodes)
          })
          this.setData({
            inputList:arr
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
   * 生命周期函数--监听页面显示
   */
  onShow() {
  
    let num = wx.getStorageSync('roleId');
    // let num = 3;
    //导购员 1
    if(Number(num)==3){
      this.getTabBar().setData({
        selected: 1,
        backgroundColor:'#fff',
        list:[
          {
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
        }
        ]
      })
      wx.setNavigationBarColor({
        frontColor:"#000000",
        backgroundColor:"#FFFFFF"
      })
      this.setData({
        role_Id: 3
      })
      wx.setNavigationBarTitle({
        title: "扫码"
      })
      //获取窜货码长传次数限制
      this.getScanCodeLen();
    
  
      if(app.globalData.billIds.length!=0){
        console.log(app.globalData.billIds.length)
        this.getCodeByBillIds(app.globalData.billIds)
      }
       
      
    }else if(Number(num)==1){
      //管理员 0
      this.getTabBar().setData({
        selected: 0,
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
      this.setData({
        role_Id: 1
      })
      wx.setNavigationBarTitle({
        title: "代办",
      })
   
    }else{
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