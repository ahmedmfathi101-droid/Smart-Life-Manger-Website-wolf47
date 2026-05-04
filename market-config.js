// Market API configuration.
// Fiat provider: ExchangeRate-API open endpoint. It is free/no-key but updates daily.
// Gold provider: gold-api.com free endpoint for XAU/USD realtime price.

window.lifeOSMarket = {
  enabled: true,
  fiatUrl: "https://open.er-api.com/v6/latest/USD",
  goldUrl: "https://api.gold-api.com/price/XAU",
  egyptGoldPremiumRate: 0.04,
  currencyCodes: ["USD", "SAR", "KWD", "AED", "EUR", "GBP"]
};
