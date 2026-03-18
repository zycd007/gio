Page({
  data: {
    coreItems: [
      { id: 1, icon: '🎨', name: '原创设计' },
      { id: 2, icon: '🔨', name: '精细施工' },
      { id: 3, icon: '📦', name: '全案软装' },
      { id: 4, icon: '🏭', name: '工厂直供' },
      { id: 5, icon: '🛒', name: '严选产品' },
      { id: 6, icon: '🏠', name: '私宅定制' }
    ],
    services: [
      '餐饮空间', '酒吧俱乐部', '娱乐空间', '办公空间',
      '酒店民宿', '服装买手店', '婚纱摄影', '医美空间',
      '展厅展览', '私宅设计'
    ],
    cities: [
      '成都', '上海', '南京', '武汉', '西安',
      '长沙', '广州', '佛山', '银川', '重庆'
    ],
    stats: [
      { num: '10+', label: '团队经验' },
      { num: '200+', label: '落地项目' },
      { num: '100%', label: '客户满意' }
    ]
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: 'GIO&SJ | 设计事务所'
    });
  }
})
