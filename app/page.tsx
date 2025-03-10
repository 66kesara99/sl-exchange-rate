import ExchangeRateCards from "@/components/exchange-rate-cards";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
          SL Exchange Rates
        </h1>
        <p className="text-gray-600 mb-6">
          Current exchange rates from major currencies. Mark your favorites to
          keep track of important rates.
        </p>
        <ExchangeRateCards />
      </div>
    </main>
  );
}
