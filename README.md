# Ediket API
Bad writing goes in, good writing comes out. Let's find out how!

## Access Token
In order to use Ediket API, you need to include `Token` on your request header. All communications use **application/json** Content-Type.

```
Host: api.ediket.com
Content-Type: application/json
Authorization: Bearer <TOKEN>
```

If you want to try our API, contact us at `contact@ediket.com`.

## Make Proofreading Request
Upload your writing with details to make a proofreading request.

```
POST /drafts/ HTTP/1.1

Host: api.ediket.com
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "content": "This is a bad writing.",
  "title": "My Proofreading Request",
  "message": "Please turn bad into good.",
  "category_purpose": "academic",
  "category_type": "email",
  "callback_url": "my_website.com/notify/when/complete/",
  "client_id": "120140129",
  "email": "contact@ediket.com",
  "custom_data": {
    "courseId": "BusinessWritingCourse#001",
    "lessonId": "Lesson#001",
  }
}
```

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `content` | String | The bad writing you want proofread. Minimum 3 words, maximum 3000 words. The text is parsed before uploaded. See [Parse Content](#parse-content). <br/><br/>**This is the only required field.** |
| `title` | String | Title of the request. It's not visible to the Ediket Editor. If absent, uses first 200 characters of the `content`. |
| `message` | String | Any additional message for Ediket editor to refer during editing. <br/><br/>Default: `Please ensure zero grammatical errors and style inconsistency.`|
| `category_purpose` | String | Purpose of the writing. Go to [Draft Documentation](/docs/draft.md) for possible options. <br/><br/>Default: `business` |
| `category_type` | String | Type of the writing. Go to [Draft Documentation](/docs/draft.md) for possible options. <br/><br/>Default: `others` |
| `callback_url` | String | URL for Callback when request is complete. See [Callback](#callback). |
| `client_id` | String | The identification value of the client. See [Client](#client). |
| `email` | String | Email is used for notification and authentication for accessing the complete request. See [Email](#email). <br/><br/>**Require `client_id`**|
| `custom_data` | Object | Additional custom data. It's serialized in our database. |


### Response
This is a sample response on successful upload. For details of draft data, go to [Draft Documentation](/docs/draft.md).

```
HTTP/1.1 201 CREATED
Content-Type: application/json

{
  "data": {
    "id": "09810def-5ece-44a8-97e3-6a1c748eea62",
    "type": "draft",
    "content": "This is a bad writing.",
    "title": "This is my request.",
    "message": "Please turn bad into good.",
    "category_purpose": "academic",
    "category_type": "email",
    "callback_url": "my_website.com/notify/when/complete/",
    "word_count": "5",
    "status": "waiting",
    "client_id": "120140129",
    "email": "contact@ediket.com",
    "custom_data": {
      "courseId": "BusinessWritingCourse#001",
      "lessonId": "Lesson#001",
    },
    "created_at": 1455977769,
    "revision": null,
    "comment": null,
    "completed_at": null,
    "editor": null
  }
}
```

## Callback
When editing is complete, Ediket API will send **POST Request** to the `callback_url` containing the draft data. Here is a sample response of a complete request. For details, go to [Draft Documentation](/docs/draft.md).

```
Content-Type: application/json

{
  "data": {
    "id": "6d29f9d3-b137-4212-8547-2db8be7c354c",
    "type": "draft",
    "content": "This is a bad writing.",
    "title": "This is my request.",
    "message": "Please turn bad into good.",
    "category_purpose": "academic",
    "category_type": "email",
    "callback_url": "my_website.com/notify/when/complete/",
    "word_count": "5",
    "status": "pending",
    "client_id": "120140129",
    "email": "contact@ediket.com",
    "custom_data": {
      "courseId": "BusinessWritingCourse#001",
      "lessonId": "Lesson#001",
    },
    "created_at": 1453880841,
    "revision": "This is a <del>bad</del><ins>good</ins> writing.",
    "comment": "It has now become a great writing!",
    "completed_at": 1453881841,
    "editor": {
      "username": "Eric the Fullstack",
      "education": "Rice University",
      "career": "CTO / Ediket",
      "biography": "...",
      "picture_url": "https://i.imgur.com/5ZFgenL.png",
      "profile_url": "https://ediket.com/profile/ericfullstack"
    }
  }
}
```

## Email
Require `client_id` for email notification. Providing email serves two purposes.
1. Ediket will send a notification email once the revision is complete.
2. Owner of the email can access to the complete revision at Ediket Website. See [Client](#client).

Email notification contains a link to the complete request.

## Client
Ownership of the request can be assigned to different `client`. Client API is currently work in progress. Here are the important caveats.

- If `client_id` is not provided, the request is considered anonymous and only accessible through API.
- If both `client_id` and `email` are provided, `client` will be created and assigned with `email` as authentication id to Ediket Website.
- If user with `email` is registered to Ediket Website, the user will be associated to your API as `client`. This allows the user to make request both from Ediket Website and API. Transactions from the former route will not affect invoices from api calls.
- If `client` exists with **different** `email`, the new `email` will only be used as a notification.

## Invoice
The API Client will receive monthly invoice based on word count usage. Go to our [Pricing Page](https://ediket.com/pricing/) for pricing.

## Errors
If something goes wrong with the request, you will receive error response.

```
HTTP/1.1 400 BAD REQUEST
Content-Type: application/json

{
  "status": 400,
  "code": 100,
  "message": "The argument is missing."
}
```

| Status | Code | Error | Note |
| ------ | ---- | ----- | -------- |
| 400 | 100 | Invalid argument. | ex) *content* is missing. |
| | 110 | Existing editor email | Try different email |
| | 200 | Unknown error | Please contact contact@ediket.com |
| | 201 | Quota exceed | Please contact contact@ediket.com |
| 401 | 401 | Access token is invalid |
| 500 | 500 | Internal server error | Please contact contact@ediket.com |
| 502 | 502 | Server is down for maintenance | Try again later |

## Parse Content
Ediket API is specialized in proofreading plain text with limited formats. When you upload request, your content will be parsed with unsupported html tags stripped. To check how content will be parsed before uploading the request and check word count, use the following endpoint.

```
POST /parse/ HTTP/1.1

Host: api.ediket.com
Content-Type: application/json
Authorization: Bearer <TOKEN>

{
  "content": "<table>This is a bad writing.</table>"
}
```

```
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
