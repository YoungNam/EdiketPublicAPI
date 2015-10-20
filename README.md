# Ediket API [Server-to-server]
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
Upload your user's drafts, and get revision notifications through a callback URL you specify.

```
POST /drafts/ HTTP/1.1

Host: api.ediket.com
Content-Type: application/json
Authorization: "api-key"=<API_KEY>

{
  "content": "This is a bad writing.", <required>
  "message": "Please turn bad into good.", <optional>
  "purpose": "academic", <optional>
  "writing_type": "email", <optional>
  "callback": "www.my_website.com/notify/when/complete/", <optional>
  "user_id": "1", <optional>
  "meta": {}, <optional>
  "custom_data": { <optional>
    "courseId": "BusinessWritingCourse#001",
    "lessonId": "Lesson#001",
  }
}
```

### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| `content` | String | Text content of bad writing. Minimum 3 words, maximum 3000 words. **Required** |
| `message` | String | Any additional message for Ediket editor to refer during editing. |
| `callback` | String | URL for Callback when request is complete. Refer to [Callback](#callback) below. |
| `user_id` | String | The identification value of the uploader. The value must be less than or equal to 36 characters. If absent, the uploader will be considered as anonymous. Refer to [Request User](#request-user) section below. |
| `meta` | Object | Additional data for the request. Refer to *meta* section below. |
| `payload` | Object | Additional data to be pushed as-is on to your callback url. Note that this will not be processed by Ediket API |

### Response
This is a response after success upload.

```
HTTP/1.1 201 CREATED
Content-Type: application/json
Location: https://api.ediket.com/drafts/<draft_id>

{
  "id": "draft_1032D82eZvKYlo2C",
  "content": "This is a bad writing.",
  "revision": null,
  "final": null,
  "message": "Please turn bad into good.",
  "comment": null,
  "callback": "www.my_website.com/notify/when/complete/",
  "user_id": "1",
  "meta": {},
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
It takes about 30 minutes per page for Ediket Editor to revise a draft. After the request is complete, API User will be notified through callback url provided during request upload. Ediket API will send **POST Request** containing the following data.

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
  "meta": {},
  "payload": {
  	"courseId": "BusinessWritingCourse#001",
    "lessonId": "Lesson#001",
  },
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

### Request User
When uploading draft, API User can specify `user_id` to better organize user's requests. `user_id` is a unique identification value from API User's database with the length equal to or less than 36 characters.

### Request Meta
API User can specify meta information describing the nature of the content. It can be any JSON Object. Note that meta data may be processed by Ediket in unbreaking ways to enhance service quality. Here is the sample meta.

```
"meta": {
  "purpose": "academic",
  "type": "email"
}
```

## Get Drafts uploaded by a user
Get list of drafts uploaded by a user

```
GET /users/<user_id>/drafts HTTP/1.1

Host: api.ediket.com
Content-Type: application/json
Authorization: "api-key"=<API_KEY>
```

###Response:
```
[
	{
		 "id": "draft_1032D82eZvKYlo2C",
		 "content": "This is a bad writing.",
		 "revision": "This is a <del>bad</del><ins>good</ins> writing.",
		 "final": "This is a good writing.",
		 "message": "Please turn bad into good.",
		 "comment": "The bad has turned good now!",
		 "callback": "www.my_website.com/notify/when/complete/",
		 "user_id": "1",
		 "meta": {},
		 "payload": {
			"courseId": "BusinessWritingCourse#001",
			"lessonId": "Lesson#001",
		},
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
  },
	{
		 "id": "draft_QWERTY2NDWRITINGWOOTWOOT",
		 "content": "This is a bad writing#2.",
		 "revision": null,
		 "final": null,
		 "message": "Please turn bad into good boy!.",
		 "comment": null,
		 "callback": "www.my_website.com/notify/when/complete/",
		 "user_id": "1",
		 "meta": {},
		 "payload": {
			"courseId": "BusinessWritingCourse#003",
			"lessonId": "Lesson#0072",
		},
		"word_count": "5",
		"status": "waiting",
		"created_at": "2015-10-16T02:37:39+00:0",
		"completed_at": null,
  },
]
```

## API Settings, Invoices, etc:
Those are available through [Ediket API Console](https://apiconsole.ediket.com)