const DBName = "dsAnnotateDB";
const DBVersion = 1;
let db;

export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DBName, DBVersion);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      db.createObjectStore("items", { autoIncrement: true });
      db.createObjectStore("encodeItems", { keyPath: "id" });
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve();
    };

    request.onerror = (event) => {
      reject("Database error: ", event.target.error);
    };
  });
};

class Store {
  constructor(storeName) {
    this.storeName = storeName;
  }

  transaction(mode) {
    return db.transaction(this.storeName, mode).objectStore(this.storeName);
  }

  addData(item) {
    console.log(item);
    return new Promise((resolve, reject) => {
      const request = this.transaction("readwrite").add(item);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  getAllData() {
    return new Promise((resolve, reject) => {
      const request = this.transaction("readonly").getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  deleteData(id) {
    return new Promise((resolve, reject) => {
      const request = this.transaction("readwrite").delete(id);
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  deleteAllData() {
    return new Promise((resolve, reject) => {
      const request = this.transaction("readwrite").clear();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  addListData(list) {
    return new Promise((resolve, reject) => {
      const store = this.transaction("readwrite");
      list.forEach((item) => store.add(item));
      store.transaction.oncomplete = () => resolve();
      store.transaction.onerror = () => reject(store.transaction.error);
    });
  }
}

export const storeItems = new Store("items");
export const storeEncodeItems = new Store("encodeItems");
