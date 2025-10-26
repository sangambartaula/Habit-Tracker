// Mock localStorage
const localStorageMock = (() => {
    let store = {};
  
    return {
      getItem: (key) => store[key] || null,
      setItem: (key, value) => {
        store[key] = value.toString();
      },
      removeItem: (key) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      }
    };
  })();
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });
  
  // Mock fetch globally
  global.fetch = jest.fn();
  
  // Suppress jsdom navigation errors in console
  const originalError = console.error;
  beforeAll(() => {
    console.error = (...args) => {
      if (
        typeof args[0] === 'string' &&
        args[0].includes('Not implemented: navigation')
      ) {
        return;
      }
      originalError.call(console, ...args);
    };
  });
  
  afterAll(() => {
    console.error = originalError;
  });
  
  // Mock console methods to reduce noise in tests
  global.console.log = jest.fn();
  global.console.warn = jest.fn();
  
  // Reset all mocks before each test
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });