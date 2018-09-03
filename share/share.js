//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    appInfo: {
      secret: 'e305d3d5cd8c18caf11efdfc961f7dc9',
      appId: 'wxdd0a61f2ff479b5e',
      accessToken: '',
      qcode:''
    },
    painting: {},
    shareImage: ''
  },

  onLoad: function () {
    //this.getAccessToken()
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onShow:function(e){
    //this.eventDraw()
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //转发当前页
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return {
      title: '王的凝视',
      path: '/page/share?id=haozi',
      imageUrl: '../../static/img/pic.jpeg'

    }
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  //生成小程序码
  generateQcode: function () {
    wx.request({
      url: 'https://api.weixin.qq.com/wxa/getwxacode?access_token=13_8ShNL657MVs1o3d-0wx_5g5y6ZSECOZVxAUTiFdVurrIVXUANd1Ilr5byr-m3YSqQ-oWbiZEU6nEwdFoDHPOeVHl4eOWNUNmBvfO3pXqCkkgQ2T8j3TIBQ7mH6Wy8maZQbgVKg6v0Ji7hHXpQIKdADAIAC',
      data:{
        'path':'/'
      },
      method:'POST',
      success:res => {
        var appInfo = this.data.appInfo;
        var base64 = wx.arrayBufferToBase64(res.data)
        console.log(base64+"ddd")
        appInfo.qcode = "data:image/png;base64,"+ base64
        this.setData({
          appInfo :appInfo
        })
      }
    })
  },


  //获取access toke
  getAccessToken: function () {
    var accessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + this.data.appInfo.appId + '&secret=' + this.data.appInfo.secret
    wx.request({
      url: accessTokenUrl,
      success: res => {
        //console.log(res.data.access_token)
        var appInfo = this.data.appInfo;
        appInfo.accessToken = res.data.access_token;
        this.setData({
          appInfo: appInfo
        })
      },
      fail: function () {

      }
    })
    //console.log(this.data.appInfo)
  },

  eventDraw() {
    wx.showLoading({
      title: '绘制分享图片中',
      mask: true
    })
    this.setData({
      painting: {
        width: 375,
        height: 555,
        clear: true,
        views: [
          {
            type: 'rect',
            background:'#FFFFFF',
            top: 0,
            left: 0,
            width: 375,
            height: 495
          },
          {
            type: 'image',
            url: '../../static/img/pic.jpeg',
            top: 0,
            left:0,
            width: 375,
            height: 343
          },
          {
            type: 'image',
            url: this.data.userInfo.avatarUrl,
            top: 320,
            left: 20,
            width: 70,
            height: 70,
            borderRadius:70
          },
          {
            type: 'text',
            content: this.data.userInfo.nickName,
            fontSize: 16,
            color: '#402D16',
            textAlign: 'left',
            top: 360,
            left: 100
          },
          {
            type: 'text',
            content: '邀请参与抽奖',
            fontSize: 16,
            color: '#000000',
            textAlign: 'left',
            top: 400,
            left: 20
          },
          {
            type: 'text',
            content: '#邀请参与抽奖邀请参#',
            fontSize: 16,
            color: '#000000',
            textAlign: 'left',
            top: 430,
            left: 20
          },
          {
            type: 'image',
            url: '../../static/img/wxacode.jpeg',
            top: 350,
            left: 230,
            width: 120,
            height: 120
          },
          {
            type: 'text',
            content: '微信小程序',
            fontSize: 14,
            color: '#C8C8C8',
            textAlign: 'left',
            top: 470,
            left: 20
          },
          {
            type: 'text',
            content: '长按或扫码一起参与',
            fontSize: 14,
            color: '#C8C8C8',
            textAlign: 'left',
            top: 470,
            left: 230
          }
        ]
      }
    })
  },
  eventSave() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImage,
      success(res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },
  eventGetImage(event) {
    console.log(event)
    wx.hideLoading()
    const { tempFilePath, errMsg } = event.detail
    if (errMsg === 'canvasdrawer:ok') {
      this.setData({
        shareImage: tempFilePath
      })
    }
  }

})
