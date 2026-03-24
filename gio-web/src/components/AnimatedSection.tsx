import { useState, useEffect, useRef } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
}

const AnimatedSection = ({ children, className = '', delay = 0, style }: AnimatedSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    // 每次组件挂载时重置动画状态
    hasAnimated.current = false;
    setIsVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        // 防止重复动画
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
      hasAnimated.current = false;
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;