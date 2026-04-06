import { useContactForm } from '@/hooks/useContactForm';

interface ContactFormProps {
  rows?: number;
  className?: string;
}

const ContactForm = ({ rows = 3, className = '' }: ContactFormProps) => {
  const { contactForm, setContactForm, submitting, canSubmit, handleContactSubmit } = useContactForm();

  return (
    <form className={`space-y-5 md:space-y-6 ${className}`} onSubmit={handleContactSubmit}>
      {[
        { label: '姓名', type: 'text', placeholder: '请输入您的姓名', key: 'name' as const },
        { label: '电话', type: 'tel', placeholder: '请输入您的联系电话', key: 'phone' as const }
      ].map((field) => (
        <div key={field.key}>
          <label className="block text-xs font-light text-[#a0a0a0] mb-3 tracking-wider">{field.label}</label>
          <input
            type={field.type}
            className="w-full px-5 py-4 transition-all duration-300 outline-none text-white border border-[#1a1a1a] focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/15"
            placeholder={field.placeholder}
            value={contactForm[field.key]}
            onChange={(e) => setContactForm({ ...contactForm, [field.key]: e.target.value })}
            style={{
              backgroundColor: '#1a1a1a',
            }}
          />
        </div>
      ))}
      <div>
        <label className="block text-xs font-light text-[#a0a0a0] mb-3 tracking-wider">留言内容</label>
        <textarea
          rows={rows}
          className="w-full px-5 py-4 transition-all duration-300 outline-none resize-none text-white border border-[#1a1a1a] focus:border-[#d4a853] focus:ring-2 focus:ring-[#d4a853]/15"
          placeholder="请输入您想咨询的内容..."
          value={contactForm.content}
          onChange={(e) => setContactForm({ ...contactForm, content: e.target.value })}
          style={{
            backgroundColor: '#1a1a1a',
          }}
        />
      </div>
      <button
        type="submit"
        className="w-full btn-primary py-4 transition-all duration-300"
        disabled={!canSubmit || submitting}
        style={{
          opacity: (!canSubmit || submitting) ? 0.5 : 1,
          cursor: (!canSubmit || submitting) ? 'not-allowed' : 'pointer'
        }}
      >
        {submitting ? '提交中...' : '提交留言'}
      </button>
    </form>
  );
};

export default ContactForm;