const DBName = "dsAnnotateDB";
const DBVersion = 1;

export const startDB = () => {
  return new Promise((resolve, reject) => {
    let openRequest = indexedDB.open(DBName, DBVersion);
    openRequest.onerror = (event) => {
      reject(event.target.error);
    };
    openRequest.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
    openRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore("encodeItems", {
        keyPath: "id",
        autoIncrement: true,
      });
      db.createObjectStore("items", { autoIncrement: true });
      resolve("Database setup complete");
    };
  });
};

export const addData = (db, storeName, data) => {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction([storeName], "readwrite");
    let objectStore = transaction.objectStore(storeName);
    let request = objectStore.add(data);

    request.onsuccess = () => resolve("Data addition successful");
    request.onerror = () => reject("Data addition failed");
  });
};

export const getAllData = (db, storeName) => {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction(storeName);
    let objectStore = transaction.objectStore(storeName);
    let request = objectStore.getAll();

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("Data fetch failed");
  });
};

export const deleteData = (db, storeName, id) => {
  return new Promise((resolve, reject) => {
    let transaction = db.transaction([storeName], "readwrite");
    let objectStore = transaction.objectStore(storeName);
    let request = objectStore.delete(id);

    request.onsuccess = () => resolve("Data deletion successful");
    request.onerror = () => reject("Data deletion failed");
  });
};
