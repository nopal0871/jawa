const API_BASE = "https://back-2ujo.vercel.app"; // GANTI KENE!

document.getElementById("downloadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const url = document.getElementById("urlInput").value;
  const type = document.querySelector('input[name="type"]:checked').value;
  const status = document.getElementById("status");
  const result = document.getElementById("result");
  
  status.textContent = "🔄 Lagi proses, sabar bangsat...";
  status.classList.remove("hidden");
  result.classList.add("hidden");
  
  try {
    const res = await fetch(`${API_BASE}/download`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, format: type })
    });
    
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    
    const blob = await res.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    
    status.classList.add("hidden");
    document.getElementById("downloadLink").href = downloadUrl;
    result.classList.remove("hidden");
  } catch (err) {
    status.textContent = `💔 Error: ${err.message}. Cek backend URL!`;
    status.classList.remove("hidden");
    console.error('Error:', err);
  }
});
