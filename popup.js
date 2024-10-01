document.getElementById('connectBtn').addEventListener('click', () => {
  browser.runtime.getBackgroundPage().then((bg) => {
    bg.setProxy("yourdomain.com", 443, "/vless");
  });
});

document.getElementById('disconnectBtn').addEventListener('click', () => {
  browser.runtime.getBackgroundPage().then((bg) => {
    bg.clearProxy();
  });
});

