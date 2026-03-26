import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { createContext, useState, useContext } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProjectDetail from './pages/ProjectDetail';
import Contact from './pages/Contact';
import About from './pages/About';
import AdminLayout from './admin/Layout';
import AdminLogin from './admin/Login';
import AdminDashboard from './admin/Dashboard';
import AdminProjects from './admin/Projects';
import AdminCategories from './admin/Categories';
import AdminMessages from './admin/Messages';
import Projects from './pages/Projects';

// 数据类型定义
interface Category {
  id: number;
  name: string;
  nameEn: string;
  code: string;
  icon: string;
  sortOrder: number;
}

interface Project {
  id: number;
  name: string;
  location: string;
  year: string;
  categoryName: string;
  coverImageId?: number;
  viewCount?: number;
}

// 创建 Context
interface AppContextType {
  categories: Category[];
  setCategories: (cats: Category[]) => void;
  projects: Project[];
  setProjects: (projs: Project[]) => void;
}

const AppContext = createContext<AppContextType>({
  categories: [],
  setCategories: () => {},
  projects: [],
  setProjects: () => {},
});

// 导出 Context 供子组件使用
export const useAppContext = () => useContext(AppContext);

function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const contextValue = { categories, setCategories, projects, setProjects };

  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <AppContext.Provider value={contextValue}>
        <Routes>
          {/* 前台官网 - 单页面 */}
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            {/* 案例作品页面 */}
            <Route path="projects" element={<Projects />} />
            {/* 项目详情页保持独立路由 */}
            <Route path="projects/:id" element={<ProjectDetail />} />
            {/* 联系我们页面 */}
            <Route path="contact" element={<Contact />} />
            <Route path="about" element={<About />} />
          </Route>

          {/* 后台管理路由 */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="login" element={<AdminLogin />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
        </Routes>
      </AppContext.Provider>
    </BrowserRouter>
  );
}

export default App;
