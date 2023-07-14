const DBName = "dsAnnotateDB";
const DBVersion = 1;
let db;

export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DBName, DBVersion);

    request.onupgradeneeded = (event) => {
      db = event.target.result;
      //Items
      const objectStoreItems = db.createObjectStore("items", { keyPath: "id" });
      objectStoreItems.createIndex("project", "project", { unique: false });
      //Encode images Items
      const objectStoreEncodeItems = db.createObjectStore("encodeItems", {
        keyPath: "id",
      });
      objectStoreEncodeItems.createIndex("project", "project", {
        unique: false,
      });
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

  getDataByProject(project) {
    return new Promise((resolve, reject) => {
      const store = this.transaction("readonly");
      const index = store.index("project");
      const request = index.getAll(IDBKeyRange.only(project));
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

  deleteDataByProject(project) {
    return new Promise((resolve, reject) => {
      const store = this.transaction("readwrite");
      const index = store.index("project");

      const request = index.openCursor(IDBKeyRange.only(project));
      request.onsuccess = () => {
        const cursor = request.result;
        if (cursor) {
          store.delete(cursor.primaryKey);
          cursor.continue();
        } else {
          resolve();
        }
      };
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
