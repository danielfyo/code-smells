// Production code: exchange-rate service that retries after a delay.
export interface RatesClient {
  getRate(currency: string): Promise<number>;
}

export function createExchangeService(client: RatesClient, retryDelayMs = 200) {
  return {
    async convert(amountEur: number, currency: string): Promise<number> {
      let rate: number;
      try {
        rate = await client.getRate(currency);
      } catch {
        await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
        rate = await client.getRate(currency);
      }
      return Math.round(amountEur * rate * 100) / 100;
    },
  };
}
