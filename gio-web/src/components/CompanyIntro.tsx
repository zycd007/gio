import AnimatedSection from './AnimatedSection';

interface CompanyIntroProps {
  descriptions: string[];
  className?: string;
}

const COMPANY_IMAGE = 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80';

const CompanyIntro = ({ descriptions, className = '' }: CompanyIntroProps) => {
  return (
    <AnimatedSection className={`max-w-5xl mx-auto mb-16 md:mb-20 ${className}`}>
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
        <div className="md:w-1/2 relative">
          {/* 装饰边框 */}
          <div className="absolute -top-2 -left-2 w-8 h-8 border-t border-l" style={{ borderColor: '#d4a853' }} />
          <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b border-r" style={{ borderColor: '#d4a853' }} />
          <img
            src={COMPANY_IMAGE}
            alt="About"
            loading="lazy"
            className="w-full h-[250px] md:h-[400px] object-cover"
            style={{ filter: 'grayscale(20%)' }}
          />
        </div>
        <div className="md:w-1/2">
          {descriptions.map((desc, index) => (
            <p
              key={index}
              className={`text-sm md:text-base leading-relaxed ${index < descriptions.length - 1 ? 'mb-6' : ''}`}
              style={{ color: '#a0a0a0' }}
            >
              {desc}
            </p>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default CompanyIntro;