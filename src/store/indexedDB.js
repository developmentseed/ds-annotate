export const openDB = (tableName) => {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open("dsAnnotateDB", 1);
    request.onerror = (event) => {
      reject(event.target.error);
    };
    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(tableName)) {
        const objectStore = db.createObjectStore(tableName, {
          keyPath: "id",
        });
        objectStore.createIndex("idIndex", "id", { unique: false });
      }
    };
  });
};

export const addData = (db, tableName, data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName], "readwrite");
    const objectStore = transaction.objectStore(tableName);
    const addRequest = objectStore.add(data);
    addRequest.onsuccess = (event) => {
      resolve();
    };
    addRequest.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const getAllData = (db, tableName) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName]);
    const objectStore = transaction.objectStore(tableName);
    const getAllRequest = objectStore.getAll();
    getAllRequest.onsuccess = (event) => {
      const result = event.target.result;
      resolve(result);
    };
    getAllRequest.onerror = (event) => {
      console.log(event);
      reject(event.target.error);
    };
  });
};

export const deleteData = (db, tableName, key) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([tableName], "readwrite");
    const objectStore = transaction.objectStore(tableName);
    const deleteRequest = objectStore.delete(key);
    deleteRequest.onsuccess = (event) => {
      resolve();
    };
    deleteRequest.onerror = (event) => {
      reject(event.target.error);
    };
  });
};
