import { Play, TrendingUp, Users } from "lucide-react";
import GameCard from "./GameCard";

interface MainContentProps {
  activeSection: string;
  onOpenChat: () => void;
}

export default function MainContent({ activeSection, onOpenChat }: MainContentProps) {
  const games = [
    {
      id: 1,
      title: "Football Championship",
      image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      players: "2.5K",
      prize: "$5,000",
      status: "Live",
    },
    {
      id: 2,
      title: "Cricket League",
      image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      players: "1.8K",
      prize: "$3,500",
      status: "Starting",
    },
    {
      id: 3,
      title: "Basketball Pro",
      image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      players: "3.2K",
      prize: "$7,500",
      status: "Live",
    },
    {
      id: 4,
      title: "Tennis Masters",
      image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      players: "900",
      prize: "$2,000",
      status: "Upcoming",
    },
  ];

  if (activeSection === "home") {
    return (
      <main className="flex-1 overflow-auto p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#8f2c24] mb-2">Welcome back, Champion!</h1>
          <p className="text-slate-600">Ready to play and win amazing prizes?</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Points</p>
                <p className="text-3xl font-bold text-[#8f2c24] mt-2">2,450</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#8f2c24] to-[#d64c42] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Games Played</p>
                <p className="text-3xl font-bold text-[#8f2c24] mt-2">48</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Win Rate</p>
                <p className="text-3xl font-bold text-[#8f2c24] mt-2">68%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Friends</p>
                <p className="text-3xl font-bold text-[#8f2c24] mt-2">127</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#8f2c24] to-[#d64c42] rounded-2xl p-8 text-white mb-8 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2">Score Goals with Seamless Gaming!</h2>
            <p className="text-white/90 mb-6">Join tournaments, compete with friends, and win amazing rewards.</p>
            <button className="bg-white text-[#8f2c24] px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
              Explore Games
            </button>
          </div>
        </div>

        {/* Games Section */}
        <div>
          <h2 className="text-2xl font-bold text-[#8f2c24] mb-4">Featured Games</h2>
          <div className="grid grid-cols-2 gap-6">
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (activeSection === "games") {
    return (
      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold text-[#8f2c24] mb-6">Browse Games</h1>
        <div className="grid grid-cols-2 gap-6">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </main>
    );
  }

  if (activeSection === "leaderboard") {
    return (
      <main className="flex-1 overflow-auto p-8">
        <h1 className="text-3xl font-bold text-[#8f2c24] mb-6">Leaderboard</h1>
        <div className="bg-white/80 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-slate-100">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-[#8f2c24] to-[#d64c42] text-white">
              <tr>
                <th className="px-6 py-4 text-left font-semibold">Rank</th>
                <th className="px-6 py-4 text-left font-semibold">Player</th>
                <th className="px-6 py-4 text-left font-semibold">Points</th>
                <th className="px-6 py-4 text-left font-semibold">Games</th>
                <th className="px-6 py-4 text-left font-semibold">Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[1, 2, 3, 4, 5].map((rank) => (
                <tr key={rank} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-[#8f2c24]">#{rank}</td>
                  <td className="px-6 py-4">Player {rank}</td>
                  <td className="px-6 py-4 font-semibold">{5000 - rank * 500}</td>
                  <td className="px-6 py-4">{100 - rank * 10}</td>
                  <td className="px-6 py-4">{85 - rank * 3}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-auto p-8">
      <h1 className="text-3xl font-bold text-[#8f2c24] mb-6 capitalize">{activeSection}</h1>
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 text-center border border-slate-100">
        <p className="text-slate-600">This section is coming soon!</p>
      </div>
    </main>
  );
}

import { Gamepad2, Trophy } from "lucide-react";
