// Модуль, который экспортирует функцию сортировки строк без учёта пробелов
// Пример: ["b a", "aa"] -> ["aa", "b a"]

function normalize(str) {
  return str.replace(/\s+/g, '').toLowerCase();
}

function sortStringsIgnoringSpaces(strings) {
  return [...strings].sort((a, b) => {
    const na = normalize(a);
    const nb = normalize(b);
    if (na < nb) return -1;
    if (na > nb) return 1;
    return 0;
  });
}

module.exports = {
  sortStringsIgnoringSpaces,
};

