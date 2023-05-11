// 顶部导航栏组件的 JS 代码
const app = getApp()
import Toast from 'tdesign-miniprogram/toast/index';

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  properties: {
    title: {
      type: String,
      value: ''
    },
    scanVisible: {
      type: Boolean,
      value: false
    }
  },
  data: {
    statusBarHeight: 20, // 状态栏高度
    navBarHeight: app.globalData.navBarHeight,
    rightLeft: '',
    centerLeft: '',
    top: "",
    isCanBack: false,
  },
  lifetimes: {
    attached() {
      // 获取设备信息
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight;
      const screenWidth = systemInfo.screenWidth;
      //自定义上面的导航栏
      // 获取系统信息
      // 胶囊按钮位置信息
      const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
      // 导航栏高度 = 状态栏高度 + 44
      var menuRight = systemInfo.screenWidth - menuButtonInfo.right;
      var menuTop = menuButtonInfo.top;
      var top = menuButtonInfo.top;
      var menuHeight = menuButtonInfo.height;
      var navBarHeight = systemInfo.statusBarHeight + 44;
      var menuWidth = screenWidth - menuButtonInfo.width
      var needDelWidth = 16 * this.properties.title.length
      var centerLeft = (systemInfo.screenWidth - needDelWidth) / 2;
      var rightLeft = menuButtonInfo.left - 32;
      var rightWidth = menuButtonInfo.width;
      // 获取页面栈
      const pages = getCurrentPages();
      // 获取当前页面的索引
      const currentIndex = pages.length - 1;
      this.setData({
        menuRight,
        menuTop,
        menuHeight,
        navBarHeight,
        statusBarHeight,
        centerLeft,
        rightLeft,
        top,
        rightWidth,
        isCanBack: currentIndex > 0
      });
    }
  },
  methods: {
    scanCode() {
      // 扫一扫操作
      wx.scanCode({
        onlyFromCamera: false, // 是否只能从相机扫码，不允许从相册选择图片，默认是false
        success(res) {
          var result = res.result;
          Toast({
            context: this,
            selector: '#t-toast',
            message: "扫码成功",
            theme: 'success',
            direction: 'column',
          });
          wx.showLoading({
            title: '前往页面中',
          })
          setTimeout(() => {
            wx.hideLoading({
              success: (res) => {
                wx.navigateTo({
                  url: result
                })
              },
            })

          }, 500)

        },
        fail(res) {
        }
      })
    },
    back() {
      wx.navigateBack({
        delta: 1 // 返回上一个页面
      })
    }
  }
});
