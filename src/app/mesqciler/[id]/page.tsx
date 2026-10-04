"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CoachProfilePage() {
  const params = useParams();
  const id = params.id;
  const [coach, setCoach] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const { data, error } = await supabase
          .from("coaches")
          .select("*, team:teams(name)")
          .eq("id", id)
          .single();
          
        if (error) throw error;
        setCoach(data);
      } catch (err) {
        console.error(err);
        setCoach({
          id,
          name: "Əhməd Əhmədov",
          role: "Baş Məşqçi",
          license: "UEFA B",
          experience: "8 il",
          team: { name: "Yarımada U-12" },
          bio: "Əhməd Əhmədov 8 ildən çoxdur ki, uşaq futbolunda fəaliyyət göstərir. Müxtəlif yaş qruplarında çempionluqlar yaşayıb və istedadlı futbolçuların yetişməsində böyük rolu var."
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCoach();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-24 text-center">Yüklənir...</div>;
  if (!coach) return <div className="min-h-screen pt-24 text-center">Məşqçi tapılmadı</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link href="/mesqciler" className="inline-block mb-8 text-[#0a1628] font-bold hover:text-[#00e5a0] transition">
          ← Məşqçilərə qayıt
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl mx-auto">
          <div className="md:flex">
            <div className="md:w-2/5 bg-[#0a1628] p-10 flex flex-col items-center justify-center text-center">
              <div className="w-48 h-48 bg-gray-700 rounded-full flex items-center justify-center mb-6 border-4 border-[#00e5a0]">
                <span className="text-gray-400">Şəkil</span>
              </div>
              <h1 className="text-3xl font-bold text-white uppercase mb-2">{coach.name}</h1>
              <div className="bg-[#00e5a0] text-[#0a1628] px-4 py-1 rounded font-bold uppercase tracking-wider text-sm">
                {coach.role}
              </div>
            </div>
            
            <div className="md:w-3/5 p-10">
              <h2 className="text-2xl font-bold text-[#0a1628] border-b-2 border-gray-100 pb-4 mb-6 uppercase tracking-wide">
                Məşqçi Profili
              </h2>
              
              <div className="grid grid-cols-2 gap-y-6 gap-x-8 mb-8">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Lisenziya</p>
                  <p className="font-bold text-lg text-[#0a1628]">{coach.license || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Təcrübə</p>
                  <p className="font-bold text-lg text-[#0a1628]">{coach.experience || "-"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 text-sm mb-1">Məşq etdirdiyi komanda</p>
                  <p className="font-bold text-lg text-[#0a1628]">{coach.team?.name || "Bütün komandalar"}</p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-[#0a1628] mb-3">Haqqında</h3>
                <p className="text-gray-600 leading-relaxed">
                  {coach.bio || "Məlumat daxil edilməyib."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
