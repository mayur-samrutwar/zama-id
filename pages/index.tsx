import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-zinc-900 sm:text-6xl">
            Decentralized identity and attestations that you own
          </h1>
          <p className="mt-6 text-lg leading-8 text-zinc-600">
            Zama ID lets any entity issue attestations. Users hold them, share them
            selectively, or prove things like age {">"} 18 without revealing everything.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4">
            <Link
              href="/app"
              className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-6 py-3 text-base font-medium text-white hover:bg-zinc-800 transition-colors"
            >
              Open App
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
