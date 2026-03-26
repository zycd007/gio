import { useState, useEffect, useRef } from 'react';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
  /** 首屏立即可见，跳过 IntersectionObserver */
  immediate?: boolean;
}

const AnimatedSection = ({ children, className = '', delay = 0, style, immediate = false }: AnimatedSectionProps) => {
  const [isVisible, setIsVisible] = useState(immediate);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(immediate);

  useEffect(() => {
    // 每次组件挂载时重置动画状态（除非是 immediate 模式）
    if (!immediate) {
      hasAnimated.current = false;
      setIsVisible(false);
    }

    // immediate 模式直接显示，不使用 IntersectionObserver
    if (immediate) {
      if (delay > 0) {
        setTimeout(() => setIsVisible(true), delay);
      } else {
        setIsVisible(true);
      }
      return;
    }

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
  }, [delay, immediate]);

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