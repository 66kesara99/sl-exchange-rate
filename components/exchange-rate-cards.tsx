"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ExchangeRate {
  id: string;
  currency: string;
  code: string;
  buyRate: number;
  sellRate: number;
}

interface ExchangeRateCardProps {
  rate: ExchangeRate;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  amount: number;
  baseCurrency: string;
  rates: ExchangeRate[];
}

export default function ExchangeRateCards() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("100");
  const [baseCurrency, setBaseCurrency] = useState<string>("usd");

  useEffect(() => {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem("favoriteRates");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Fetch exchange rates
    fetchExchangeRates();
  }, []);

  const fetchExchangeRates = async () => {
    setLoading(true);
    try {
      // In a real app, replace this with your actual API endpoint
      // For demo purposes, we'll use mock data
      // await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      const mockRates: ExchangeRate[] = [
        {
          id: "usd",
          currency: "US Dollar",
          code: "USD",
          buyRate: 1.105,
          sellRate: 1.095,
        },
        {
          id: "eur",
          currency: "Euro",
          code: "EUR",
          buyRate: 1.005,
          sellRate: 0.995,
        },
        {
          id: "gbp",
          currency: "British Pound",
          code: "GBP",
          buyRate: 1.315,
          sellRate: 1.305,
        },
        {
          id: "jpy",
          currency: "Japanese Yen",
          code: "JPY",
          buyRate: 0.0072,
          sellRate: 0.007,
        },
        {
          id: "cad",
          currency: "Canadian Dollar",
          code: "CAD",
          buyRate: 0.745,
          sellRate: 0.735,
        },
        {
          id: "aud",
          currency: "Australian Dollar",
          code: "AUD",
          buyRate: 0.675,
          sellRate: 0.665,
        },
        {
          id: "chf",
          currency: "Swiss Franc",
          code: "CHF",
          buyRate: 1.125,
          sellRate: 1.115,
        },
        {
          id: "cny",
          currency: "Chinese Yuan",
          code: "CNY",
          buyRate: 0.155,
          sellRate: 0.145,
        },
      ];

      setRates(mockRates);
      setError(null);
    } catch (err) {
      setError("Failed to fetch exchange rates. Please try again later.");
      console.error("Error fetching exchange rates:", err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id: string) => {
    const newFavorites = favorites.includes(id)
      ? favorites.filter((fav) => fav !== id)
      : [...favorites, id];

    setFavorites(newFavorites);
    localStorage.setItem("favoriteRates", JSON.stringify(newFavorites));
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and decimal point
    const value = e.target.value.replace(/[^0-9.]/g, "");
    // Prevent multiple decimal points
    const parts = value.split(".");
    const sanitizedValue =
      parts.length > 2 ? `${parts[0]}.${parts.slice(1).join("")}` : value;
    setAmount(sanitizedValue);
  };

  const handleCurrencyChange = (value: string) => {
    setBaseCurrency(value);
  };

  // Get the selected base currency details
  const selectedCurrency = rates.find((rate) => rate.id === baseCurrency) || {
    code: "USD",
    buyRate: 1,
    sellRate: 1,
  };

  // Sort rates: favorites first, then alphabetically by currency
  const sortedRates = [...rates].sort((a, b) => {
    const aIsFavorite = favorites.includes(a.id);
    const bIsFavorite = favorites.includes(b.id);

    if (aIsFavorite && !bIsFavorite) return -1;
    if (!aIsFavorite && bIsFavorite) return 1;
    return a.currency.localeCompare(b.currency);
  });

  if (loading) {
    return <LoadingSkeletons />;
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 rounded-lg border border-red-200 text-red-700">
        <p>{error}</p>
        <Button onClick={fetchExchangeRates} variant="outline" className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Currency Converter
        </h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
          <div className="w-full sm:w-auto">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Amount
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">
                  {selectedCurrency.code === "USD"
                    ? "$"
                    : selectedCurrency.code === "EUR"
                    ? "€"
                    : selectedCurrency.code === "GBP"
                    ? "£"
                    : ""}
                </span>
              </div>
              <input
                type="text"
                name="amount"
                id="amount"
                value={amount}
                onChange={handleAmountChange}
                className="focus:ring-primary focus:border-primary block w-full pl-7 pr-3 sm:text-sm border-gray-300 rounded-md py-2 border"
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="w-full sm:w-auto">
            <label
              htmlFor="currency"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Currency
            </label>
            <Select value={baseCurrency} onValueChange={handleCurrencyChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                {rates.map((rate) => (
                  <SelectItem key={rate.id} value={rate.id}>
                    {rate.code} - {rate.currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="text-sm text-gray-500 mt-2 sm:mt-0 sm:ml-4">
            Enter an amount to see converted values
          </p>
        </div>
      </div>

      {/* Favorites Section */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <Star className="fill-yellow-500 text-yellow-500" size={20} />
          Favorites
        </h2>
        {favorites.length === 0 ? (
          <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            Star any currency to add it to your favorites
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {sortedRates
              .filter((rate) => favorites.includes(rate.id))
              .map((rate) => (
                <ExchangeRateCard
                  key={rate.id}
                  rate={rate}
                  isFavorite={true}
                  onToggleFavorite={() => toggleFavorite(rate.id)}
                  amount={Number.parseFloat(amount) || 0}
                  baseCurrency={baseCurrency}
                  rates={rates}
                />
              ))}
          </div>
        )}
      </div>

      {/* All Currencies Section */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-gray-800">All Currencies</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
          {sortedRates
            .filter(
              (rate) => !favorites.includes(rate.id) && rate.id !== baseCurrency
            )
            .map((rate) => (
              <ExchangeRateCard
                key={rate.id}
                rate={rate}
                isFavorite={false}
                onToggleFavorite={() => toggleFavorite(rate.id)}
                amount={Number.parseFloat(amount) || 0}
                baseCurrency={baseCurrency}
                rates={rates}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

function ExchangeRateCard({
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
            {rate.id === baseCurrency
              ? "Rate"
              : `${baseRate.code}/${rate.code}`}
          </p>
          <p
            className={`font-mono font-bold ${
              isFavorite ? "text-2xl" : "text-lg"
            } text-green-600`}
          >
            {buyRate.toFixed(4)}
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
            {rate.id === baseCurrency
              ? "Sell Rate"
              : `${rate.code}/${baseRate.code}`}
          </p>
          <p
            className={`font-mono ${
              isFavorite ? "text-lg" : "text-sm"
            } text-red-600`}
          >
            {(1 / sellRate).toFixed(4)}
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

function LoadingSkeletons() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {[...Array(8)].map((_, i) => (
        <Card key={i} className="p-4 border border-gray-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-7 w-24" />
            </div>

            <div className="space-y-1">
              <Skeleton className="h-4 w-16 mb-2" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
