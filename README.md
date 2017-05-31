# Instagram Inbox Reading Web API [![Build Status][travis-image]][travis-url]

A web api for reading instagram private inbox leveraging [micro](https://github.com/zeit/micro).

## Output sample


#### 1)  Request a token and get feeds and last message
Method | Endpoint  | Query Parameters
------------ | ------------- | -------------
POST | /register | `{"user":"[username]","pass":"[accountPass]"}`

#### Request
Eg: From your frontend or else.
```javascript
fetch('http://localhost:3000/register', {
  method: 'post',
  headers: {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({user:'TheUser',pass:'ThePassword'})
}).then(res=>res.json())
  .then(res => console.log(res));
```

#### Response

```json
{
  "data": {
    "token": "3140d49ed8e7e216784b4effwefwf2326c610b00223a5d8fd315e",
    "feeds": [
      {
        "accounts": [
          {
            "username": "y4g4m1",
            "picture": "http://scontent-yyz1-1.cdninstagram.com/t51.2885-19/11248742_933430356713730_1934006097_a.jpg",
            "fullName": "Yohan McDonald",
            "id": 559838015,
            "isPrivate": false,
            "hasAnonymousProfilePicture": false,
            "isBusiness": false
          }
        ],
        "items": [
          {
            "id": "27590990389933559206179341506445312",
            "type": "text",
            "text": "potato",
            "accountId": 51027825,
            "created": 1495710586089
          }
        ],
        "id": "340282366841710300949128130393065336903"
      },
      {
        "accounts": [
          {
            "username": "axelleokok",
            "picture": "http://scontent-yyz1-1.cdninstagram.com/t51.2885-19/s150x150/13259602_580319558808270_355488729_a.jpg",
            "fullName": "Axelle Air",
            "id": 43672695,
            "isPrivate": false,
            "hasAnonymousProfilePicture": false,
            "isBusiness": false,
            "profilePicId": "1256028245353702101_43672695"
          }
        ],
        "items": [
          {
            "id": "27521541584252433622799407499968512",
            "type": "text",
            "text": "Why not",
            "accountId": 43672695,
            "created": 1491945758789
          }
        ],
        "id": "340282366841710300949128141477819325231"
      },
    ],
    "user": {
      "id": "51027825",
      "name": "elyx0"
    }
  }
}
```

#### 2)  Use the token, username and get feeds
Method | Endpoint  | Query Parameters
------------ | ------------- | -------------
POST | /read/:id | `{"user":"[user.nameFromPreviousCall]","token":"[tokenFromPreviousCall]"}`

You will need the feed id of the conversation you want to retrieve for ex `data.feeds[0].id`
 (340282366841710300949128130393065336903) in my example

 #### Request
 Eg: From your frontend or else.
 ```javascript
 fetch('http://localhost:3000/read/340282366841710300949128130393065336903', {
   method: 'post',
   headers: {
     'Accept': 'application/json, text/plain, */*',
     'Content-Type': 'application/json'
   },
   body: JSON.stringify({user:'TheUser',token:'theTokenFromStep1'})
 }).then(res=>res.json())
   .then(res => console.log(res));
 ```
#### Response

```json
{
  "data": [
    {
      "id": "27590990389933559206179341506445312",
      "type": "text",
      "text": "potato",
      "accountId": 51027825,
      "created": 1495710586089
    },
    {
      "id": "27590986342924623648393706191454208",
      "type": "media",
      "media": [
        {
          "width": 1080,
          "height": 1920,
          "url": "https://scontent-yyz1-1.cdninstagram.com/t51.2885-15/e15/fr/p1080x1080/18723392_158530731350650_2257534157666123776_n.jpg?ig_cache_key=Mjc1OTA5ODYzNDI5MjQ2MjM2NDgzOTM3MDYxOTE0NTQyMDg%3D.2"
        }
      ],
      "accountId": 559838015,
      "created": 1495710366700
    },
    {
      "id": "27590986175440915712521837108789248",
      "type": "text",
      "text": "Hello",
      "accountId": 559838015,
      "created": 1495710357621
    }
  ]
}
```

#### Logging out
Method | Endpoint  | Query Parameters
------------ | ------------- | -------------
POST | /logout | `{"user":"[user.nameFromInitialCall]","token":"[tokenFromInitialCall]"}`

 #### Request
 Eg: From your frontend or else.
 ```javascript
 fetch('http://localhost:3000/logout', {
   method: 'post',
   headers: {
     'Accept': 'application/json, text/plain, */*',
     'Content-Type': 'application/json'
   },
   body: JSON.stringify({user:'TheUser',token:'theTokenFromStep1'})
 }).then(res=>res.json())
   .then(res => console.log(res));
 ```
#### Response

```json
{
  "data": {
    "success": true
  }
}
```

## Errors
API error will reply with a code `200`, a `name` and a `message` or `500` if something went really bad.

```json
{
  "error": {
    "name": "AuthenticationError",
    "message": "The password you entered is incorrect. Please try again."
  }
}
```

## Install

* **Note: requires a node version >= 6 and an npm version >= 3.**

Clone the repo via git:

```bash
git clone https://github.com/elyx0/instagram-inbox-api.git your-project-name
```

And then install dependencies.

```bash
$ cd your-project-name && npm install
```

### Security
Since there is no Oauth / Authorize with instagram for the Inbox endpoint
You will need to provide the user and pass of the account

> WE DO NOT STORE THE PASSWORD

Instead the password is hashed using [sha256](https://stackoverflow.com/a/9316461/1659084) and the key of you choice (one way encryption) and used as the filename of your cookie that is used for authentication to instagram

❗️You will need to create a `.env` file containing the following❗️
```
SECRET=yourSecretThatWillEncryptTheCredentials
PORT=3000 //Optional if using Docker
```



:bulb: Or even better as an env using [Docker Secret](https://docs.docker.com/engine/swarm/secrets/)

You can run the [AVA](https://github.com/sindresorhus/ava) and [ESLint](http://eslint.org) tests using: `npm test`

⚠️ If your frontend is in https and not the server hosting this, you might get a `Mixed Content` error. You need to setup a [SSL Nginx Proxy](http://tom.busby.ninja/letsecnrypt-nginx-reverse-proxy-no-downtime/)


[travis-image]: https://travis-ci.org/Elyx0/instagram-inbox-api.git.svg?branch=master
[travis-url]: https://travis-ci.org/Elyx0/instagram-inbox-api.git
