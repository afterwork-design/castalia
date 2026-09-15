// Setup for Jest environment

// Mock window.indexedDB
Object.defineProperty(window, 'indexedDB', {
  value: {
    open: jest.fn(() => ({
      result: {},
      error: null,
      transaction: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
    deleteDatabase: jest.fn(),
    cmp: jest.fn(),
  },
  writable: true,
});

// Mock other window properties that might not exist in Node.js
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  });
}