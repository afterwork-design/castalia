export const isSupportIndexDB = () => {
    // const winObj = window as any;
    // window.indexedDB = winObj.indexedDB || winObj.mozIndexedDB || winObj.webkitIndexedDB || winObj.msIndexedDB;
    // window.IDBTransaction = winObj.IDBTransaction || winObj.webkitIDBTransaction || winObj.msIDBTransaction || {READ_WRITE: "readwrite"};
    // window.IDBKeyRange = winObj.IDBKeyRange || winObj.webkitIDBKeyRange || winObj.msIDBKeyRange;

    if (!window.indexedDB) {
        console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
        return false;
    }

    return true;
};

const databaseName = "castalia";
export const myCollectionTableName = "my-collection"; // 我的

interface DatabaseOperation {
    write: (tableName: string, data: any) => Promise<boolean>;
    remove: (tableName: string, key: any) => Promise<boolean>;
    read: (tableName: string, key: string) => Promise<unknown | null>;
    readAll: (tableName: string) => Promise<unknown | null>;
}

const initDb = (db: IDBDatabase): DatabaseOperation => {
    const write = (tableName: string, data: any): Promise<boolean> => {
        const store = db.transaction([tableName], "readwrite").objectStore(tableName);

        const request = store.add(data);

        return new Promise((res) => {
            request.onsuccess = () => {
                res(true);
            };

            request.onerror = () => {
                res(false);
            };
        });
    };

    const remove = (tableName: string, key: any): Promise<boolean> => {
        const store = db.transaction([tableName], "readwrite").objectStore(tableName);

        const request = store.delete(key);

        return new Promise((res) => {
            request.onsuccess = () => {
                res(true);
            };

            request.onerror = () => {
                res(false);
            };
        });
    };

    const read = (tableName: string, key: string): Promise<unknown | null> => {
        const store = db.transaction([tableName]).objectStore(tableName);
        const request = store.get(key);

        return new Promise((res) => {
            request.onsuccess = () => {
                if (request.result) {
                    res(request.result);
                    return;
                }
                res(null);
            };

            request.onerror = () => {
                res(null);
            };
        });
    };

    const readAll = (tableName: string): Promise<unknown | null> => {
        const store = db.transaction([tableName]).objectStore(tableName);
       
        var request = store.getAll();
        return new Promise((res) => {
            request.onsuccess = () => {
                if (request.result) {
                    res(request.result);
                    return;
                }
                res(null);
            };

            request.onerror = () => {
                res(null);
            };
        });
    };

    return {
        write,
        remove,
        read,
        readAll
    };
};

export const getDb = (version = 1) => new Promise<DatabaseOperation>((res, rej) => {
    const request = window.indexedDB.open(databaseName, version);

    request.onerror = () => {
        rej("Database Error: open failed!");
    };

    request.onsuccess = (event) => {
        const db = (event.target as any).result;
        res(initDb(db));
    };

    request.onupgradeneeded = (event) => {
        const db = (event.target as any).result;

        // create scheme
        const objStore = db.createObjectStore(myCollectionTableName, {keyPath: "name"});

        objStore.transaction.oncomplete = () => {
            console.log("数据库创建完成");
            res(initDb(db));
        };
    };
});
