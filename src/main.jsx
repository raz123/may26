import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Detect stale cached bundle — force reload if version doesn't match
(function(){
  var VERSION = 'v7';
  var stored = sessionStorage.getItem('app_version');
  if (stored && stored !== VERSION) {
    sessionStorage.clear();
    location.reload(true);
    return;
  }
  sessionStorage.setItem('app_version', VERSION);
})();

// Catch and display runtime errors for debugging — auto-reload if stale bundle
window.addEventListener('error', function(e) {
  // If the error comes from an old cached bundle, force a fresh load
  if (e.filename && /index-(BEdNaBXa|D0JSevUK|Bus79q79)\.js/.test(e.filename)) {
    location.reload(true);
    return;
  }
  var el = document.getElementById('app-error');
  if (!el) {
    el = document.createElement('div');
    el.id = 'app-error';
    el.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#fee2e2;color:#991b1b;padding:12px 16px;font-family:monospace;font-size:12px;border-top:2px solid #ef4444;max-height:120px;overflow:auto';
    document.body.appendChild(el);
  }
  el.innerHTML = '<strong>Runtime Error:</strong> ' + (e.message || 'Unknown') + '<br><small>' + (e.filename || '') + ':' + (e.lineno || '') + ':' + (e.colno || '') + '</small>';
  el.innerHTML += '<br>' + (e.error ? (e.error.stack || '').split('\\n').slice(0,3).join('<br>') : '');
});

window.addEventListener('unhandledrejection', function(e) {
  var el = document.getElementById('app-error');
  if (!el) {
    el = document.createElement('div');
    el.id = 'app-error';
    el.style.cssText = 'position:fixed;bottom:0;left:0;right:0;z-index:99999;background:#fee2e2;color:#991b1b;padding:12px 16px;font-family:monospace;font-size:12px;border-top:2px solid #ef4444;max-height:120px;overflow:auto';
    document.body.appendChild(el);
  }
  el.innerHTML = '<strong>Unhandled Promise:</strong> ' + (e.reason?.message || String(e.reason || 'Unknown'));
});

createRoot(document.getElementById('app')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
