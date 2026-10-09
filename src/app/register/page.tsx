'use client';
import PageHero from '@/components/PageHero';
import WhatsAppForm from '@/components/WhatsAppForm';

export default function RegisterPage() {
  return (
    <div className="pt-header pb-20 min-h-screen">
      <PageHero title="Akademiyaya qeydiyyat" subtitle="Övladınızı akademiyaya yazdırmaq üçün formu doldurun. Müraciətiniz WhatsApp vasitəsilə klubumuza çatacaq və biz sizinlə əlaqə saxlayacağıq." />
      <div className="container">
        <div className="led-border bg-bg-sec rounded-3xl border border-bg-border p-6 md:p-10">
          <WhatsAppForm
            intro="Salam, akademiyaya qeydiyyat müraciəti:"
            submitLabel="Müraciəti göndər"
            fields={[
              { name: 'child', label: 'Uşağın adı, soyadı', required: true },
              { name: 'birth', label: 'Doğum tarixi', type: 'date', required: true },
              { name: 'parent', label: 'Valideynin adı, soyadı', required: true },
              { name: 'phone', label: 'Əlaqə nömrəsi', type: 'tel', required: true, placeholder: '050 000 00 00' },
              { name: 'note', label: 'Əlavə qeyd', type: 'textarea' },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
