const mockSafeAreaContext = require('react-native-safe-area-context/jest/mock');

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext.default);
