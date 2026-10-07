export default function RegisterPage() {
  return (
    <div className="pt-[180px] min-h-screen bg-bg-main pb-20 flex flex-col items-center justify-center text-center">
      <div className="text-accent mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22v-5"/><path d="M9 7V2"/><path d="M15 7V2"/><path d="M12 7v5"/><path d="M12 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/><path d="M19.5 10.5 22 13"/><path d="M4.5 10.5 2 13"/></svg>
      </div>
      <h1 className="text-3xl md:text-5xl font-black text-text-main uppercase tracking-tighter mb-4">
        TEZLİKLƏ
      </h1>
      <p className="text-text-sec max-w-md mx-auto">
        Qeydiyyat bölməsi hazırda yenilənir və çox yaxında istifadənizə veriləcək. Səbriniz üçün təşəkkür edirik!
      </p>
    </div>
  );
}
