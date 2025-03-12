import { Star } from "lucide-react";
import { ExchangeRate } from "./exchange-rate-cards";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface ExchangeRateCardProps {
  rate: ExchangeRate;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  amount: number;
  baseCurrency: string;
  rates: ExchangeRate[];
}

export default function ExchangeRateCard({
  rate,
  isFavorite,
  onToggleFavorite,
  amount,
  baseCurrency,
  rates,
}: ExchangeRateCardProps) {
  // Find the base currency rate
  const baseRate = rates.find((r) => r.id === baseCurrency);

  if (!baseRate) {
    return null;
  }

  // If the card is the same as the base currency, don't show it in the "All Currencies" section
  if (rate.id === baseCurrency && !isFavorite) {
    return null;
  }

  // Calculate cross-rates
  // For example, if base is USD and card is EUR:
  // USD to EUR = USD rate / EUR rate
  const buyRate = baseRate.buyRate / rate.buyRate;
  const sellRate = baseRate.sellRate / rate.sellRate;

  // Calculate converted values
  const convertedBuyValue = amount * buyRate;
  const convertedSellValue = amount * sellRate;

  return (
    <Card
      className={`
        relative overflow-hidden transition-all duration-300
        ${
          isFavorite
            ? "p-5 border-2 border-primary shadow-lg"
            : "p-3 border border-gray-200 shadow-sm text-sm"
        }
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className={`font-bold ${isFavorite ? "text-xl" : "text-base"}`}>
            {rate.code}
          </h3>
          <p className={`text-gray-500 ${isFavorite ? "text-sm" : "text-xs"}`}>
            {isFavorite ? rate.currency : ""}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleFavorite}
          className={`rounded-full ${
            isFavorite ? "text-yellow-500" : "text-gray-400"
          }
              ${isFavorite ? "" : "h-6 w-6"}`}
        >
          <Star
            className={isFavorite ? "fill-yellow-500" : ""}
            size={isFavorite ? 20 : 16}
          />
          <span className="sr-only">
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </span>
        </Button>
      </div>

      <div className={`space-y-${isFavorite ? "3" : "2"}`}>
        <div className="space-y-0.5">
          <p className={`${isFavorite ? "text-sm" : "text-xs"} text-gray-500`}>
            Buy Rate
          </p>
          <p
            className={`font-mono font-bold ${
              isFavorite ? "text-2xl" : "text-lg"
            } text-green-600`}
          >
            {rate.buyRate.toFixed(4)}
          </p>
          {amount > 0 && (
            <div
              className={`mt-1 p-1 bg-green-50 rounded-md ${
                isFavorite ? "" : "text-xs"
              }`}
            >
              <p className="font-mono text-green-700">
                {amount.toFixed(2)} {baseRate.code} =
              </p>
              <p className="font-mono font-semibold text-green-800">
                {convertedBuyValue.toFixed(2)} {rate.code}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-0.5">
          <p className={`${isFavorite ? "text-sm" : "text-xs"} text-gray-500`}>
            Sell Rate
          </p>
          <p
            className={`font-mono ${
              isFavorite ? "text-lg" : "text-sm"
            } text-red-600`}
          >
            {rate.sellRate.toFixed(4)}
          </p>
          {amount > 0 && (
            <div
              className={`mt-1 p-1 bg-red-50 rounded-md ${
                isFavorite ? "" : "text-xs"
              }`}
            >
              <p className="font-mono text-red-700">
                {amount.toFixed(2)} {baseRate.code} =
              </p>
              <p className="font-mono font-semibold text-red-800">
                {convertedSellValue.toFixed(2)} {rate.code}
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
