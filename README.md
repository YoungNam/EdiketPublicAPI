# Ediket API
Bad writing goes in, good writing comes out. Let's find out how!

## API Key
In order to use Ediket API, you need to include *API_KEY* on your request header. It also communicates only using **json**.

```
Host: api.ediket.com
Content-Type: application/json
Authorization: "api-key"=<API_KEY>
```

Currently, Ediket API is available via direct contact. Send an e-mail to contact@ediket.com if you are interested.

## Upload Writing
Once you have *API_KEY*, it's time to right the wrong.

```
POST /drafts/ HTTP/1.1

Host: api.ediket.com
Content-Type: application/json
Authorization: "api-key"=<API_KEY>

{
  "content": "This is a bad writing.", <required>
  "message": "Please turn bad into good.", <optional>
  "callback_url": "www.my_website.com/notify/when/complete/", <optional>
  "meta": {

  }
}

```
