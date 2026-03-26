import { Testimonial } from '@/types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  return (
    <div className="p-6 md:p-8" style={{ backgroundColor: '#141414' }}>
      {/* 星级评分 */}
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <span key={i} className="text-sm">★</span>
        ))}
      </div>

      {/* 评价内容 */}
      <p className="text-sm md:text-base text-white mb-6 leading-relaxed" style={{ color: '#cccccc' }}>
        "{testimonial.content}"
      </p>

      {/* 客户信息 */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-light"
          style={{ backgroundColor: '#d4a853' }}
        >
          {testimonial.customerName.charAt(0)}
        </div>
        <div>
          <div className="text-white text-sm font-light">{testimonial.customerName}</div>
          {testimonial.projectName && (
            <div className="text-xs" style={{ color: '#666666' }}>{testimonial.projectName}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;