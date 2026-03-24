import AnimatedSection from './AnimatedSection';
import { useAppContext } from '@/App';

interface ServiceAreasProps {
  className?: string;
}

const ServiceAreas = ({ className = '' }: ServiceAreasProps) => {
  const { categories } = useAppContext();

  // 如果没有 categories，显示默认数据
  const displayCategories = categories.length > 0 ? categories : [
    { id: 1, name: '私宅照明', code: 'residential' },
    { id: 2, name: '餐饮照明', code: 'restaurant' },
    { id: 3, name: '娱乐照明', code: 'entertainment' },
    { id: 4, name: '办公照明', code: 'office' },
    { id: 5, name: '酒店照明', code: 'hotel' },
  ];

  return (
    <AnimatedSection className={className}>
      <div className="text-center mb-10 md:mb-12">
        <span className="section-label">Our Services</span>
        <h3 className="section-title text-xl md:text-2xl mt-3">服务领域</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 max-w-5xl mx-auto">
        {displayCategories.map((cat, index) => (
          <AnimatedSection key={cat.id} delay={index * 80}>
            <div className="text-center p-5 md:p-6 transition-all duration-300 hover:card-hover" style={{ backgroundColor: '#1a1a1a', border: '1px solid #1a1a1a' }}>
              <div className="text-2xl md:text-3xl mb-3">💡</div>
              <h4 className="text-xs font-light text-white tracking-wider">{cat.name}</h4>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default ServiceAreas;