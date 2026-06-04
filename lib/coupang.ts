import crypto from 'crypto';

function generateHmac(method: string, url: string, secretKey: string, accessKey: string): string {
  const parts = url.split(/\?/);
  const [path, query = ''] = parts;

  const datetime = new Date().toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z/, 'Z')
    .slice(2, 15) + 'Z';

  const message = datetime + method + path + query;

  const signature = crypto.createHmac('sha256', secretKey)
    .update(message)
    .digest('hex');

  return `CEA algorithm=HmacSHA256, access-key=${accessKey}, signed-date=${datetime}, signature=${signature}`;
}

const DOMAIN = 'https://api-gateway.coupang.com';
const ACCESS_KEY = process.env.COUPANG_ACCESS_KEY!;
const SECRET_KEY = process.env.COUPANG_SECRET_KEY!;

// 상품 검색
export async function searchProducts(keyword: string, limit: number = 5) {
  const path = `/v2/providers/affiliate_open_api/apis/openapi/v1/products/search`;
  const query = `keyword=${encodeURIComponent(keyword)}&limit=${limit}`;
  const url = `${path}?${query}`;

  const authorization = generateHmac('GET', url, SECRET_KEY, ACCESS_KEY);

  const response = await fetch(`${DOMAIN}${url}`, {
    method: 'GET',
    headers: { Authorization: authorization },
  });

  if (response.status === 429) throw new Error('API_RATE_LIMIT');
  if (!response.ok) throw new Error(`API_ERROR: ${response.status}`);

  const data = await response.json();
  return data.data?.productData || [];
}

// 딥링크 변환
export async function convertDeeplink(urls: string[]): Promise<string[]> {
  const path = `/v2/providers/affiliate_open_api/apis/openapi/v1/deeplink`;
  const authorization = generateHmac('POST', path, SECRET_KEY, ACCESS_KEY);

  const response = await fetch(`${DOMAIN}${path}`, {
    method: 'POST',
    headers: {
      Authorization: authorization,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ coupangUrls: urls }),
  });

  if (response.status === 429) throw new Error('API_RATE_LIMIT');
  if (!response.ok) throw new Error(`API_ERROR: ${response.status}`);

  const data = await response.json();
  return data.data?.map((d: any) => d.shortenUrl) || [];
}

// 딜레이 함수 (API 호출 간격 조절)
export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}