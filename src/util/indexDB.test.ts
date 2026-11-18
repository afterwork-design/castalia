import { isSupportIndexDB, getDb, myCollectionTableName } from './indexDB';

// Create a more realistic mock for IDBRequest
class MockIDBRequest {
  result: any;
  error: any;
  onsuccess: ((event?: any) => void) | null = null;
  onerror: ((event?: any) => void) | null = null;
  onupgradeneeded: ((event?: any) => void) | null = null;

  constructor(result?: any, error?: any) {
    this.result = result;
    this.error = error;
  }

  // Method to trigger the success callback
  triggerSuccess() {
    if (this.onsuccess) {
      const event = { target: { result: this.result } };
      this.onsuccess(event);
    }
  }

  // Method to trigger the error callback
  triggerError() {
    if (this.onerror) {
      this.onerror({ target: { error: this.error } });
    }
  }
}

// Create a mock IDBDatabase object
const createMockIDBDatabase = () => {
  const mockObjectStore = {
    add: jest.fn(() => new MockIDBRequest()),
    delete: jest.fn(() => new MockIDBRequest()),
    get: jest.fn(() => new MockIDBRequest()),
    getAll: jest.fn(() => new MockIDBRequest()),
  };

  const mockTransaction = {
    objectStore: jest.fn(() => mockObjectStore),
  };

  const mockDB = {
    transaction: jest.fn(() => mockTransaction),
    createObjectStore: jest.fn(() => ({
      transaction: {
        oncomplete: null,
      },
    })),
  };

  return mockDB;
};

describe('indexDB utilities', () => {
  let originalIndexedDB: any;
  let originalConsoleLog: any;

  beforeEach(() => {
    // Store original values
    originalIndexedDB = (global as any).window?.indexedDB;
    originalConsoleLog = console.log;
  });

  afterEach(() => {
    // Restore original values
    if (originalIndexedDB) {
      (global as any).window.indexedDB = originalIndexedDB;
    } else {
      delete (global as any).window?.indexedDB;
    }
    console.log = originalConsoleLog;
  });

  describe('isSupportIndexDB', () => {
    it('should return true when indexedDB is supported', () => {
      // Ensure indexedDB exists in window
      (global as any).window.indexedDB = {};
      const result = isSupportIndexDB();
      expect(result).toBe(true);
    });

    it('should return false when indexedDB is not supported', () => {
      // Set indexedDB to undefined in the window
      (global as any).window.indexedDB = undefined;
      
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

      const result = isSupportIndexDB();
      expect(result).toBe(false);
      expect(consoleSpy).toHaveBeenCalledWith(
        "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
      );

      consoleSpy.mockRestore();
    });
  });

  describe('getDb', () => {
    it('should successfully initialize database when indexedDB is supported', async () => {
      const mockDB = createMockIDBDatabase();
      
      // Mock the open request with success scenario
      const mockRequest = new MockIDBRequest(mockDB);
      
      const mockIndexedDB = {
        open: jest.fn(() => {
          // Simulate the onupgradeneeded being called first
          setTimeout(() => {
            if (mockRequest.onupgradeneeded) {
              const event = { target: { result: mockDB } };
              mockRequest.onupgradeneeded(event);
              
              // Then simulate the transaction completion
              const objStore = mockDB.createObjectStore(myCollectionTableName, {keyPath: "name"});
              if (objStore.transaction.oncomplete) {
                objStore.transaction.oncomplete();
              }
              
              // Finally trigger success after a short delay to allow oncomplete to finish
              setTimeout(() => {
                mockRequest.triggerSuccess();
              }, 10);
            }
          }, 0);
          
          return mockRequest;
        }),
      };
      
      (global as any).window.indexedDB = mockIndexedDB;

      const result = await getDb();
      
      expect((global as any).window.indexedDB.open).toHaveBeenCalledWith('castalia', 1);
      expect(result).toHaveProperty('write');
      expect(result).toHaveProperty('remove');
      expect(result).toHaveProperty('read');
      expect(result).toHaveProperty('readAll');
    }, 10000); // Increase timeout for this test

    it('should handle database open error', async () => {
      const mockRequest = new MockIDBRequest(null, 'Database Error');

      const mockIndexedDB = {
        open: jest.fn(() => {
          setTimeout(() => {
            mockRequest.triggerError();
          }, 0);
          
          return mockRequest;
        }),
      };
      
      (global as any).window.indexedDB = mockIndexedDB;

      await expect(getDb()).rejects.toEqual("Database Error: open failed!");
    }, 10000); // Increase timeout for this test
  });

  describe('Constants', () => {
    it('should have the correct table name constant', () => {
      expect(myCollectionTableName).toBe('my-collection');
    });
  });
});