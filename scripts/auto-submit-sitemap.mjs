#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import https from 'https';

const HOST = 'geminiwatermarkai.online';
const KEY = '5f6f85bcda81922cc05e8b0b6c702589';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

function extractUrlsFromSitemap() {
  const possiblePaths = [
    path.resolve(process.cwd(), 'out/sitemap.xml'),
    path.resolve(process.cwd(), 'public/sitemap.xml'),
  ];

  let xmlContent = '';
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      xmlContent = fs.readFileSync(p, 'utf-8');
      break;
    }
  }

  if (!xmlContent) {
    console.log('[Auto-Sitemap] No sitemap.xml found on disk, using fallback defaults.');
    return [
      `https://${HOST}/`,
      `https://${HOST}/zh`,
      `https://${HOST}/ja`,
      `https://${HOST}/es`,
      `https://${HOST}/de`,
      `https://${HOST}/fr`,
      `https://${HOST}/pt`,
      `https://${HOST}/ko`,
      `https://${HOST}/blog`,
    ];
  }

  const matches = xmlContent.match(/<loc>(.*?)<\/loc>/g) || [];
  const urls = matches.map((m) => m.replace(/<\/?loc>/g, '').trim());
  return Array.from(new Set(urls));
}

function submitToIndexNow(endpoint, urls) {
  return new Promise((resolve) => {
    const payload = JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: KEY_LOCATION,
      urlList: urls,
    });

    const urlObj = new URL(endpoint);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Length': Buffer.byteLength(payload),
      },
      timeout: 10000,
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        console.log(`[Auto-Sitemap] ${endpoint} -> HTTP ${res.statusCode} (${urls.length} URLs submitted)`);
        resolve(res.statusCode);
      });
    });

    req.on('error', (err) => {
      console.warn(`[Auto-Sitemap Warning] Request to ${endpoint} failed:`, err.message);
      resolve(null);
    });

    req.on('timeout', () => {
      req.destroy();
      console.warn(`[Auto-Sitemap Warning] Request to ${endpoint} timed out.`);
      resolve(null);
    });

    req.write(payload);
    req.end();
  });
}

async function main() {
  console.log(`[Auto-Sitemap] 🚀 Triggering automatic sitemap & URL broadcast for ${HOST}...`);
  const urls = extractUrlsFromSitemap();
  console.log(`[Auto-Sitemap] Discovered ${urls.length} canonical URLs from sitemap.`);

  await Promise.all([
    submitToIndexNow('https://api.indexnow.org/indexnow', urls),
    submitToIndexNow('https://www.bing.com/indexnow', urls),
  ]);

  console.log(`[Auto-Sitemap] ✅ All sitemap URLs broadcasted successfully.`);
}

main().catch((err) => {
  console.error('[Auto-Sitemap Error]', err);
});
