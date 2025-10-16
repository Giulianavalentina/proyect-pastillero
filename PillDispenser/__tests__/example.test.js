// Basic test example
test('adds 1 + 2 to equal 3', () => {
  expect(1 + 2).toBe(3);
});

test('object assignment', () => {
  const data = {one: 1};
  data['two'] = 2;
  expect(data).toEqual({one: 1, two: 2});
});

describe('test suite', () => {
  it('should work with strings', () => {
    const text = 'hello world';
    expect(text).toContain('hello');
  });
});
