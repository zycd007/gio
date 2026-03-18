Page({
  data: {
    showList: false,
    currentCategory: null,
    // 图片文件夹映射（category: folderPrefix）
    imageFolderMap: {
      residential: [
        { name: '麓湖', folder: '麓湖_成都' },
        { name: '御府', folder: '御府_成都_2025.08' },
        { name: '现代风格私宅', folder: '现代_成都_2025' },
        { name: '新装饰主义', folder: '新装饰_成都_2025' },
        { name: '中州锦城', folder: '中州_成都_2025' },
        { name: '国际公寓', folder: '国际_成都_2025' },
        { name: '自然居所', folder: '自然_成都_2025' },
        { name: '项目 2025.10', folder: '项目_成都_2025.10' },
        { name: '项目 2025', folder: '项目_成都_2025' },
        { name: '西安私宅', folder: '项目_西安_2025' }
      ],
      restaurant: [
        { name: 'Date Bank', folder: 'date_bank_成都_2021.08' },
        { name: '成都院子', folder: '成都院子_成都_2022.01' },
        { name: 'Foooo', folder: 'Foooo_成都_2023.08' },
        { name: '合景', folder: '合景_成都' },
        { name: '浅喜', folder: '浅喜_成都' },
        { name: '山水小馆', folder: '山水小馆_西安' },
        { name: '卫生餐厅', folder: '卫生餐厅_西安_2022.05' },
        { name: '烟草博物馆', folder: '烟草博物馆_上海' }
      ],
      entertainment: [],
      office: [],
      hotel: [],
      wedding: [],
      club: [],
      medical: [],
      exhibition: [],
      clothing: []
    },
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
      residential: [],
      restaurant: [],
      entertainment: [],
      office: [],
      hotel: [],
      wedding: [],
      club: [],
      medical: [],
      exhibition: [],
      clothing: []
    }
  },

  onLoad() {
    wx.setNavigationBarTitle({
      title: '案例作品'
    });

    // 初始化项目数据
    this.initProjects();
  },

  // 初始化项目数据，从 imageFolderMap 读取
  initProjects() {
    const projects = {};

    for (const catId of Object.keys(this.data.imageFolderMap)) {
      const folders = this.data.imageFolderMap[catId];
      if (!folders || folders.length === 0) {
        projects[catId] = [];
        continue;
      }

      projects[catId] = folders.map((f, index) => ({
        id: index + 1,
        name: f.name,
        location: f.folder.split('_')[1] || '成都',
        year: '2025',
        folder: f.folder,
        images: []
      }));

      // 加载图片
      for (let i = 0; i < projects[catId].length; i++) {
        this.loadProjectImages(catId, i);
      }
    }

    this.setData({ projects });
  },

  // 加载项目图片
  loadProjectImages(categoryId, projectIndex) {
    const project = this.data.projects[categoryId][projectIndex];
    if (!project || !project.folder) return;

    const imagePaths = [];
    // 小程序图片路径：相对于项目根目录
    const baseDir = `/images/${categoryId}/${project.folder}`;

    // 生成图片路径列表（最多 6 张 jpg）
    for (let i = 1; i <= 6; i++) {
      imagePaths.push(`${baseDir}/image${i}.jpg`);
    }

    if (imagePaths.length > 0) {
      const key = `projects.${categoryId}[${projectIndex}].images`;
      this.setData({ [key]: imagePaths });
    }
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

  goToDetail(e) {
    const item = e.currentTarget.dataset.item;
    const imagesStr = item.images && item.images.length > 0
      ? encodeURIComponent(JSON.stringify(item.images))
      : '';
    // 使用 currentCategory 或从 category ID 查找
    let typeName = '';
    if (this.data.currentCategory) {
      typeName = this.data.currentCategory.name;
    } else {
      // 尝试从 projects 数据中推断
      for (const cat of this.data.categories) {
        const catProjects = this.data.projects[cat.id] || [];
        if (catProjects.some(p => p.id === item.id)) {
          typeName = cat.name;
          break;
        }
      }
    }

    wx.navigateTo({
      url: `/pages/project-detail/project-detail?name=${encodeURIComponent(item.name)}&location=${encodeURIComponent(item.location)}&year=${encodeURIComponent(item.year)}&type=${encodeURIComponent(typeName)}&images=${imagesStr}`
    });
  },

  // 处理图片加载错误
  onImageError(e) {
    console.log('图片加载失败:', e.detail.errMsg);
  },

  backToCategories() {
    this.setData({
      showList: false,
      currentCategory: null,
      currentProjects: []
    });
  }
})
