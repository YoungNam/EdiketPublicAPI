# Draft
Draft is a proofreading request that contains original writing, revision, and editor info. The term `request` and `draft` are interchangeable.

## Endpoints
| Name | Request |
| ---- | ------- |
| [Create a draft](#create-a-draft) | `POST` https://api.ediket.com/drafts/ |
| [Retrieve a draft detail](#retrieve-a-draft-detail) | `GET` https://api.ediket.com/drafts/[draft_id]/ |
| [List drafts](#list-drafts) | `GET` https://api.ediket.com/drafts/ |

## Attributes

| Name | Type | Description |
| ---- | ---- | ----------- |
| `id` | String | |
| `type` | String | "draft" |
| `content` | String | The bad writing you want proofread. Minimum 3 words, maximum 3000 words. The text is parsed before uploaded. See [Parse Content](#parse-content). <br/><br/>**This is the only required field.** |
| `title` | String | Title of the request. It's not visible to the Ediket Editor. If absent, uses first 200 characters of the `content`. |
| `message` | String | Any additional message for Ediket editor to refer during editing. <br/><br/>Default: `Please ensure zero grammatical errors and style inconsistency.`|
| `category_purpose` | String | Purpose of the writing. See [Category](#category). |
| `category_type` | String | Type of the writing. See [Category](#category). |
| `callback_url` | String | URL for Callback when request is complete. |
| `user_id` | String | The identification value of the user. |
| `email` | String | Email is used for notification and authentication for accessing the complete request. |
| `custom_data` | Object | Additional custom data. It's serialized in our database. |
| `word_count` | Number | Number of word count. **Determines the pricing.** |
| `created_at` | Number | Created at timestamp in unix epoch |
| `status` | String | Status of the request. See [Status](#status). |
| `revision` | String | Revised content with track changes. Only available after `pending` status. `null` before `pending`. See [Revision](#revision). *(TODO: Display incomplete progress at `editing`)* |
| `comment` | String | Comment left by editor. `null` before `pending`. |
| `completed_at` | Number | Revision completed at timestamp in unix epoch |
| `editor` | Object | A brief profile of the editor. `null` before `editing`. See [Editor](#editor). |

### Category
All drafts are categorized by their purpose and type. There are three defined purposes and each purpose comes with different types.

- (Purpose)
  + (Type)
- `academic`
  + `cover-letter`
  + `presentation`
  + `dissertation`
  + `sat`
  + `recommend-letter`
  + `toefl`
  + `paper`
  + `others`
- `business` (Default)
  + `email`
  + `presentation`
  + `company-info`
  + `cover-letter`
  + `report`
  + `product-desc`
  + `resume`
  + `others` (Default)
- `personal`
  + `email`
  + `diary`
  + `sns`
  + `others`

It helps editor understand the context of the request. If category is not defined or contains wrong value than ones above, `business` and `others` will be set as default for purpose and type.

### Status
Since Ediket provides human proofreading, the editing can take up to 30 minutes per a page. The draft can be at a different status time to time.

- `waiting`: The draft is waiting for editor to claim. This is the status right after the draft is uploaded. It won't stay as this for long time.
- `editing`: The draft is currently being edited.
- `pending`: The editing is just complete. It is called pending because usually the requester is given enough time to review the revision before finalizing the transaction. For API, pending should be considered equivalent as `complete`.
- `complete`: The transaction is complete and revision is final. `pending` draft becomes automatically `complete` after 48 hours.
- `rejected`: The request contains inappropriate content or language to proofread.

### Revision
`revision` is revised content in track change format. It consists of `<del>` and `<ins>` tags to display which part is deleted and which part is inserted.

```html
This is a <del>bad</del><ins>good</ins> writing.
```

### Editor
Our awesome editors will bring the good out of your bad writing.

| Name | Type | Description |
| ---- | ---- | ----------- |
| username | String | Editor's username |
| education | String | Editor's education in one sentence. ex) George Washington University Law School |
| career | String | Editor's career in one sentence. ex) Consultant / PricewaterhouseCoopers |
| biography | String | Editor's lengthy biography. |
| picture_url | String | Img URL to editor's portrait |
| profile_url | String | Editor's profile page that contains detailed bio. ex) https://ediket.com/profile/6925d83a/ |

## Create a draft

```
POST https://api.ediket.com/drafts/
```

Also known as Upload Writing. It is where you make a proofreading request.

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
  "user_id": "120140129",
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
| `content` | String | The bad writing you want proofread. Minimum 3 words, maximum 3000 words. The text is parsed before uploaded. See [Parse Content](#parse-content)**Required** |
| `message` | String | Any additional message for Ediket editor to refer during editing. |
| `category_purpose` | String | Purpose of the writing. See [Draft Documentation Page](/docs/draft.md) for possible options. Default: `business` |
| `category_type` | String | Type of the writing. See [Draft Documentation Page](/docs/draft.md) for possible options. Default: `others` |
| `callback_url` | String | URL for Callback when request is complete. See [Callback](#callback). |
| `custom_data` | Object | Additional custom data |

### Response
This is a sample response on successful upload. It returns all of the draft attributes.

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
    "user_id": "120140129",
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

### Callback
When editing is complete, Ediket API will send **POST Request** to the callback URL containing the draft data. It is sent only when it's status became `pending`, thus the sample response may look like this.

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
    "user_id": "120140129",
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

## Retrieve a draft detail

```
GET https://api.ediket.com/drafts/<draft_id>/
```

After draft is created, it always can be fetched by using `id`. It will fetch all attributes as documented above.

## List drafts

```
GET https://api.ediket.com/drafts/
```

### Arguments

| Name | Type | Description |
| ---- | ---- | ----------- |
| user_id | String | Sort by user id
| offset | Number | A pagination offset. <br/><br/>Default: 0 |
| limit | Number | A pagination limit. <br/><br/>Default: 10 |
