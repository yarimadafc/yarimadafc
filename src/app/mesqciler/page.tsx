"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function CoachesPage() {
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const { data, error } = await supabase.from("coaches").select("*, team:teams(name)");
        if (error) throw error;
        setCoaches(data || []);
      } catch (err) {
        console.error(err);
        setCoaches([
          { id: 1, name: "Əhməd Əhmədov", role: "Baş Məşqçi", license: "UEFA B", team: { name: "Yarımada U-12" } },
          { id: 2, name: "Rəşad Məmmədov", role: "Məşqçi", license: "UEFA C", team: { name: "Yarımada U-11" } },
          { id: 3, name: "Elşən Quliyev", role: "Qapıçı Məşqçisi", license: "UEFA C", team: { name: "Bütün komandalar" } },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCoaches();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-[#0a1628] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">
            Məşqçilərimiz
          </h1>
          <div className="w-24 h-1 bg-[#00e5a0] mx-auto mt-6"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="text-center">Yüklənir...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coaches.map(coach => (
              <Link href={`/mesqciler/${coach.id}`} key={coach.id}>
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden group hover:-translate-y-2 transition-transform">
                  <div className="h-64 bg-gray-200 flex items-center justify-center relative">
                    <span className="text-gray-400">Şəkil</span>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#0a1628] to-transparent p-4">
                      <h2 className="text-white font-bold text-2xl truncate">{coach.name}</h2>
                      <p className="text-[#00e5a0] font-semibold">{coach.role}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-500">Komanda:</span>
                      <span className="font-bold text-[#0a1628]">{coach.team?.name || "-"}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500">Lisenziya:</span>
                      <span className="font-bold text-[#0a1628]">{coach.license || "-"}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
