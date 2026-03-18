Page({
  data: {
    form: {
      name: '',
      phone: '',
      type: '',
      message: ''
    }
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '联系我们'
    });
  },

  submitForm() {
    wx.showLoading({
      title: '提交中...'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '提交成功',
        content: '感谢您的留言，我们会尽快联系您！',
        showCancel: false
      });

      this.setData({
        form: {
          name: '',
          phone: '',
          type: '',
          message: ''
        }
      });
    }, 1000);
  }
})
