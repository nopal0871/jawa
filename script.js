// Fungsi kanggo tampilno log nang layar
function logToScreen(message, type = 'info') {
  const logDiv = document.getElementById('debugLog');
  if (!logDiv) {
    const newLog = document.createElement('div');
    newLog.id = 'debugLog';
    newLog.style.cssText = 'margin-top:10px;padding:10px;background:#1a1a24;border:1px solid #2a2a3a;border-radius:8px;font-family:monospace;font-size:12px;max-height:200px;overflow:auto;';
    document.querySelector('.container').appendChild(newLog);
  }
  
  const log = document.getElementById('debugLog');
  const timestamp = new Date().toLocaleTimeString();
  const color = type === 'error' ? '#ff6b6b' : type === 'success' ? '#51cf66' : '#74c0fc';
  log.innerHTML += `<div style="color:${color};margin:5px 0;">[${timestamp}] ${message}</div>`;
  log.scrollTop = log.scrollHeight;
}

// Clear log lama
logToScreen('🚀 Starting download...', 'info');

document.getElementById("downloadForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const url = document.getElementById("urlInput").value;
  const type = document.querySelector('input[name="type"]:checked').value;
  const status = document.getElementById("status");
  const result = document.getElementById("result");
  
  logToScreen(`📤 URL: ${url}`);
  logToScreen(` Format: ${type}`);
  logToScreen(`🌐 Backend: ${API_BASE}/download`);
  
  status.textContent = "🔄 Lagi proses, sabar bangsat...";
  status.classList.remove("hidden");
  result.classList.add("hidden");
  
  try {
    logToScreen('⏳ Sending request...');
    
    const res = await fetch(`${API_BASE}/download`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({ url, format: type })
    });
    
    logToScreen(`📥 Response: ${res.status} ${res.statusText}`);
    
    if (!res.ok) {
      const errorText = await res.text();
      logToScreen(`❌ Error response: ${errorText}`, 'error');
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    
    logToScreen('✅ Download success! Preparing file...');
    
    const blob = await res.blob();
    logToScreen(`📦 File size: ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
    
    const downloadUrl = window.URL.createObjectURL(blob);
    
    status.classList.add("hidden");
    
    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = downloadUrl;
    downloadLink.download = `download_${Date.now()}.mp4`;
    downloadLink.textContent = "⬇️ KLIK KENE NGGO DOWNLOAD";
    downloadLink.style.cssText = 'display:block;padding:15px;background:#51cf66;color:#000;text-align:center;text-decoration:none;border-radius:8px;font-weight:bold;margin:10px 0;';
    
    result.classList.remove("hidden");
    logToScreen('✅ File siap download!', 'success');
    
  } catch (err) {
    logToScreen(`💔 ERROR: ${err.message}`, 'error');
    logToScreen(`🔍 Detail: ${err.stack || 'No stack'}`, 'error');
    status.textContent = `💔 Error: ${err.message}`;
    status.classList.remove("hidden");
    result.classList.add("hidden");
  }
});});
