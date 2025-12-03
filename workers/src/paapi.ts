/**
 * Amazon Product Advertising API (PA-API) クライアント
 *
 * 使用するには以下の環境変数が必要:
 * - AMAZON_ACCESS_KEY
 * - AMAZON_SECRET_KEY
 * - AMAZON_PARTNER_TAG
 *
 * 参考: https://webservices.amazon.co.jp/paapi5/documentation/
 */

export interface PAAPIConfig {
  accessKey: string;
  secretKey: string;
  partnerTag: string;
  host?: string;
  region?: string;
}

export interface BookInfo {
  asin: string;
  title: string;
  author: string;
  imageUrl: string;
  detailPageUrl: string;
}

/**
 * PA-APIで書籍を検索
 * TODO: 実装
 */
export async function searchBooks(
  _config: PAAPIConfig,
  _keywords: string,
  _itemCount = 10
): Promise<BookInfo[]> {
  // PA-API v5 SearchItems API を呼ぶ
  // 署名の生成が必要（AWS Signature v4）

  // 仮実装
  console.log("PA-API searchBooks: not implemented yet");
  return [];
}

/**
 * PA-APIでASINから書籍情報を取得
 * TODO: 実装
 */
export async function getBooksByAsins(
  _config: PAAPIConfig,
  _asins: string[]
): Promise<BookInfo[]> {
  // PA-API v5 GetItems API を呼ぶ

  // 仮実装
  console.log("PA-API getBooksByAsins: not implemented yet");
  return [];
}

/**
 * アフィリエイトリンクを生成
 */
export function generateAffiliateLink(asin: string, partnerTag: string): string {
  return `https://www.amazon.co.jp/dp/${asin}?tag=${partnerTag}`;
}
