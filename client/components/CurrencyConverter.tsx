import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpDown,
  DollarSign,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Calculator,
  Clock,
  AlertTriangle,
  Info,
} from "lucide-react";

import { cn } from "@/lib/utils";

// Major trading currencies
const CURRENCIES = [
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳" },
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "���🇬" },
  { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰" },
  { code: "SEK", name: "Swedish Krona", symbol: "kr", flag: "🇸🇪" },
  { code: "NOK", name: "Norwegian Krone", symbol: "kr", flag: "🇳🇴" },
  { code: "DKK", name: "Danish Krone", symbol: "kr", flag: "🇩🇰" },
  { code: "MXN", name: "Mexican Peso", symbol: "$", flag: "🇲🇽" },
  { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷" },
  { code: "ZAR", name: "South African Rand", symbol: "R", flag: "🇿🇦" },
  { code: "KRW", name: "South Korean Won", symbol: "₩", flag: "🇰🇷" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
];

// Mock exchange rates - in real app this would come from an API
const MOCK_RATES = {
  USD: 1.0,
  EUR: 0.85,
  GBP: 0.73,
  JPY: 110.0,
  CNY: 6.45,
  INR: 74.5,
  CAD: 1.25,
  AUD: 1.35,
  CHF: 0.92,
  SGD: 1.35,
  HKD: 7.85,
  SEK: 8.75,
  NOK: 8.5,
  DKK: 6.35,
  MXN: 20.5,
  BRL: 5.2,
  ZAR: 14.8,
  KRW: 1180,
  THB: 33.5,
  AED: 3.67,
};

interface CurrencyConverterProps {
  defaultFrom?: string;
  defaultTo?: string;
  defaultAmount?: number;
  onConvert?: (result: ConversionResult) => void;
  className?: string;
  compact?: boolean;
}

interface ConversionResult {
  fromAmount: number;
  fromCurrency: string;
  toAmount: number;
  toCurrency: string;
  rate: number;
  timestamp: Date;
}

export function CurrencyConverter({
  defaultFrom = "USD",
  defaultTo = "EUR",
  defaultAmount = 1000,
  onConvert,
  className,
  compact = false,
}: CurrencyConverterProps) {
  const [fromCurrency, setFromCurrency] = useState(defaultFrom);
  const [toCurrency, setToCurrency] = useState(defaultTo);
  const [amount, setAmount] = useState(defaultAmount.toString());
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    handleConversion();
  }, [fromCurrency, toCurrency, amount]);

  const handleConversion = async () => {
    if (!amount || isNaN(Number(amount))) return;

    setLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const fromRate = MOCK_RATES[fromCurrency as keyof typeof MOCK_RATES] || 1;
    const toRate = MOCK_RATES[toCurrency as keyof typeof MOCK_RATES] || 1;
    const rate = toRate / fromRate;
    const convertedAmount = Number(amount) * rate;

    const conversionResult: ConversionResult = {
      fromAmount: Number(amount),
      fromCurrency,
      toAmount: convertedAmount,
      toCurrency,
      rate,
      timestamp: new Date(),
    };

    setResult(conversionResult);
    setLastUpdated(new Date());
    setLoading(false);

    if (onConvert) {
      onConvert(conversionResult);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const formatCurrency = (amount: number, currencyCode: string) => {
    const currency = CURRENCIES.find((c) => c.code === currencyCode);
    const symbol = currency?.symbol || currencyCode;

    return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits:
        currencyCode === "JPY" || currencyCode === "KRW" ? 0 : 2,
      maximumFractionDigits:
        currencyCode === "JPY" || currencyCode === "KRW" ? 0 : 2,
    }).format(amount);
  };

  const getRateChange = () => {
    // Mock rate change data
    const change = (Math.random() - 0.5) * 0.1;
    return {
      percentage: change,
      isPositive: change > 0,
    };
  };

  const rateChange = getRateChange();

  if (compact) {
    return (
      <Card className={cn("border-dashed", className)}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Quick Converter</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                  className="text-center"
                />
              </div>
              <div className="flex items-center gap-1">
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>{currency.code}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Button variant="ghost" size="sm" onClick={swapCurrencies}>
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="text-center">
                {result && (
                  <div
                    className={cn("text-lg font-bold", loading && "opacity-50")}
                  >
                    {formatCurrency(result.toAmount, toCurrency)}
                  </div>
                )}
              </div>
              <div>
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center gap-2">
                          <span>{currency.flag}</span>
                          <span>{currency.code}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {result && (
              <div className="text-xs text-muted-foreground text-center">
                Rate: 1 {fromCurrency} ={" "}
                {formatCurrency(result.rate, toCurrency)} {toCurrency}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" title="Live exchange rates updated every minute. Bank rates may vary slightly.">
          <DollarSign className="h-5 w-5" />
          Currency Converter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* From Currency */}
        <div className="space-y-2">
          <Label htmlFor="from-amount">From</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                id="from-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                className={cn("text-lg", loading && "opacity-50")}
              />
            </div>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <div>
                        <div className="font-medium">{currency.code}</div>
                        <div className="text-xs text-muted-foreground">
                          {currency.name}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={swapCurrencies}
            className="rounded-full p-2"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
        </div>

        {/* To Currency */}
        <div className="space-y-2">
          <Label htmlFor="to-amount">To</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <div
                className={cn(
                  "h-10 px-3 py-2 bg-muted rounded-md flex items-center text-lg font-medium",
                  loading && "opacity-50",
                )}
              >
                {result ? formatCurrency(result.toAmount, toCurrency) : "0.00"}
                {loading && <RefreshCw className="ml-2 h-4 w-4 animate-spin" />}
              </div>
            </div>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((currency) => (
                  <SelectItem key={currency.code} value={currency.code}>
                    <div className="flex items-center gap-2">
                      <span>{currency.flag}</span>
                      <div>
                        <div className="font-medium">{currency.code}</div>
                        <div className="text-xs text-muted-foreground">
                          {currency.name}
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Exchange Rate Info */}
        {result && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Exchange Rate
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  1 {fromCurrency} = {formatCurrency(result.rate, toCurrency)}{" "}
                  {toCurrency}
                </span>
                <div
                  className={cn(
                    "flex items-center gap-1 text-xs",
                    rateChange.isPositive ? "text-green-600" : "text-red-600",
                  )}
                >
                  {rateChange.isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {Math.abs(rateChange.percentage * 100).toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
              <Button variant="ghost" size="sm" onClick={handleConversion}>
                <RefreshCw className="h-3 w-3" />
              </Button>
            </div>

            {/* Rate Alert */}
            <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-xs">
                <p className="font-medium text-orange-900 dark:text-orange-200">
                  Bank Rate Disclaimer
                </p>
                <p className="text-orange-700 dark:text-orange-300 mt-1">
                  Final exchange rate may vary based on your bank's conversion
                  rates and fees. This rate is for reference only.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Quick Amount Buttons */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Quick Amounts</Label>
          <div className="flex gap-2 flex-wrap">
            {[100, 500, 1000, 5000, 10000].map((quickAmount) => (
              <Button
                key={quickAmount}
                variant="outline"
                size="sm"
                onClick={() => setAmount(quickAmount.toString())}
                className="text-xs"
              >
                {formatCurrency(quickAmount, fromCurrency)}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Currency selector component for forms
interface CurrencySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  showFlag?: boolean;
}

export function CurrencySelector({
  value,
  onValueChange,
  className,
  showFlag = true,
}: CurrencySelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {CURRENCIES.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            <div className="flex items-center gap-2">
              {showFlag && <span>{currency.flag}</span>}
              <span className="font-medium">{currency.code}</span>
              <span className="text-muted-foreground">- {currency.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// Price display component with currency conversion
interface PriceDisplayProps {
  amount: number;
  currency: string;
  showConverter?: boolean;
  userCurrency?: string;
  className?: string;
}

export function PriceDisplay({
  amount,
  currency,
  showConverter = true,
  userCurrency = "USD",
  className,
}: PriceDisplayProps) {
  const [showConversion, setShowConversion] = useState(false);

  const formatPrice = (value: number, currencyCode: string) => {
    const currencyInfo = CURRENCIES.find((c) => c.code === currencyCode);
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits:
        currencyCode === "JPY" || currencyCode === "KRW" ? 0 : 2,
    }).format(value);
  };

  const convertPrice = (value: number, from: string, to: string) => {
    const fromRate = MOCK_RATES[from as keyof typeof MOCK_RATES] || 1;
    const toRate = MOCK_RATES[to as keyof typeof MOCK_RATES] || 1;
    return value * (toRate / fromRate);
  };

  const convertedAmount = convertPrice(amount, currency, userCurrency);

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <span className="font-semibold">{formatPrice(amount, currency)}</span>

      {showConverter && currency !== userCurrency && (
        <Badge variant="secondary" className="text-xs cursor-help">
          ≈ {formatPrice(convertedAmount, userCurrency)}
        </Badge>
        /* <ContextualTooltip
          content={
            <div className="space-y-1">
              <div>Converted to {userCurrency}:</div>
              <div className="font-medium">
                {formatPrice(convertedAmount, userCurrency)}
              </div>
              <div className="text-xs text-muted-foreground">
                Rate may vary at checkout
              </div>
            </div>
          }
          type="info"
          side="top"
        >
          <Badge variant="secondary" className="text-xs cursor-help">
            ≈ {formatPrice(convertedAmount, userCurrency)}
          </Badge>
        </ContextualTooltip> */
      )}
    </div>
  );
}

// Hook for currency conversion
export function useCurrencyConverter() {
  const [rates, setRates] = useState(MOCK_RATES);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const convert = (amount: number, from: string, to: string) => {
    const fromRate = rates[from as keyof typeof rates] || 1;
    const toRate = rates[to as keyof typeof rates] || 1;
    return amount * (toRate / fromRate);
  };

  const getRate = (from: string, to: string) => {
    const fromRate = rates[from as keyof typeof rates] || 1;
    const toRate = rates[to as keyof typeof rates] || 1;
    return toRate / fromRate;
  };

  const refreshRates = async () => {
    // In real app, this would fetch from API
    setLastUpdated(new Date());
  };

  return {
    rates,
    lastUpdated,
    convert,
    getRate,
    refreshRates,
  };
}
