export const openDB = () => {
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
      if (!db.objectStoreNames.contains("encodeiItems")) {
        const objectStore = db.createObjectStore("encodeiItems", {
          keyPath: "id",
        });
        objectStore.createIndex("idIndex", "id", { unique: false });
      }
    };
  });
};

export const addData = (db, data) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["encodeiItems"], "readwrite");
    const objectStore = transaction.objectStore("encodeiItems");
    const addRequest = objectStore.add(data);
    addRequest.onsuccess = (event) => {
      resolve();
    };
    addRequest.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const getAllData = (db) => {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(["encodeiItems"]);
    const objectStore = transaction.objectStore("encodeiItems");
    const getAllRequest = objectStore.getAll();
    getAllRequest.onsuccess = (event) => {
      console.log(event);
      const result = event.target.result;
      resolve(result);
    };
    getAllRequest.onerror = (event) => {
      console.log(event);
      reject(event.target.error);
    };
  });
};
