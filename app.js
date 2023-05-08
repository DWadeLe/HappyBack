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
      
     //自定义上面的导航栏
     // 获取系统信息
     const systemInfo = wx.getSystemInfoSync();
     // 胶囊按钮位置信息
     const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
     // 导航栏高度 = 状态栏高度 + 44
     that.globalData.navBarHeight = systemInfo.statusBarHeight + 44;
     that.globalData.menuRight = systemInfo.screenWidth - menuButtonInfo.right;
     that.globalData.menuTop= menuButtonInfo.top;
     that.globalData.menuHeight = menuButtonInfo.height;
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
    launchOption: undefined,
    navBarHeight: 0, // 导航栏高度
        menuRight: 0, // 胶囊距右方间距（方保持左、右间距一致）
        menuTop: 0, // 胶囊距顶部间距
        menuHeight: 0, // 胶囊高度（自定义内容可与胶囊高度保证一致）
  }
})