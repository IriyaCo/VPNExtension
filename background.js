let isProxyEnabled = false;
let proxyUrl = "https://raw.githubusercontent.com/V2RAYCONFIGSPOOL/V2RAY_SUB/main/V2RAY_SUB.txt"; // Замените на URL вашего файла .txt

browser.browserAction.onClicked.addListener(() => {
  if (isProxyEnabled) {
    clearProxy();
    isProxyEnabled = false;
  } else {
    fetchProxyConfig(proxyUrl)
      .then(config => {
        setProxy(config.host, config.port, config.path);
        isProxyEnabled = true;
      })
      .catch(error => console.error("Ошибка получения конфигурации прокси:", error));
  }
});

function fetchProxyConfig(url) {
  return fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Ошибка HTTP: ${response.status}`);
      }
      return response.text();
    })
    .then(text => {
      const lines = text.split('\n');
      for (let line of lines) {
        if (line.startsWith("vless://")) {
          return parseVlessUrl(line); // Разбираем URL vless
        }
      }
      throw new Error("URL vless не найден в файле.");
    });
}

function parseVlessUrl(vlessUrl) {
  // Пример разбора URL vless:// (вам может потребоваться более сложный парсер)
  const parts = vlessUrl.replace("vless://", "").split("@");
  const uuidAndAddress = parts[0];
  const serverDetails = parts[1].split(":");
  const address = serverDetails[0];
  const port = serverDetails[1].split("?")[0]; // Обрабатываем параметры запроса
  const path = "/vless"; // Предполагаемый путь, измените при необходимости

  return {
    host: address,
    port: parseInt(port),
    path: path
  };
}

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
