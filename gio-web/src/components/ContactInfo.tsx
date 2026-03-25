import AnimatedSection from './AnimatedSection';
import { CONTACT_INFO } from '@/constants/contact';

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

      {/* 微信二维码 */}
      <div className="mt-8 pt-8" style={{ borderTop: '1px solid #1a1a1a' }}>
        <h4 className="font-light text-white text-sm mb-4 tracking-wide text-center">扫码咨询</h4>
        <div className="flex justify-center">
          <div className="w-32 h-32 md:w-40 md:h-40 overflow-hidden bg-white p-2">
            <img
              src="/wechat-qr.png"
              alt="微信二维码"
              className="w-full h-full object-contain"
              style={{
                imageRendering: 'pixelated',
                filter: 'none',
                colorScheme: 'light'
              }}
            />
          </div>
        </div>
      </div>

    </AnimatedSection>
  );
};

export default ContactInfo;