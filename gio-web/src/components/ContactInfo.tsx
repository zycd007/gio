import AnimatedSection from './AnimatedSection';
import { CONTACT_INFO, SOCIAL_MEDIA } from '@/constants/contact';

interface ContactInfoProps {
  delayClassName?: string;
}

const ContactInfo = ({ delayClassName = '' }: ContactInfoProps) => {
  return (
    <AnimatedSection className={delayClassName}>
      <h2 className="text-xl md:text-2xl font-light text-white mb-6 md:mb-10 tracking-wide">联系方式</h2>
      <div className="space-y-6 md:space-y-8">
        {CONTACT_INFO.map((item) => (
          <div key={item.title} className="flex items-start gap-4">
            <div className="text-xl flex-shrink-0 w-10 h-10 flex items-center justify-center" style={{ backgroundColor: '#1a1a1a', color: '#d4a853' }}>
              {item.icon}
            </div>
            <div>
              <h4 className="font-light text-white text-sm mb-1 tracking-wide">{item.title}</h4>
              <p className="text-xs md:text-sm" style={{ color: '#666666' }}>{item.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 社交媒体 */}
      <div className="mt-10 md:mt-12">
        <h4 className="font-light text-white mb-5 text-sm tracking-wide">关注我们</h4>
        <div className="flex gap-4">
          {SOCIAL_MEDIA.map((social) => (
            <a
              key={social.label}
              href="#"
              className="w-11 h-11 flex items-center justify-center transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: '#1a1a1a', color: '#a0a0a0' }}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d={social.icon} />
              </svg>
            </a>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
};

export default ContactInfo;