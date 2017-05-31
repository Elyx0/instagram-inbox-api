export const inboxFeeds = [
  { accounts: [
    { _params: { a: 1, b: 2 } },
  ],
    items: [
    { _params: { c: 3, d: 4 } },
    ],
    id: 2 },
];
function Inbox() {
  this.all = () => inboxFeeds;
}

const threadItems = {};

function ThreadItems() {
  this.all = () => threadItems;
}

const Client = {
  Device: () => 'device',
  Session: {
    create: () => ({
      _cookiesStore: {
        storage: {
          idx: {
            'i.instagram.com': {
              '/': {
                ds_user_id: { value: 1 },
                ds_user: { value: 'Test' },
              },
            },
          },
        },
      },
    }),
  },
  Feed: {
    Inbox,
    ThreadItems,
  },
  CookieFileStorage: () => 'storage',
};

export default Client;
