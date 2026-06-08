import Link from "next/link";
import NeonButton from "@/components/MyButton/NeonButton";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center">
        {/* GIF Container */}
        <div className="relative mx-auto h-100 w-full max-w-150">
          <img
            src="/404.gif"
            alt="404 Animation"
            className="h-full w-full object-contain"
          />

          {/* 404 Text on GIF */}
          <h1 className="absolute left-1/2 top-2 -translate-x-1/2 text-[80px] font-bold leading-none text-gray-900">
            404
          </h1>
        </div>

        {/* Content */}
        <div className="relative z-20 -mt-12">
          <h2 className="text-4xl font-bold text-gray-800">
            Oops! You're Lost
          </h2>

          <p className="mt-3 text-lg text-gray-600">
            The page you're looking for doesn't exist or may have been moved.
          </p>

          <NeonButton href="/">Back to Home</NeonButton>
        </div>
      </div>
    </main>
  );
}
