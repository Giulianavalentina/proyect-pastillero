// __tests__/example.test.js
test('basic test', () => {
  expect(1 + 1).toBe(2);
});

describe('Test suite', () => {
  it('should work', () => {
    const value = 'hello';
    expect(value).toBe('hello');
  });
});