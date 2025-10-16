// Setup mínimo
require('@testing-library/jest-native/extend-expect');
jest.mock('expo-constants', () => ({ manifest: {} }));
console.log('Jest setup loaded - minimal version');
