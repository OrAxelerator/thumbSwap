chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {

  if (!msg.image) {
    return;
  }

  const thumbnails = Array.from(document.querySelectorAll("img"))
    .filter(img => img.src.includes("ytimg.com"));


  if (thumbnails.length === 0) {
    return;
  }

  const first12 = thumbnails.slice(0, 12);

  const randomImg = first12[Math.floor(Math.random() * first12.length)];
  console.log("🎯 image choisie:", randomImg);

  randomImg.src = msg.image;
randomImg.style.objectFit = "contain";
randomImg.style.width = "100%";
randomImg.style.height = "100%";

// sécurise le container
const parent = randomImg.closest("ytd-thumbnail");
if (parent) {
  parent.style.overflow = "hidden";
}
  const container = randomImg.closest("ytd-rich-item-renderer, ytd-video-renderer");

  if (!container) {
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