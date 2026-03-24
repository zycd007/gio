import { useState } from 'react';
import { toast } from 'sonner';
import { ContactFormData } from '@/types';

export const useContactForm = () => {
  const [contactForm, setContactForm] = useState<ContactFormData>({
    name: '',
    phone: '',
    content: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 至少填写一个字段
    if (!contactForm.name && !contactForm.phone && !contactForm.content) {
      toast.warning('请至少填写一项内容');
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (response.ok) {
        toast.success('留言提交成功！我们会尽快与您联系。');
        setContactForm({ name: '', phone: '', content: '' });
      } else {
        toast.error('提交失败，请稍后重试');
      }
    } catch (error) {
      toast.error('提交失败，请稍后重试');
    } finally {
      setSubmitting(false);
    }
  };

  // 检查是否可以提交（至少填写一个字段）
  const canSubmit = contactForm.name || contactForm.phone || contactForm.content;

  return {
    contactForm,
    setContactForm,
    submitting,
    canSubmit,
    handleContactSubmit
  };
};