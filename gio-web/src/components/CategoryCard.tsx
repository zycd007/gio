import { useNavigate } from 'react-router-dom';
import AnimatedSection from './AnimatedSection';
import { Category } from '@/types';

// 分类图片映射
const categoryImages: Record<string, string> = {
  residential: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
  restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
  entertainment: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80',
  office: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80',
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80',
  wedding: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  club: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=600&q=80',
  medical: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&q=80',
  exhibition: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80',
  clothing: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
};

interface CategoryCardProps {
  category: Category;
  index: number;
  onClick?: (code: string) => void;
  showEnName?: boolean;
}

const CategoryCard = ({ category, index, onClick, showEnName = true }: CategoryCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick(category.code);
    } else {
      navigate(`/projects?category=${category.code}`);
    }
  };

  return (
    <AnimatedSection key={category.id} delay={index * 100}>
      <button
        onClick={handleClick}
        className="group relative aspect-[3/4] overflow-hidden cursor-pointer w-full"
      >
        {/* 图片 */}
        <img
          src={categoryImages[category.code] || categoryImages.residential}
          alt={category.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out-expo group-hover:scale-110"
        />
        {/* 叠加层 */}
        <div className="absolute inset-0 transition-opacity duration-300" style={{
          background: 'linear-gradient(180deg, transparent 40%, rgba(10,10,10,0.9) 100%)'
        }} />
        {/* 边框效果 */}
        <div className="absolute inset-0 border transition-all duration-300 opacity-30 group-hover:opacity-60" style={{ borderColor: '#d4a853' }} />
        {/* 内容 */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
          <h3 className="text-white text-sm font-light tracking-wider transition-all duration-300 group-hover:text-[#d4a853]">
            {category.name}
          </h3>
          {/* 设计亮点 - 悬停时显示 */}
          {category.designHighlights && (
            <p className="text-xs text-[#999999] mt-1 opacity-0 group-hover:opacity-100 transition-all duration-300 line-clamp-2">
              {category.designHighlights}
            </p>
          )}
        </div>
        {/* 悬停时显示英文和适配场景 */}
        {showEnName && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 text-center px-4">
            <span className="text-[#d4a853] text-xs tracking-[0.3em] uppercase block mb-2">{category.nameEn}</span>
            {category.suitableScenes && (
              <span className="text-white text-xs tracking-wide block" style={{ color: '#cccccc' }}>
                {category.suitableScenes}
              </span>
            )}
          </div>
        )}
      </button>
    </AnimatedSection>
  );
};

export default CategoryCard;