import test from 'ava';
import rewire from 'rewire';
import Client from './mock/client__mock';

// Overriding env so crypto doesn't throw
process.env.SECRET = 'meow';

const instapi = rewire('../src/instapi.js');
instapi.__set__({
  Client,
});

test('Register returns hash and feeds', async (t) => {
  const registration = await instapi.register('a', 'b');
  const h = '811399edb8dd7ded0a8120ffe3a4e043a4a31e936a2eedc51937711591e89a01';
  const expected = {
    feeds: [
      { accounts: [{ a: 1, b: 2 }], items: [{ c: 3, d: 4 }], id: 2 },
    ],
    token: h,
    user: {
      id: 1,
      name: 'Test',
    },
  };
  t.deepEqual(registration, expected);
});
