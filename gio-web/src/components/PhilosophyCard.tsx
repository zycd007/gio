import AnimatedSection from './AnimatedSection';
import { PhilosophyItem } from '@/types';
import { PHILOSOPHY_ITEMS } from '@/constants/contact';

interface PhilosophyCardProps {
  items?: PhilosophyItem[];
  className?: string;
}

const PhilosophyCard = ({ items = PHILOSOPHY_ITEMS, className = '' }: PhilosophyCardProps) => {
  return (
    <div className={`grid md:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto ${className}`}>
      {items.map((item, index) => (
        <AnimatedSection key={item.title} delay={index * 150}>
          <div className="text-center p-8 md:p-10 transition-all duration-500 card-hover" style={{ backgroundColor: '#1a1a1a', border: '1px solid #1a1a1a' }}>
            <div className="text-3xl md:text-4xl mb-5">{item.icon}</div>
            <h4 className="text-lg md:text-xl font-light text-white mb-4 tracking-wide">{item.title}</h4>
            <p className="text-xs md:text-sm leading-relaxed" style={{ color: '#666666' }}>
              {item.desc}
            </p>
          </div>
        </AnimatedSection>
      ))}
    </div>
  );
};

export default PhilosophyCard;