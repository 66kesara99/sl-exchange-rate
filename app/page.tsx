import ExchangeRateCards from "@/components/exchange-rate-cards";

export default function Home() {
  return (
    <main className="min-h-screen px-4 py-10 md:px-10 md:py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-10 text-gray-900 text-center">
          Sri Lankan Exchange Rates
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Current exchange rates from Sampath Bank. Mark your favorites to keep
          track of important rates.
        </p>
        <ExchangeRateCards />
      </div>
    </main>
  );
}
