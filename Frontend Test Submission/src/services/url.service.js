const STORAGE_KEY = "shortUrlsDb";
function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}
function getAllUrls() {
  const urls = localStorage.getItem(STORAGE_KEY);
  return urls ? JSON.parse(urls) : {};
}
function saveAllUrls(urlsDb) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(urlsDb));
}
export const urlService = {
  createShortUrl: (longUrl, customCode, expiryMinutes) => {
    const urlsDb = getAllUrls();
    let shortCode = customCode;

    if (shortCode) {
      if (urlsDb[shortCode]) {
        throw new Error("This custom shortcode is already taken.");
      }
    } else {
      do {
        shortCode = generateShortCode();
      } while (urlsDb[shortCode]); 
    }

    let expiresAt = null;
    if (expiryMinutes && !isNaN(expiryMinutes)) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + parseInt(expiryMinutes, 10));
      expiresAt = now.toISOString();
    }

    const newUrlEntry = {
      shortCode: shortCode,
      longUrl: longUrl,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt,
      clicks: 0,
    };

    urlsDb[shortCode] = newUrlEntry;
    saveAllUrls(urlsDb);

    return newUrlEntry;
  },
  getUrlByCode: (shortCode) => {
    const urlsDb = getAllUrls();
    return urlsDb[shortCode] || null;
  },
  incrementClickCount: (shortCode) => {
    const urlsDb = getAllUrls();
    const urlEntry = urlsDb[shortCode];

    if (urlEntry) {
      urlEntry.clicks += 1;
      saveAllUrls(urlsDb);
      return urlEntry;
    }
    return null;
  },
  getAllUrlsAsArray: () => {
    const urlsDb = getAllUrls();
    return Object.values(urlsDb).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};