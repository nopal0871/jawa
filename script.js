// PASTIKAN URL KIYE BENER!
const API_BASE = "https://back-2ujo.vercel.app"; // ← URL backend-mu

document.getElementById("downloadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const url = document.getElementById("urlInput").value;
  const type = document.querySelector('input[name="type"]:checked').value;
  const status = document.getElementById("status");
  const result = document.getElementById("result");
  
  console.log("🔥 Sending request to:", `${API_BASE}/download`);
  console.log("📦 Data:", { url, format: type });
  
  status.textContent = "🔄 Lagi proses, sabar bangsat...";
  status.classList.remove("hidden");
  result.classList.add("hidden");
  
  try {
    const res = await fetch(`${API_BASE}/download`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ url, format: type })
    });
    
    console.log("📥 Response status:", res.status);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP ${res.status}: ${res.statusText}`);
    }
    
    // Get blob from response
    const blob = await res.blob();
    console.log("📦 Blob size:", blob.size);
    
    // Create download URL
    const downloadUrl = window.URL.createObjectURL(blob);
    
    // Get filename from headers or generate one
    const contentDisposition = res.headers.get('content-disposition');
    let filename = 'download.mp4';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
      if (filenameMatch && filenameMatch[1]) {
        filename = filenameMatch[1];
      }
    }
    
    status.classList.add("hidden");
    
    // Set download link
    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = downloadUrl;
    downloadLink.download = filename;
    downloadLink.textContent = `⬇️ Download ${filename}`;
    
    result.classList.remove("hidden");
    
    // Cleanup after 5 minutes
    setTimeout(() => {
      window.URL.revokeObjectURL(downloadUrl);
    }, 300000);
    
  } catch (err) {
    console.error("❌ Error:", err);
    status.textContent = `💔 Error: ${err.message}. Cek console (F12)!`;
    status.classList.remove("hidden");
    result.classList.add("hidden");
  }
});
