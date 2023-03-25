//周，日，月，日期筛选组件
Component({
  properties:{
    dateData:{
      type:Object
    }
  },
  data:{
    selectIdx:2,
    dateSelShow:false,
    selQuarter:"季度",
    showQuarterFlg:false,
    sDate:'开始日期',
    eDate:'结束日期',
    endT:'',
    startT:'',
    interval:0,
    timeType:1,
  },
  methods:{
    getSelect1(){
      this.setData({
        selectIdx:1,
        timeType: 1,  //1表示当天和昨天
        interval: 1,  //1表示昨天
        startT:'',
        endT:''
      })
      this.data.dateData.startT = "";
      this.data.dateData.endT = "";
      this.data.dateData.echartFlg = true;
      this.data.dateData.interval = 1;
      this.data.dateData.timeType = 1;
      this.triggerEvent('itemChange',this.data.dateData)
    },
    getSelect2(){
      this.setData({
        selectIdx:2,
        timeType: 1,  //1表示当天和昨天
        interval: 0,//0表示今天
        startT:'',
        endT:''
      })
      this.data.dateData.startT = "";
      this.data.dateData.endT = "";
      this.data.dateData.echartFlg = true;
      this.data.dateData.interval = 0;
      this.data.dateData.timeType = 1;
      this.triggerEvent('itemChange',this.data.dateData)
    },
    getSelect3(){
      this.setData({
        selectIdx:3,
        timeType: 2,  //1表示月
        interval: 0, //0表示本月
        startT:'',
        endT:''
      })
      this.data.dateData.startT = "";
      this.data.dateData.endT = "";
      this.data.dateData.echartFlg = true;
      this.data.dateData.interval = 0;
      this.data.dateData.timeType = 2;
      this.triggerEvent('itemChange',this.data.dateData)
    },
    getSelect4(){
      this.setData({
        selectIdx: 4,
        timeType: 2,  //1表示月
        interval: 1, //0表示本月
        startT:'',
        endT:''
      })
      this.data.dateData.startT = "";
      this.data.dateData.endT = "";
      this.data.dateData.echartFlg = true;
      this.data.dateData.interval = 1;
      this.data.dateData.timeType = 2;
      this.triggerEvent('itemChange',this.data.dateData)
    },
    //筛选日期时，所有echart图表都隐藏
    getDateSelect(){
      this.setData({
        dateSelShow:true
      })
      this.data.dateData.echartFlg = false;
      this.triggerEvent('itemChange',this.data.dateData)
    },
    onCloseDate(){
      this.setData({
        dateSelShow:false,
        sDate:'开始日期',
        eDate:'结束日期'
      })
      this.data.dateData.echartFlg = true;
      this.triggerEvent('itemChange',this.data.dateData)
    },
    showQuarter(){
      this.setData({
        showQuarterFlg:true
      })
      // this.data.dateData.echartFlg = true;
      // this.triggerEvent('itemChange',this.data.dateData)
    },
    getQuarterIndex(e){
      let qIdx = e.currentTarget.dataset.qidx;
      let qName = qIdx==1?'第一季度':qIdx==2?'第二季度':qIdx==3?'第三季度':'第四季度';
      this.setData({
        showQuarterFlg: false,
        selQuarter:qName,
        dateSelShow:false,
        interval:Number(qIdx),
        timeType:4  //第几季度
      })
      this.data.dateData.startT = "";
      this.data.dateData.endT = "";
      this.data.dateData.interval = Number(qIdx);
      this.data.dateData.timeType = 4;
      this.data.dateData.echartFlg = true;
      this.triggerEvent('itemChange',this.data.dateData)
    },
    getWeekData(){
      this.setData({
        dateSelShow:false,
        timeType:3,
        interval:7
      })
      this.data.dateData.startT = "";
      this.data.dateData.endT = "";
      this.data.dateData.interval = 7;
      this.data.dateData.timeType = 3;
      this.data.dateData.echartFlg = true;
      this.triggerEvent('itemChange',this.data.dateData)
    },
    bindsDateChange: function(e) {
      this.setData({
        sDate: e.detail.value,
        startT: `${e.detail.value} 00:00:00`,
        timeType:5,
      })
    },
    //最后一个日期选择完毕则发送数据
    bindeDateChange: function(e) {
      this.setData({
        eDate: e.detail.value,
        dateSelShow:false,
        endT:`${e.detail.value} 23:59:59`,
        timeType:5,
        sDate:'开始日期',
        eDate:'结束日期'
      })
      this.data.dateData.timeType = 5;
      this.data.dateData.interval = "";
      this.data.dateData.startT = this.data.startT;
      this.data.dateData.endT = this.data.endT;
      this.data.dateData.echartFlg = true;
      this.triggerEvent('itemChange',this.data.dateData)
    },
  }
  
})
