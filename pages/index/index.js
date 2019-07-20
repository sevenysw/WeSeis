//index.js
//获取应用实例
import { translate} from '../../utils/api.js'
import { recognize_seis } from '../../utils/api_rec.js'
Page({
  data: {
    query: '',   //输入文字
    hideClearIcon: true,   //close icon显现状态
    result: '',   //译文结果
    curLang: {
      chs: '中文',
      lang: 'zh',
      index: 0},   //当前语言
    mode: 'scaleToFill',
    src: '/pics/seis.png',
    src_pre: '/pics/seis.png', 
    src_post: '/pics/seis.png',
    rec_result: '',
    info: '去随机噪声：采用DnCNN方法',
    multiArray: [['数据处理', '基本变换','人工智能'], ['去随机噪声','去多次波','去面波', '重构', '提取初至']],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '数据处理'
        },
        {
          id: 1,
          name: '基本变换'
        },
        {
          id: 2,
          name: '人工智能'
        },
        {
          id: 0,
          name: '去随机噪声'
        },
        {
          id: 1,
          name: '去多次波'
        },
        {
          id: 2,
          name: '去面波'
        },
        {
          id: 3,
          name: '重构'
        },
        {
          id: 4,
          name: '提取初至'
        }
      ]
    ],
    multiIndex: [0, 0],

  },
  onLoad: function () {

  },
  onShow: function () {

  },


  bindMultiPickerChange: function (e) {
    console.log('Multipicker发送选择改变，携带值为', e.detail.value)
    switch (e.detail.value[0]){
      case 0:
        switch(e.detail.value[1]){
          case 0:
            this.setData({ info: '去随机噪声：采用DnCNN方法' }); break;
          case 1:
            this.setData({ info: '去多次被：采用DnCNN方法' }); break;
          case 2:
            this.setData({ info: '去面波：采用DnCNN方法' }); break;
          case 3:
            this.setData({ info: '重构：采用DnCNN方法' }); break;
          case 4:
            this.setData({ info: '提取初至：采用DnCNN方法' }); break;

        }
        break;
      case 1:
        switch (e.detail.value[1]) {
          case 0:
            this.setData({ info: '傅里叶变换' }); break;
          case 1:
            this.setData({ info: '小波变换，采用bio1.3小波，二阶分解' }); break;
          case 2:
            this.setData({ info: '时频分析，提取中间道数据进行分析' }); break;
          case 3:
            this.setData({ info: '曲波变换' }); break;

        }
        break;
      case 2:
        switch (e.detail.value[1]) {
          case 0:
            this.setData({ info: '将图片进行Mosaic风格转换' }); break;
          case 1:
            this.setData({ info: '将图片进行Dream风格转换，采用vgg16网络' }); break;
          case 2:
            this.setData({ info: '检测脸部的关键点' }); break;
          case 3:
            this.setData({ info: '物体识别，FasterRCNN' }); break;
          case 4:
            this.setData({ info: '人脸生成，StyleGAN' }); break;
        }
        break;
    }
    this.setData({
      multiIndex: e.detail.value,
    })
  },

  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    if (e.detail.column==0){
      this.data.multiIndex[1] = 0
    }
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;

    switch (data.multiIndex[0]) {
      case 0:
        data.multiArray[1] = ['去随机噪声', '去多次波', '去面波', '重构', '提取初至'];
        break;
      case 1:
        data.multiArray[1] = ['傅里叶变换', '小波变换', '时频分析','曲波变换'];
        break;
      case 2:
        data.multiArray[1] = ['Mosaic风格', 'Dream风格', '人脸检测', '物体识别','人脸生成'];
        break;
    }
    this.setData(data);
  },

  bindblur(e) {
    this.setData({
      query: e.detail.value
    })
  },
  onInput: function (e) {
  },


  onRecognize_Seis: function () {
    recognize_seis(this.data.src_pre,this.data.multiIndex).then(res => {
      if (res.flag == 1) { this.setData({ src: res.img_path, src_post: res.img_path })}
      else {
        wx.showToast({
          title: '功能开发中',
          icon: 'info',
          duration: 2000
        })
      }
    })
  },

  onChange: function () {
    this.setData({ src: this.data.src_pre })
  },

  onChange_inv: function () {
    this.setData({ src: this.data.src_post })
  },

  onMove: function (event) {
    // 结果由原始数据（左）和处理后数据（右）组成，手指处为分界线
    console.log(event.touches[0].pageX)
  },

  onSave_Seis: function (){
    console.log(this.data.src_post)
    wx.getImageInfo({
      src: this.data.src_post,
      success: function (ret) {
        var path = ret.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(result) {
            wx.showToast({
              title: '图片保存成功',
              icon: 'info',
              duration: 2000
            })
          }
        })
      }
    })

  },

  onSelect: function () {
    var _this = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        _this.setData({
          src: res.tempFilePaths[0],
          src_pre: res.tempFilePaths[0],
          src_post: res.tempFilePaths[0],
        })
      }
    })
  }

})
