# Ediket API
Bad writing goes in, good writing comes out. Let's find out how!

## API Key
In order to use Ediket API, you need to include `API_KEY` on your request header. It also communicates only using **json**.

```
Host: api.ediket.com
Content-Type: application/json
Authorization: "api-key"=<API_KEY>
```

Currently, `API_KEY` is available via direct contact. Send an e-mail to contact@ediket.com if you are interested.

## Upload Writing
Upload your writing with details to make a proofreading request.

```
POST /drafts/ HTTP/1.1

Host: api.ediket.com
Content-Type: application/json
Authorization: "api-key"=<API_KEY>

{
  "content": "This is a bad writing.",
  "message": "Please turn bad into good.",
  "category_purpose": "academic",
  "category_type": "email",
  "callback": "my_website.com/notify/when/complete/",
  "user_id": "1",
  "custom_data": {
    "courseId": "BusinessWritingCourse#001",
    "lessonId": "Lesson#001",
  }
}
```

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `content` | String | The bad writing you want proofread. Minimum 3 words, maximum 3000 words. The text is parsed before uploaded. See [Parse Content](#parse-content)**Required** |
| `message` | String | Any additional message for Ediket editor to refer during editing. |
| `category_purpose` | String | Purpose of the writing. See [Draft Documentation Page](/docs/draft.md) for possible options. Default: `business` |
| `category_type` | String | Type of the writing. See [Draft Documentation Page](/docs/draft.md) for possible options. Default: `others` |
| `callback` | String | URL for Callback when request is complete. See [Callback](#callback). |
| `user_id` | String | The identification value of the uploader. Max 36 characters. If absent, the uploader will be anonymous. See [Request User](#request-user). |
| `custom_data` | Object | Additional custom data |


### Response
This is a sample response on successful upload. For details of draft data, see [Draft Documentation Page](/docs/draft.md).

```
HTTP/1.1 201 CREATED
Content-Type: application/json

{
  "data": {
    "id": "draft_1032D82eZvKYlo2C",
    "type": "draft",
    "content": "This is a bad writing.",
    "message": "Please turn bad into good.",
    "category_purpose": "academic",
    "category_type": "email",
    "callback": "my_website.com/notify/when/complete/",
    "user_id": "1",
    "custom_data": {
      "courseId": "BusinessWritingCourse#001",
      "lessonId": "Lesson#001",
    },
    "word_count": "5",
    "created_at": 1453880841,
    "estimated_time": 3,
    "status": "waiting",
    "revision": null,
    "final": null,
    "comment": null,
    "editor": null,
    "completed_at": null,
  }
}
```

### Callback
When editing is complete, Ediket API will send **POST Request** to the callback URL containing the draft data. For details of draft data, see [Draft Documentation Page](/docs/draft.md).

### Request User
When uploading draft, API User can specify `user_id` to better organize user's requests. `user_id` is a unique identification value from API User's database with the length equal to or less than 36 characters. Valid characters are letters, numbers, -, and \_. Do not use the number 0.

## Errors
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
| 202  | The account ran out of credits. | API holder must contact Ediket for payment method after the first 1,000 words trial |
| 203  | The account exceeded request bandwidth | Request word count exceeded maximum threshold. Default 100,000 Words. Modify the threshold using account settings.

## Parse Content
Ediket API is specialized in proofreading plain text with limited formats. When you upload request, your content will be parsed with unsupported html tags stripped. To check how content will be parsed before uploading the request and check word count, use the following endpoint.

```
POST /parse/ HTTP/1.1

Host: api.ediket.com
Content-Type: application/json
Authorization: "api-key"=<API_KEY>

{
  "content": "<table>This is a bad writing.</table>"
}

HTTP/1.1 200 OK
Content-Type: application/json

{
  "data": {
    "filtered_content": "This is a bad writing.",
    "word_count": 5
  }
}
```

## Other Documentations

- [Draft Documentation Page](/docs/draft.md)
