"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function KomandalarPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [filter, setFilter] = useState("Hamısı");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const { data, error } = await supabase.from("teams").select("*");
        if (error) throw error;
        setTeams(data || []);
      } catch (err) {
        console.error(err);
        setTeams([
          { id: 1, name: "Yarımada U-12", age_group: "U-12", coach_name: "Əhməd Əhmədov", player_count: 18 },
          { id: 2, name: "Yarımada U-11", age_group: "U-11", coach_name: "Rəşad Məmmədov", player_count: 20 },
          { id: 3, name: "Yarımada U-10", age_group: "U-10", coach_name: "Elşən Quliyev", player_count: 16 },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  const filteredTeams = filter === "Hamısı" ? teams : teams.filter(t => t.age_group === filter);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-[#0a1628] py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider text-white">
            Komandalarımız
          </h1>
          <div className="w-24 h-1 bg-[#c9a84c] mx-auto mt-6"></div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {["Hamısı", "U-12", "U-11", "U-10", "U-9"].map(age => (
            <button
              key={age}
              onClick={() => setFilter(age)}
              className={`px-6 py-2 rounded-full font-bold uppercase tracking-wide transition-colors ${
                filter === age 
                  ? "bg-[#0a1628] text-[#c9a84c]" 
                  : "bg-gray-100 text-[#0a1628] hover:bg-gray-200"
              }`}
            >
              {age}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="text-center text-[#0a1628]">Yüklənir...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTeams.map(team => (
              <Link key={team.id} href={`/komandalar/${team.id}`} className="group">
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-transform group-hover:-translate-y-2">
                  <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                    <span className="text-gray-400 font-medium">Komanda şəkli ({team.age_group})</span>
                    <div className="absolute top-4 right-4 bg-[#0a1628] text-[#c9a84c] px-3 py-1 rounded font-bold">
                      {team.age_group}
                    </div>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-[#0a1628] mb-2 uppercase">{team.name}</h2>
                    <div className="space-y-2 text-gray-600">
                      <p><span className="font-semibold">Baş Məşqçi:</span> {team.coach_name || "Təyin edilməyib"}</p>
                      <p><span className="font-semibold">Heyət:</span> {team.player_count || 0} oyunçu</p>
                    </div>
                    <div className="mt-6 flex items-center text-[#0a1628] font-bold group-hover:text-[#c9a84c] transition-colors uppercase text-sm tracking-wider">
                      Ətraflı <span className="ml-2">→</span>
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
