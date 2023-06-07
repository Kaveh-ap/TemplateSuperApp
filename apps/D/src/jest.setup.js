jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter.js', () => {
    const { EventEmitter } = require('events');
    return EventEmitter;
});

jest.mock('react-native-device-info', () => require('react-native-device-info/jest/react-native-device-info-mock'));

global.window = global;

global.__reanimatedWorkletInit = jest.fn();

require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('@gorhom/bottom-sheet', () => {
    const RN = require('react-native');

    return {
        __esModule: true,
        default: RN.View, // mocks the BottomSheet
        namedExport: {
            ...require('react-native-reanimated/mock'),
            ...jest.requireActual('@gorhom/bottom-sheet'),
        },
    };
});

const mockSafeAreaContext = require('react-native-safe-area-context/jest/mock');

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext.default);
