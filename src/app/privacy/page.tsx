import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Məxfilik Siyasəti | Yarımada FK',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-[180px] pb-20 min-h-screen bg-bg-deep">
      <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black text-text-main uppercase tracking-tight mb-8">Məxfilik Siyasəti</h1>
        
        <div className="prose prose-invert max-w-none text-text-sec space-y-6">
          <p className="text-lg font-medium text-gray-200">
            Yarımada Futbol Klubu olaraq məxfiliyinizə hörmətlə yanaşır və şəxsi məlumatlarınızı qorumağa sadiqik. Bu səhifə, veb saytımızdan istifadə edərkən hansı məlumatların toplandığını və necə istifadə edildiyini izah edir.
          </p>

          <h2 className="text-2xl font-black text-text-main uppercase mt-12 mb-4">1. Toplanan Məlumatlar</h2>
          <p>
            Veb saytımıza daxil olduğunuzda aşağıdakı məlumatlar toplana bilər:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Şəxsi Məlumatlar:</strong> Akademiyaya və ya tədbirlərə qeydiyyatdan keçərkən təqdim etdiyiniz ad, soyad, əlaqə nömrəsi və e-poçt ünvanı.</li>
            <li><strong>Texniki Məlumatlar:</strong> İP ünvanınız, brauzer növü, cihaz məlumatları və saytda keçirdiyiniz vaxt (analitik məqsədlər üçün).</li>
          </ul>

          <h2 className="text-2xl font-black text-text-main uppercase mt-12 mb-4">2. Məlumatların İstifadəsi</h2>
          <p>Topladığımız məlumatlar aşağıdakı məqsədlər üçün istifadə olunur:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Sizinlə əlaqə saxlamaq və qeydiyyat sorğularınızı cavablandırmaq.</li>
            <li>Saytın fəaliyyətini yaxşılaşdırmaq və istifadəçi təcrübəsini artırmaq.</li>
            <li>Klubumuz haqqında önəmli xəbərlər və yeniliklər barədə məlumat vermək (əgər abunə olmusunuzsa).</li>
          </ul>

          <h2 className="text-2xl font-black text-text-main uppercase mt-12 mb-4">3. Məlumatların Qorunması</h2>
          <p>
            Şəxsi məlumatlarınızın təhlükəsizliyini təmin etmək üçün müasir təhlükəsizlik tədbirləri tətbiq edirik. Məlumatlarınız heç bir halda üçüncü tərəflərə satılmır və qanunla tələb olunmayan hallarda paylaşılmır.
          </p>

          <h2 className="text-2xl font-black text-text-main uppercase mt-12 mb-4">4. Əlaqə</h2>
          <p>
            Məxfilik siyasətimizlə bağlı hər hansı sualınız olarsa, bizimlə əlaqə saxlaya bilərsiniz:
          </p>
          <ul className="list-none space-y-2 text-accent font-medium">
            <li>E-poçt: info@yarimadafc.com</li>
            <li>Telefon: 055 447 74 67</li>
            <li>Ünvan: Kristal Abşeron 1, Xırdalan şəhəri</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
