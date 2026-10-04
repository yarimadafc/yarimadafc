"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TeamDetailPage() {
  const params = useParams();
  const id = params.id;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const [teamRes, playersRes, coachesRes] = await Promise.all([
          supabase.from("teams").select("*").eq("id", id).single(),
          supabase.from("players").select("*").eq("team_id", id),
          supabase.from("coaches").select("*").eq("team_id", id)
        ]);

        if (teamRes.error) throw teamRes.error;

        setData({
          team: teamRes.data,
          players: playersRes.data || [],
          coaches: coachesRes.data || [],
          matches: [],
          schedule: []
        });
      } catch (err) {
        console.error(err);
        // Mock data
        setData({
          team: { id, name: "Yarımada U-12", age_group: "U-12" },
          players: [
            { id: 1, name: "Əli Əliyev", position: "Hücumçu", jersey_number: 9 },
            { id: 2, name: "Vəli Vəliyev", position: "Yarımmüdafiəçi", jersey_number: 10 },
          ],
          coaches: [
            { id: 1, name: "Əhməd Əhmədov", role: "Baş Məşqçi" }
          ],
          matches: [
            { id: 1, date: "2023-10-15", opponent: "Qarabağ U-12", result: "2-1 (Q)" },
            { id: 2, date: "2023-10-22", opponent: "Neftçi U-12", result: "1-1 (H)" },
          ],
          schedule: [
            { id: 1, day: "Bazar ertəsi", time: "18:00 - 19:30", location: "Əsas Meydan" },
            { id: 2, day: "Çərşənbə", time: "18:00 - 19:30", location: "Əsas Meydan" },
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTeamData();
  }, [id]);

  if (loading) return <div className="min-h-screen pt-24 text-center">Yüklənir...</div>;
  if (!data?.team) return <div className="min-h-screen pt-24 text-center">Komanda tapılmadı</div>;

  const { team, players, coaches, matches, schedule } = data;

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="bg-[#0a1628] text-white pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-48 h-48 bg-gray-800 rounded-full flex items-center justify-center border-4 border-[#c9a84c]">
              <span className="text-gray-400">Komanda Loqosu</span>
            </div>
            <div className="text-center md:text-left">
              <div className="inline-block bg-[#c9a84c] text-[#0a1628] px-3 py-1 font-bold rounded mb-4">
                {team.age_group}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-wider mb-2">
                {team.name}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 space-y-16">
        {/* Coaches */}
        <section>
          <h2 className="text-3xl font-bold text-[#0a1628] uppercase tracking-wider mb-8 border-l-4 border-[#c9a84c] pl-4">
            Məşqçi Heyəti
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coaches.map((coach: any) => (
              <Link href={`/mesqciler/${coach.id}`} key={coach.id}>
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100 flex items-center gap-4 hover:shadow-md transition">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-xs text-gray-500">Şəkil</div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0a1628]">{coach.name}</h3>
                    <p className="text-gray-500">{coach.role}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Players */}
        <section>
          <h2 className="text-3xl font-bold text-[#0a1628] uppercase tracking-wider mb-8 border-l-4 border-[#c9a84c] pl-4">
            Oyunçular
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {players.map((player: any) => (
              <Link href={`/futbolcular/${player.id}`} key={player.id}>
                <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden text-center group hover:-translate-y-1 transition">
                  <div className="h-48 bg-gray-200 flex items-center justify-center relative">
                    <span className="text-gray-400 text-sm">Oyunçu Şəkli</span>
                    <div className="absolute top-2 left-2 bg-[#0a1628] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                      {player.jersey_number}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#0a1628] truncate">{player.name}</h3>
                    <p className="text-sm text-gray-500">{player.position}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Matches */}
          <section>
            <h2 className="text-2xl font-bold text-[#0a1628] uppercase tracking-wider mb-6 border-l-4 border-[#c9a84c] pl-4">
              Son Oyunlar
            </h2>
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#0a1628] text-white">
                  <tr>
                    <th className="p-4">Tarix</th>
                    <th className="p-4">Rəqib</th>
                    <th className="p-4">Nəticə</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {matches.map((match: any) => (
                    <tr key={match.id}>
                      <td className="p-4 text-gray-600">{match.date}</td>
                      <td className="p-4 font-bold text-[#0a1628]">{match.opponent}</td>
                      <td className="p-4 font-bold">{match.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Training Schedule */}
          <section>
            <h2 className="text-2xl font-bold text-[#0a1628] uppercase tracking-wider mb-6 border-l-4 border-[#c9a84c] pl-4">
              Məşq Cədvəli
            </h2>
            <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
              <div className="space-y-4">
                {schedule.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div>
                      <h4 className="font-bold text-[#0a1628]">{item.day}</h4>
                      <p className="text-sm text-gray-500">{item.location}</p>
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded text-[#0a1628] font-semibold">
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
