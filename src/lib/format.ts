const MARKET_PRICE_FACTORS: Record<string, number> = {
  Electronics: 11,
  Fashion: 10,
  Beauty: 10,
  Home: 10.5,
  default: 10,
};

export const getMarketAdjustedPrice = (baseCents: number, productType?: string): number => {
  const factor = MARKET_PRICE_FACTORS[productType || ''] ?? MARKET_PRICE_FACTORS.default;
  const adjusted = Math.round((baseCents || 0) * factor);
  return Math.max(adjusted, 75000);
};

export const formatPrice = (cents: number): string => {
  return `KSh ${((cents || 0) / 100).toFixed(2)}`;
};

export const PROJECT_ID = '6a2502df6d2d5ba36acdc0a1';
export const SHIPPING_RULES = 'Free shipping on all orders';
