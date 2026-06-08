import { Play, Users, Trophy } from "lucide-react";

interface Game {
  id: number;
  title: string;
  image: string;
  players: string;
  prize: string;
  status: string;
}

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const statusColors = {
    Live: "bg-red-500",
    Starting: "bg-yellow-500",
    Upcoming: "bg-blue-500",
  };

  return (
    <div className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300">
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-64"
        style={{ background: game.image }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />

      {/* Content */}
      <div className="relative h-64 flex flex-col justify-between p-6 text-white">
        {/* Top Section */}
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">{game.title}</h3>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${
                statusColors[game.status as keyof typeof statusColors]
              }`}
            >
              {game.status}
            </span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span>{game.players} Players</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>{game.prize}</span>
            </div>
          </div>

          <button className="w-full bg-white text-[#8f2c24] py-2 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors group/btn">
            <Play className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
}
