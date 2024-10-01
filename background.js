let isProxyEnabled = false;

browser.browserAction.onClicked.addListener(() => {
  if (isProxyEnabled) {
    clearProxy();
    isProxyEnabled = false;
  } else {
    setProxy("yourdomain.com", 443, "/vless"); // Replace with your actual server details
    isProxyEnabled = true;
  }
});

function setProxy(host, port, path) {
  browser.proxy.settings.set(
    {
      value: {
        mode: "fixed_servers",
        rules: {
          proxyForHttps: {
            scheme: "https",
            host: host,
            port: port
          },
          bypassList: ["<local>"]
        }
      }
    },
    () => {
      console.log(`Proxy settings applied: ${host}:${port}${path}`);
    }
  );
}

function clearProxy() {
  browser.proxy.settings.clear({}, () => {
    console.log("Proxy settings cleared.");
  });
}

// Optional: Listen for changes in proxy settings
browser.proxy.onError.addListener((error) => {
  console.error(`Proxy error: ${error.message}`);
});

