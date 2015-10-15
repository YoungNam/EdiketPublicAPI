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
  "callback": "www.my_website.com/notify/when/complete/", <optional>
  "user_id": "1", <optional>
  "meta": {}
}

```

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `content` | String | Text content of bad writing. Minimum 3 words, maximum 3000 words. **Required** |
| `message` | String | Any additional message for Ediket editor to refer. |
| `callback` | String | URL for Callback when request is complete. Refer to *callback* section below. |
| `user_id` | String | The identification value of the uploader. The value must be less than or equal to 36 characters. If absent, the uploader will be considered as anonymous. Refer to *user* section below. |
| `meta` | Object | Additional data for the request. Refer to *meta* section below. |

### Response
This is a response after success upload.

```
HTTP/1.1 201 CREATED
Content-Type: application/json
Location: https://api.ediket.com/drafts/<draft_id>

{
  "id": "draft_1032D82eZvKYlo2C",
  "content": "This is a bad writing.",
  "revision": "This is a bad writing.",
  "final": "This is a bad writing.",
  "message": "Please turn bad into good.",
  "comment": null,
  "callback": "www.my_website.com/notify/when/complete/",
  "user_id": "1",
  "word_count": "5",
  "status": "waiting",
  "editor": null,
  "created_at": "2015-10-16T02:37:39+00:0",
  "completed_at": null,
}
```

### Errors
If something goes wrong with the request, the response will be the following.

```
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
  "status": 400,
  "code": 100,
  "message": "The argument is missing.",
  "field": "content"
}
```

| Code | Error | Note |
| ---- | ----- | -------- |
| 100  | The argument is missing. | ex) *content* is missing. |
| 200  | The argument is invalid. | ex) *user_id* is invalid. *content* is either too short or too long. |
| 201  | The account is deactivated. | Please send an e-mail to contact@ediket.com for details. |
| 202  | The account ran out of credits. | API holder must contact Ediket for payment method after the first 1000 words trial |
| 203  | The account exceeded request bandwidth | Request word count exceeded maximum threshold. Default 100000 Words. Modify the threshold using account settings. |

### Callback
It takes about 30 minutes per page for Ediket Editor to right the wrong. After the request is complete, API User will be notified through callback url provided during request upload. Ediket API will send **POST Request** containing the following data.

```
{
  "id": "draft_1032D82eZvKYlo2C",
  "content": "This is a bad writing.",
  "revision": "This is a <del>bad</del><ins>good</ins> writing.",
  "final": "This is a good writing.",
  "message": "Please turn bad into good.",
  "comment": "The bad has turned good now!",
  "callback": "www.my_website.com/notify/when/complete/",
  "user_id": "1",
  "word_count": "5",
  "status": "completed",
  "editor": {
    "id": "2",
    "username": "Eric the Editor",
    "career": "Developer",
    "education": "Rice University"
  },
  "created_at": "2015-10-16T02:37:39+00:0",
  "completed_at": "2015-10-16T02:50:41+00:0",
}
```

## Draft

## User

## Invoice

## Account Settings

