//自定义菜单栏组件
Component({
    data: {
        selected: 0,
        color: "#C2C7CC",
        roleId: '',
        selectedColor: "#007BFF",
        backgroundColor: "#1D1E25",
        allList: [{
            //导购员
            list1: [
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
            ],
            //业务员
            list2: [
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
            ],
            //管理员
            list3: [
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
        
        }],
        list: []
    },

    attached() {
      let roleId = wx.getStorageSync('roleId');
      if (roleId== 3) {
        this.setData({
          list: this.data.allList[0].list1
        })
        return;
      } 
      if (roleId == 2) {
        this.setData({
          list: this.data.allList[0].list2
        })
        return;
      }
      if(roleId ==1){
        this.setData({
            list: this.data.allList[0].list3
        })
        return;
      }
    },
    methods: {
      switchTab(e) {
        const data = e.currentTarget.dataset;
        const url = data.path
        wx.switchTab({
          url: url,
        })

      }
    },
})
  
