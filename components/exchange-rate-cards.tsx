"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isWeekend, previousFriday } from "date-fns";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import ExchangeRateCard from "./exchange-rate-card";
import { LastUpdated } from "./last-updated-card";
import LoadingSkeletons from "./loading-skeletons";

export interface ExchangeRate {
  id: string;
  currency: string;
  code: string;
  buyRate: number;
  sellRate: number;
}

interface ExchangeRateResponse {
  CurrCode: string;
  CurrName: string;
  ODBUY: string;
  Order: string;
  RateType: string;
  RateWEF: string;
  SplRemarks: string;
  TTBUY: string;
  TTSEL: string;
}

const SRI_LANKAN_RUPEE = {
  id: "LKR",
  currency: "Sri Lankan Rupee",
  code: "LKR",
  buyRate: 1,
  sellRate: 1,
  fetchedDate: new Date(),
};

export default function ExchangeRateCards() {
  const [rates, setRates] = useState<ExchangeRate[]>([SRI_LANKAN_RUPEE]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [baseCurrency, setBaseCurrency] = useState<string>("LKR");
  const [lastUpdated, setLastUpdated] = useState<Date>();

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favoriteRates");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    const savedRates = localStorage.getItem("rates");

    if (savedRates) {
      const cachedRates = JSON.parse(savedRates);
      const cachedDate = new Date(cachedRates[0].fetchedDate);
      const currentDate = isWeekend(new Date())
        ? previousFriday(new Date())
        : new Date();

      if (cachedDate.getDate() !== currentDate.getDate()) {
        fetchExchangeRates();
      } else {
        setRates(cachedRates);
        setLastUpdated(cachedDate);
        setLoading(false);
      }
    } else {
      fetchExchangeRates();
    }
  }, []);

  const fetchExchangeRates = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://exchange-rate-api-m50a.onrender.com/"
      );
      const result = await response.json();

      const ratesData = result.data.map((rate: ExchangeRateResponse) => ({
        id: rate.CurrCode,
        currency: rate.CurrName,
        code: rate.CurrCode,
        buyRate: parseFloat(rate.TTBUY),
        sellRate: parseFloat(rate.TTSEL),
        fetchedDate: new Date(result.data[0].RateWEF),
      }));

      const ratesDataWithLKR = [...ratesData, SRI_LANKAN_RUPEE];

      setRates(ratesDataWithLKR);
      setLastUpdated(ratesData[0].fetchedDate);
      localStorage.setItem("rates", JSON.stringify(ratesDataWithLKR));
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
  const selectedCurrency =
    rates.find((rate) => rate.id === baseCurrency) || SRI_LANKAN_RUPEE;

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
      <div>
        <LastUpdated date={lastUpdated} showTime={true} variant="default" />
      </div>

      <div className="mb-10 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
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
