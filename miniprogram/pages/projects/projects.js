Page({
  data: {
    showList: false,
    currentCategory: null,
    categories: [
      { id: 'residential', name: '私宅空间', en: 'Residence', icon: '🏠', progress: 80 },
      { id: 'restaurant', name: '餐饮空间', en: 'Restaurant', icon: '🍽️', progress: 70 },
      { id: 'entertainment', name: '娱乐空间', en: 'Entertainment', icon: '🎵', progress: 40 },
      { id: 'office', name: '办公空间', en: 'Office', icon: '💼', progress: 20 },
      { id: 'hotel', name: '酒店民宿', en: 'Hotel', icon: '🏨', progress: 60 },
      { id: 'wedding', name: '婚纱摄影', en: 'Wedding', icon: '📸', progress: 30 },
      { id: 'club', name: '酒吧俱乐部', en: 'Club', icon: '🍸', progress: 35 },
      { id: 'medical', name: '医美空间', en: 'Medical', icon: '💊', progress: 25 },
      { id: 'exhibition', name: '展厅展览', en: 'Exhibition', icon: '🖼️', progress: 45 },
      { id: 'clothing', name: '服装买手店', en: 'Clothing', icon: '👗', progress: 50 }
    ],
    projects: {
      residential: [
        { id: 1, name: '麓湖黑珍珠', location: '成都', year: '2025' },
        { id: 2, name: '麓湖项目', location: '成都', year: '2025' },
        { id: 3, name: '御府', location: '成都', year: '2025.08' },
        { id: 4, name: '现代风格私宅', location: '成都', year: '2025' },
        { id: 5, name: '新装饰主义', location: '成都', year: '2025' },
        { id: 6, name: '中州锦城', location: '成都', year: '2025' },
        { id: 7, name: '国际公寓', location: '成都', year: '2025' },
        { id: 8, name: '自然居所', location: '成都', year: '2025' },
        { id: 9, name: '极简私宅', location: '成都', year: '2025' },
        { id: 10, name: '轻奢雅宅', location: '成都', year: '2025.10' }
      ],
      restaurant: [
        { id: 1, name: '品牌餐厅', location: '成都', year: '2019.10' },
        { id: 2, name: '特色餐饮', location: '西安', year: '2021' },
        { id: 3, name: 'Date Bank', location: '成都', year: '2021.08' },
        { id: 4, name: '成都院子', location: '成都', year: '2022.01' },
        { id: 5, name: 'Foooo', location: '成都', year: '2023.08' }
      ],
      entertainment: [
        { id: 1, name: 'Aka 娱乐空间', location: '成都', year: '2022' },
        { id: 2, name: 'TIC 娱乐', location: '成都', year: '2022' },
        { id: 3, name: 'UMPLAY', location: '西安', year: '2022' }
      ],
      office: [
        { id: 1, name: '1807 办公室', location: '成都', year: '2022' },
        { id: 2, name: '设计师办公室', location: '成都', year: '2022' }
      ],
      hotel: [
        { id: 1, name: '围炉野宿', location: '上海', year: '2021.09' },
        { id: 2, name: '温泉酒店', location: '西安', year: '2022' },
        { id: 3, name: '精品酒店', location: '成都', year: '2022.01' }
      ],
      wedding: [
        { id: 1, name: 'XLPHOTO', location: '西安', year: '2021' },
        { id: 2, name: 'La Fibre', location: '西安', year: '2022.06' }
      ],
      club: [
        { id: 1, name: '酒庄俱乐部', location: '成都', year: '2022' },
        { id: 2, name: 'Hoormem', location: '成都', year: '2022' }
      ],
      medical: [
        { id: 1, name: '医美医院', location: '西安', year: '2023.05' },
        { id: 2, name: '皮肤管理', location: '成都', year: '2022.08' }
      ],
      exhibition: [
        { id: 1, name: 'GABO 展厅', location: '佛山', year: '2020' },
        { id: 2, name: 'OCM 展厅', location: '成都', year: '2021' }
      ],
      clothing: [
        { id: 1, name: 'AFGK', location: '成都', year: '2022' },
        { id: 2, name: 'HUG 买手店', location: '成都', year: '2022' },
        { id: 3, name: 'KVK 买手店', location: '成都', year: '2022' }
      ]
    }
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '案例作品'
    });
  },

  showCategory(e) {
    const categoryId = e.currentTarget.dataset.id;
    const category = this.data.categories.find(c => c.id === categoryId);
    const projects = this.data.projects[categoryId] || [];

    this.setData({
      showList: true,
      currentCategory: category,
      currentProjects: projects
    });
  },

  backToCategories() {
    this.setData({
      showList: false,
      currentCategory: null,
      currentProjects: []
    });
  }
})
