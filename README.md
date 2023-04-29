# 面馆小程序

## 推荐一个极好的餐饮点餐外卖的开源小程序

- [github地址](https://github.com/woniudiancang/bee)

- [码云地址](https://gitee.com/woniudiancang/bee)

#### 介绍
专为面馆打造的小程序，本项目是纯原生开发的小程序项目，没有使用第三方的开发框架，具有较高的研究学习价值。

本项目为专业的小程序项目，我们没有能力和计划为该项目配套开发接口及后台管理程序，为了更好的展示、演示本小程序的运行效果，本项目的 api接口及后台管理直接嫁接使用的 [api工厂](https://www.it120.cc/) 的免费云接口和云后台，在此先表示感谢！

本项目我们将会持续的维护下去，同时欢迎大家踊跃提交 ISSUE 或者加入进来一起开发和维护本项目！

#### 接口 & 后台声明

本项目为小程序商城纯前端项目，由于人力和精力所限，本项目并未有开发配套的后台系统，而是直接使用了 [api 工厂](https://www.it120.cc/) 提供的免费接口和后台，可以完全满足本项目的所有功能需求。

- [接口 SDK](https://github.com/gooking/apifm-wxapi)

- [免费后台](https://admin.it120.cc)

- [WeUI](https://github.com/Tencent/weui-wxss/)

#### 扫码体验
<img src="https://images.gitee.com/uploads/images/2020/0802/111712_a4250a24_44151.jpeg" width="200px">

### 其他优秀开源模板推荐
- [天使童装](https://github.com/EastWorld/wechat-app-mall) [码云镜像](https://gitee.com/javazj/wechat-app-mall)
- [天使童装（uni-app版本）](https://github.com/gooking/uni-app-mall) [码云镜像](https://gitee.com/javazj/uni-app-mall)
- [舔果果小铺（升级版）](https://github.com/gooking/TianguoguoXiaopu)
- [面馆风格小程序](https://gitee.com/javazj/noodle_shop_procedures)
- [AI名片](https://github.com/gooking/visitingCard)
- [仿海底捞订座排队 (uni-app)](https://github.com/gooking/dingzuopaidui) [码云镜像](https://gitee.com/javazj/dingzuopaidui)

## 联系作者

| 微信好友 | 支付宝好友 |
| :------: | :------: |
| <img src="https://images.gitee.com/uploads/images/2020/0802/111712_679c77a2_44151.jpeg" width="200px"> | <img src="https://images.gitee.com/uploads/images/2020/0802/111712_97c8269b_44151.jpeg" width="200px"> |

#### QQ交流群

973122103

#### 使用说明

1. [api工厂](https://www.it120.cc/) 右上角注册免费开通您的专属后台

    建议将上面扫码演示的小程序的测试数据一键克隆到你自己的后台，方便测试，调试完毕后，再在后台重新修改/发布数据
    
    > 登录后台，左侧菜单 “工厂设置” --> “数据克隆”， 选择 “将别人的数据克隆给我”，对方商户ID ，填写 13886 ，接口完成数据克隆

2. 设置小程序名称 mallName
   <img src="https://images.gitee.com/uploads/images/2020/0802/111712_f9610be1_44151.png">
3. 上传 banner 轮播图片
   <img src="https://images.gitee.com/uploads/images/2020/0802/111712_936d58d7_44151.png">
4. 设置小程序 appid 和 secret
   <img src="https://images.gitee.com/uploads/images/2020/0802/111713_2436e87e_44151.png">
5. 数据维护
   <img src="https://images.gitee.com/uploads/images/2020/0802/111713_d4921518_44151.png">

6. 修改本项目源码根目录下 config.js 文件， noodles 为您的专属域名
   
    ```javascript
    module.exports = {
      version: "0.0.1",
      note: '构建项目',
      subDomain: "noodles"
    }
    ```

    [《什么是专属域名？》](https://www.yuque.com/apifm/doc/qr6l4m)

7. [设置小程序合法服务器域名](https://www.yuque.com/apifm/doc/tvpou9)
   
8. 重启您的小程序开发工具，完成
   
#### 参与贡献

1. Fork 本仓库
2. 新建 Feat_xxx 分支
3. 提交代码
4. 新建 Pull Request


#### 版本计划

1. 「2019-04-13」 发布 0.0.1 版本，支持在线下单；联动打印机自动出单；