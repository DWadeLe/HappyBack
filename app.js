const WXAPI = require('wxapi/main')
App({
  navigateToLogin: false,
  async onLaunch() {
    const that = this;
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showToast({
        title: '新版本升级中',
        icon: 'loading'
      })
      updateManager.applyUpdate()
    })
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function (res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading',
          duration: 2000
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    })
    //  获取系统参数设置
      // 使用callContainer前一定要init一下，全局执行一次即可
      wx.cloud.init()
      // 下面的请求可以在页面任意一处使用
      const result = await wx.cloud.callContainer({
        config: {
          env: 'prod-9gx95xhw056367cd', // 微信云托管的环境ID
        },
        path: '/user/list', // 填入业务自定义路径和参数，根目录，就是 / 
        method: 'GET', // 按照自己的业务开发，选择对应的方法
        header: {
          'X-WX-SERVICE': 'springboot-v0v7-007', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
        }
        // dataType:'text', // 默认不填是以JSON形式解析返回结果，若不想让SDK自己解析，可以填text
      })
      console.log(111,result)
    
  },
  /**
   * 设置监听器
   */
  setWatcher(_this) { // 接收index.js传过来的data对象和watch对象
    var data=_this.data;
    var watch=_this.watch
    Object.keys(watch).forEach(v => { // 将watch对象内的key遍历
      this.observe(_this,data, v, watch[v]); // 监听data内的v属性，传入watch内对应函数以调用
    })
  },
  /**
   * 监听属性 并执行监听函数
   */
  observe(_this,obj, key, watchFun) {
    var val = obj[key]; // 给该属性设默认值
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        watchFun(_this,value, val); // 赋值(set)时，调用对应函数
      },
      get: function () {
        return val;
      }
    })
  },
  goLoginPageTimeOut: function () {
    if (this.navigateToLogin) {
      return
    }
    wx.removeStorageSync('token')
    this.navigateToLogin = true
    setTimeout(function () {
      wx.navigateTo({
        url: "/pages/authorize/index"
      })
    }, 1000)
  },
  onShow(e) {
    this.globalData.launchOption = e
    // 保存邀请人
    if (e && e.query && e.query.inviter_id) {
      wx.setStorageSync('referrer', e.query.inviter_id)
    }
  },
  globalData: {
    isConnected: true,
    launchOption: undefined
  }
})