const drop = document.getElementById("drop");
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const titleInput = document.getElementById("title");

let file = null;

// --- BLOQUER comportement par défaut ---
["dragenter", "dragover", "dragleave", "drop"].forEach(event => {
  drop.addEventListener(event, (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
});

// --- VISUEL DRAG ---
drop.addEventListener("dragover", () => {
  console.log("dragover");
  drop.classList.add("drag");
});

drop.addEventListener("dragleave", () => {
  console.log("dragleave");
  drop.classList.remove("drag");
});

// --- DROP ---
drop.addEventListener("drop", (e) => {
  console.log("DROP", e);
  drop.classList.remove("drag");

  const f = e.dataTransfer.files[0];
  handleFile(f);
});

// --- CLICK (fallback important) ---
drop.addEventListener("click", () => {
  console.log("click zone");
  fileInput.click();
});

// --- INPUT FILE ---
fileInput.addEventListener("change", () => {
  console.log("file input change");
  handleFile(fileInput.files[0]);
});

// --- GESTION FICHIER ---
function handleFile(f) {
  console.log("fichier reçu:", f);

  if (!f || !f.type.startsWith("image/")) {
    console.log("❌ fichier invalide");
    drop.textContent = "Fichier invalide";
    return;
  }

  file = f;

  const reader = new FileReader();
  reader.onload = () => {
    console.log("image convertie");

    preview.src = reader.result;
    preview.style.display = "block";
    drop.textContent = "Image OK";
  };

  reader.readAsDataURL(f);
}

// --- BOUTON ---
document.getElementById("save").addEventListener("click", async () => {
  console.log("CLICK VALIDER");

  if (!file) {
    console.log("❌ pas d'image");
    return;
  }

  const title = titleInput.value.trim();

  const reader = new FileReader();
  reader.onload = async () => {
    const imageData = reader.result;

    console.log("📡 envoi message");

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    chrome.tabs.sendMessage(tab.id, {
      image: imageData,
      title: title
    }, (res) => {
      console.log("réponse:", res);
      console.log("erreur:", chrome.runtime.lastError);
    });
  };

  reader.readAsDataURL(file);
});