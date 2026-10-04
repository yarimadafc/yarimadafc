"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PlayerProfilePage() {
  const params = useParams();
  const id = params.id;
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayer = async () => {
      try {
        const { data, error } = await supabase
          .from("players")
          .select("*, team:teams(name)")
          .eq("id", id)
          .single();
          
        if (error) throw error;
        setPlayer(data);
      } catch (err) {
        console.error(err);
        setPlayer({
          id,
          name: "Əli Əliyev",
          birth_date: "2011-05-14",
          position: "Hücumçu",
          jersey_number: 9,
          height: "155 sm",
          started_date: "2020-09-01",
          team: { name: "Yarımada U-12" },
          team_id: 1,
          stats: {
            games_played: 24,
            games_started: 20,
            goals: 15,
            assists: 8,
            yellow_cards: 2,
            red_cards: 0
          }
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchPlayer();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-24 text-center">Yüklənir...</div>;
  if (!player) return <div className="min-h-screen pt-24 text-center">Oyunçu tapılmadı</div>;

  const calculateAge = (dob: string) => {
    if (!dob) return "-";
    const diff_ms = Date.now() - new Date(dob).getTime();
    const age_dt = new Date(diff_ms); 
    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <Link href={`/komandalar/${player.team_id}`} className="inline-block mb-8 text-[#0a1628] font-bold hover:text-[#00e5a0] transition">
          ← Komandaya qayıt
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-[#0a1628] p-8 flex flex-col items-center justify-center relative">
              <div className="absolute top-4 left-4 bg-[#00e5a0] text-[#0a1628] text-4xl font-black w-16 h-16 rounded-full flex items-center justify-center">
                {player.jersey_number}
              </div>
              <div className="w-48 h-48 bg-gray-700 rounded-full flex items-center justify-center mb-6 border-4 border-[#00e5a0]">
                <span className="text-gray-400">Şəkil</span>
              </div>
              <h1 className="text-3xl font-bold text-white uppercase text-center mb-2">{player.name}</h1>
              <p className="text-[#00e5a0] text-xl font-semibold uppercase">{player.position}</p>
            </div>
            <div className="md:w-2/3 p-8 lg:p-12">
              <h2 className="text-2xl font-bold text-[#0a1628] border-b-2 border-gray-100 pb-4 mb-6 uppercase tracking-wide">
                Şəxsi Məlumatlar
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Doğum tarixi</p>
                  <p className="font-bold text-lg text-[#0a1628]">{player.birth_date} ({calculateAge(player.birth_date)} yaş)</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Komanda</p>
                  <p className="font-bold text-lg text-[#0a1628]">{player.team?.name || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Boy</p>
                  <p className="font-bold text-lg text-[#0a1628]">{player.height || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Klubda başladığı tarix</p>
                  <p className="font-bold text-lg text-[#0a1628]">{player.started_date || "-"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <h2 className="text-2xl font-bold text-[#0a1628] uppercase tracking-wider mb-6 border-l-4 border-[#00e5a0] pl-4">
          Statistika (Cari Mövsüm)
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: "Oyunlar", value: player.stats?.games_played || 0 },
            { label: "Əsas heyət", value: player.stats?.games_started || 0 },
            { label: "Qollar", value: player.stats?.goals || 0 },
            { label: "Asistlər", value: player.stats?.assists || 0 },
            { label: "Sarı vərəqə", value: player.stats?.yellow_cards || 0 },
            { label: "Qırmızı vərəqə", value: player.stats?.red_cards || 0 },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-xl shadow border border-gray-100 text-center">
              <div className="text-4xl font-black text-[#0a1628] mb-2">{stat.value}</div>
              <div className="text-sm font-semibold text-gray-500 uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
