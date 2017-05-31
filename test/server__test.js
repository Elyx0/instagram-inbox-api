import test from 'ava';
import listen from 'test-listen';
import request from 'request-promise';

import server from '../src/server';

const getUrl = () => listen(server);

test('Up and running', async (t) => {
  const url = await getUrl();
  const res = await request(url);
  t.deepEqual(JSON.parse(res), { status: 200 });
});

test('Register ParameterError failure', async (t) => {
  const url = await getUrl();
  const options = {
    method: 'POST',
    uri: `${url}/register`,
    body: {
      user: `instadm-test-${Math.random()}`,
      pass: '',
    },
    json: true,
  };
  const res = await request(options);
  t.deepEqual(res.error.name, 'ParameterError');
});

test('Register Authentication failure', async (t) => {
  const url = await getUrl();
  const options = {
    method: 'POST',
    uri: `${url}/register`,
    body: {
      user: `instadm-test-${Math.random()}`,
      pass: `${Math.random()}`,
    },
    json: true,
  };
  const res = await request(options);
  t.deepEqual(res.error.name, 'AuthenticationError');
});
// test.todo('register success');
// test.todo('get thread fail');
// test.todo('get thread success');
