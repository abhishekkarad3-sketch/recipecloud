/**
 * Parse text and convert URLs to clickable links
 * Returns an array of text and link components
 */
export function parseLinksInText(text: string): (string | { type: 'link'; url: string; label: string })[] {
  if (!text) return [];

  // Regex to match URLs (http, https, www, and other common protocols)
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+|ftp:\/\/[^\s]+)/gi;
  
  const parts: (string | { type: 'link'; url: string; label: string })[] = [];
  let lastIndex = 0;
  let match;

  // Reset regex lastIndex
  urlRegex.lastIndex = 0;

  while ((match = urlRegex.exec(text)) !== null) {
    // Add text before the link
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    let url = match[0];
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('ftp://')) {
      url = 'https://' + url;
    }

    parts.push({
      type: 'link',
      url,
      label: match[0], // Show original URL as label
    });

    lastIndex = urlRegex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
}
