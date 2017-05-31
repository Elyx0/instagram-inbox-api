import crypto from 'crypto';
import path from 'path';
import instagram from 'instagram-private-api';

const Client = instagram.V1;
const parseFeed = async (feed) => {
  const feeds = await feed.all();
  return feeds.filter(t => t.accounts.length)
    .map(t => ({
      accounts: t.accounts.map(a => a._params),
      items: t.items.map(i => i._params),
      id: t.id,
    }));
};

const getDeviceStorage = (username, credential, credentialIsAlreadyEncrypted = false) => {
  const device = new Client.Device(username);
  let hash;

  if (credentialIsAlreadyEncrypted) {
    hash = credential;
  } else {
    hash = crypto.createHmac('sha256', process.env.SECRET).update(credential).digest('hex');
  }
  const filename = `${username}-${hash}`;
  const storage = new Client.CookieFileStorage(path.join(__dirname, `/cookies/${filename}.json`));
  return {
    device,
    storage,
    hash,
  };
};

// Logs in and returns inbox feeds
const register = async (username, password) => {
  const { device, storage, hash } = getDeviceStorage(username, password);
  const session = await Client.Session.create(device, storage, username, password);
  const inboxFeed = await new Client.Feed.Inbox(session);
  const feeds = await parseFeed(inboxFeed);
  const cookie = session._cookiesStore.storage.idx['i.instagram.com']['/'];
  const id = cookie.ds_user_id.value;
  const name = cookie.ds_user.value;

  const registration = {
    token: hash,
    feeds,
    user: {
      id,
      name,
    },
  };

  return registration;
};

// Read a specific inbox thread retrieved from user & token
const read = async (username, token, threadId) => {
  const { device, storage } = getDeviceStorage(username, token, true);
  const session = await Client.Session.create(device, storage);
  const tFeed = new Client.Feed.ThreadItems(session, threadId);
  const tFeedIt = await tFeed.all();
  return tFeedIt.map(i => i.params);
};

export {
  register,
  read,
};
