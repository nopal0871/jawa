// script.js - Fetch ke backend API
const API_BASE = "https://back-2ujo.vercel.app"; // GANTI URL BACKEND MU

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
    const data = await res.json();
    
    if (data.error) throw new Error(data.error);
    
    status.classList.add("hidden");
    document.getElementById("downloadLink").href = data.download_url;
    result.classList.remove("hidden");
  } catch (err) {
    status.textContent = `💔 Error: ${err.message}`;
    status.classList.remove("hidden");
  }
});
