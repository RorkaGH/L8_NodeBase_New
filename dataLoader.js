const https = require('https');

// Универсальная функция загрузки данных
function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            resolve(json);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

async function loadData(url) {
  const state = {
    data: [],
    isLoading: true,
    error: null,
  };

  try {
    const json = await fetchJson(url);
    state.data = json;
    state.isLoading = false;
    return state;
  } catch (err) {
    state.error = err;
    state.isLoading = false;
    return state;
  }
}

module.exports = {
  loadData,
};

