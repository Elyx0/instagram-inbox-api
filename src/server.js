
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import micro, { json } from 'micro';
import { router, get, post } from 'microrouter';

import { V1 as Client } from 'instagram-private-api';

import { register, read } from './instapi';

const { CookieNotValidError, AuthenticationError } = Client.Exceptions;

const cors = require('micro-cors')();

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));

const paramError = {
  error: {
    name: 'ParameterError',
    message: 'Both user and password are required.',
  },
};

const removeCookie = (user, key) => {
  const file = path.join(__dirname, `/cookies/${user}-${key}.json`);
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    return true;
  }
  return false;
};

// Registers a client session and returns inbox feeds
const handleRegister = async (req) => {
  let params;

  try {
    params = await json(req);
  } catch (e) {
    return paramError;
  }
  const { user, pass } = params;
  if (!user || !pass) return paramError;

  let feeds = {};
  try {
    feeds = await register(user, pass);
  } catch (e) {
    if (e instanceof AuthenticationError) {
      // Remove
      const hash = crypto.createHmac('sha256', process.env.SECRET).update(pass).digest('hex');
      removeCookie(user, hash);
    }
    return {
      error: {
        name: e.name || e,
        message: e.message || e,
      },
    };
  }
  return { data: feeds };
};

// Reads a particular feed
const handleRead = async (req) => {
  const { id } = req.params;
  if (!id) return paramError;

  let threadItems = [];
  let params;

  try {
    params = await json(req);
  } catch (e) {
    return paramError;
  }
  const { user, token } = params;
  if (!user || !token) return paramError;

  try {
    threadItems = await read(user, token, id);
  } catch (e) {
    if (e instanceof CookieNotValidError || e instanceof AuthenticationError) {
      // Our data is stale
      removeCookie(user, token);
    }
    return {
      error: {
        name: e.name || e,
        message: e.message || e,
      },
    };
  }

  return { data: threadItems };
};

// Erase auth
const handleLogout = async (req) => {
  let params;

  try {
    params = await json(req);
  } catch (e) {
    return paramError;
  }
  const { user, token } = params;
  if (!user || !token) return paramError;
  const isFound = removeCookie(user, token);
  if (isFound) {
    return {
      data: {
        success: true,
      },
    };
  }

  // Not sure it opens to bruteforce
  return {
    error: {
      name: 'LogoutError',
      message: 'This token does not exist',
    },
  };
};

const handleBase = async () => ({ status: 200 });

const server = micro(compose(
    cors
)(router(get('/', handleBase),
  post('/register', handleRegister),
  post('/read/:id', handleRead),
  post('/logout', handleLogout)
)));

export default server;
