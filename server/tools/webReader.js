import axios from 'axios';
import * as cheerio from 'cheerio';

/**
 * Real Web Reader and Scraper Tool
 * Fetches the target web page, strips scripts/styles/noise,
 * and extracts clean readable content, headings, and links.
 */
export async function readWebPage(url, options = {}) {
  const maxLength = options.maxLength || 4000;

  if (!url || typeof url !== 'string') {
    return {
      success: false,
      error: 'Invalid or missing URL parameter.'
    };
  }

  // Ensure URL has protocol
  let targetUrl = url.trim();
  if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
    targetUrl = 'https://' + targetUrl;
  }

  try {
    const response = await axios.get(targetUrl, {
      timeout: 12000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      maxRedirects: 5
    });

    const html = response.data;
    if (typeof html !== 'string') {
      return {
        success: false,
        error: 'Target URL did not return HTML text content.'
      };
    }

    const $ = cheerio.load(html);

    // Remove unwanted non-content elements
    $('script, style, noscript, svg, nav, footer, iframe, ads, [role="banner"], [role="navigation"]').remove();

    // Extract page metadata
    const title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || 'Untitled Page';
    const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';

    // Extract headings
    const headings = [];
    $('h1, h2, h3').each((i, el) => {
      if (headings.length < 8) {
        const text = $(el).text().trim();
        if (text && text.length > 3) headings.push(text);
      }
    });

    // Extract key outbound links
    const links = [];
    $('a[href]').each((i, el) => {
      if (links.length < 8) {
        const href = $(el).attr('href');
        const text = $(el).text().trim();
        if (href && text && !href.startsWith('#') && !href.startsWith('javascript:')) {
          links.push({ text: text.slice(0, 50), href: href.slice(0, 120) });
        }
      }
    });

    // Extract clean readable text
    let content = $('main, article, #content, .content, body').first().text();
    // Normalize whitespace
    content = content.replace(/\s+/g, ' ').trim();

    if (content.length > maxLength) {
      content = content.slice(0, maxLength) + '... [Content truncated for context window]';
    }

    return {
      success: true,
      url: targetUrl,
      title,
      description,
      headings,
      contentSnippet: content,
      charCount: content.length,
      linksSample: links
    };
  } catch (error) {
    return {
      success: false,
      url: targetUrl,
      error: `Failed to read web page: ${error.message}`
    };
  }
}
