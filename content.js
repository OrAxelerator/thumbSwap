chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("📥 message reçu:", msg);

  if (!msg.image) {
    console.log("❌ pas d'image dans msg");
    return;
  }

  const thumbnails = Array.from(document.querySelectorAll("img"))
    .filter(img => img.src.includes("ytimg.com"));

  console.log("🔍 thumbnails trouvées:", thumbnails.length);

  if (thumbnails.length === 0) {
    console.log("❌ aucune miniature trouvée");
    return;
  }

  const first12 = thumbnails.slice(0, 12);
  console.log("📦 first12:", first12.length);

  const randomImg = first12[Math.floor(Math.random() * first12.length)];
  console.log("🎯 image choisie:", randomImg);

  randomImg.src = msg.image;
  console.log("✅ image remplacée");

  const container = randomImg.closest("ytd-rich-item-renderer, ytd-video-renderer");
  console.log("📦 container:", container);

  if (!container) {
    console.log("❌ container introuvable");
    return;
  }

  const titleEl = container.querySelector("#video-title, h3 a");
  console.log("🔎 titleEl:", titleEl);

  if (titleEl && msg.title) {
    titleEl.textContent = msg.title;
    titleEl.title = msg.title;
    console.log("✅ titre remplacé");
  } else {
    console.log("⚠️ titre non modifié");
  }

  sendResponse({ ok: true });
});