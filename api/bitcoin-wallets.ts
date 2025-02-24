import { getBtcPriceUsd, parseRichListHtml, getFallbackWallets } from '../src/data/bitcoinWalletsData';

export default async function handler(req: any, res: any) {
  try {
    const btcPrice = await getBtcPriceUsd();
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const bitinfoUrl = "https://bitinfocharts.com/top-100-richest-bitcoin-addresses.html";
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Cache-Control": "max-age=0"
    };

    try {
      const response = await fetch(bitinfoUrl, { headers, signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Response status code ${response.status}`);
      }

      const htmlText = await response.text();
      const parsedWallets = parseRichListHtml(htmlText, btcPrice);
      
      if (parsedWallets.length > 10) {
        return res.status(200).json({
          source: "live",
          btcPrice,
          wallets: parsedWallets
        });
      } else {
        throw new Error("Scraped data was incomplete");
      }

    } catch (scrapeErr) {
      const fallbackWallets = getFallbackWallets(btcPrice);
      return res.status(200).json({
        source: "cached",
        btcPrice,
        wallets: fallbackWallets
      });
    }

  } catch (err: any) {
    const fallbackWallets = getFallbackWallets(65000);
    return res.status(200).json({
      source: "cached",
      btcPrice: 65000,
      wallets: fallbackWallets
    });
  }
}
