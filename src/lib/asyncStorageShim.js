const store = new Map();

const asyncStorageShim = {
  async setItem(key, value) {
    store.set(key, value);
    return null;
  },
  async getItem(key) {
    return store.has(key) ? store.get(key) : null;
  },
  async removeItem(key) {
    store.delete(key);
    return null;
  },
  async clear() {
    store.clear();
    return null;
  },
};

module.exports = asyncStorageShim;
module.exports.default = asyncStorageShim;


