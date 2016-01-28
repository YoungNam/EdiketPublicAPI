# Draft Object
Draft is a proofreading request that contains original writing, revision, and editor info. The term `request` and `draft` are interchangeable.

## Attributes

| Name | Type | Description |
| ---- | ---- | ----------- |
| `id` | String | |
| `type` | String | "draft" |
| `content` | String | Parsed content of uploaded writing. |
| `message` | String | Additional message uploaded during request. |
| `category_purpose` | String | Purpose of the writing specified during request. See [Category](#category). |
| `category_type` | String | Type of the writing specified during request. See [Category](#category). |
| `callback` | String | URL for Callback when request is complete. |
| `user_id` | String | The identification value of the uploader. Max 36 characters. If absent, the uploader will be anonymous. |
| `custom_data` | Object | Additional custom data |
| `word_count` | Number | Number of word count. **Determines the pricing.** |
| `created_at` | Number | Created at timestamp in unix epoch |
| `estimated_time` | Number | Number of estimated **minutes** for completion. |
| `status` | String | Status of the request. See [Status](#status). |
| `revision` | String | Revised content with track changes. Only available after `pending` status. `null` before `pending`. See [Revision](#revision). *(TODO: Display incomplete progress at `editing`)* |
| `final` | String | Revised content in final form. Only available after `pending` status. `null` before `pending`. See [Revision](#revision). *(TODO: Display incomplete progress at `editing`)* |
| `comment` | String | Comment left by editor. `null` before `pending`. |
| `editor` | Object | A brief profile of the editor. `null` before `editing`. See [Editor](#editor). |
| `completed_at` | Number | Revision completed at timestamp in unix epoch |

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
Revised content comes in two forms: `revision` and `final`.

`revision` is revised content in track change format. It consists of `<del>` and `<ins>` tags to display which part is deleted and which part is inserted.

```html
This is a <del>bad</del><ins>good</ins> writing.
```

`final` is revised content in final form.

```html
This is a good writing.
```

### Editor
Our awesome editors will bring the good out of your bad writing.

| Name | Type | Description |
| ---- | ---- | ----------- |
| username | String | Editor's username |
| education | String | Editor's education in one sentence. ex) George Washington University Law School |
| career | String | Editor's career in one sentence. ex) Consultant / PricewaterhouseCoopers |
| biography | String | Editor's lengthy biography. |
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
This is a sample response on successful upload. It returns all of the draft attributes.

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
When editing is complete, Ediket API will send **POST Request** to the callback URL containing the draft data. It is sent only when it's status became `pending`, thus the sample response may look like this.

```
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
    "status": "pending",
    "revision": "This is a <del>bad</del><ins>good</ins> writing.",
    "final": "This is a good writing.",
    "comment": "It has now become a great writing!",
    "editor": {
      "username": "Barrett",
      "education": "George Washington University Law School",
      "career": "Consultant / PricewaterhouseCoopers",
      "biography": "...",
      "profile_url": "https://ediket.com/profile/6925d83a/"
    },
    "completed_at": 1453881841,
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
| user_id | String | Specify user_id to fetch drafts uploaded by the user. Use `0` to fetch requests uploaded as anonymous. |
| limit | Number | A limit on the number of drafts to be returned. Limit can range from 1-100. Default: 10 |
| before | String | Optional argument for pagination. If you fetched 10 drafts starting with id `obj_draft`, include `?before=obj_draft` to fetch previous page on the list. Do not use this with `after`. |
| after | String | Optional argument for pagination. If you fetched 10 drafts ending with id `obj_draft`, include `?after=obj_draft` to fetch next page on the list Do not use this with `before`. |

### Examples

```
GET /drafts/

Host: api.ediket.com
Content-Type: application/json
Authorization: "api-key"=<API_KEY>

{
  "data": [{
    "id": "draft_10",
    ... (Rest of the attributes)
  }, {
    "id": "draft_9",
    ...
  }, {
    "id": "draft_8",
    ...
  }, {
    "id": "draft_7",
    ...
  }, {
    "id": "draft_6",
    ...
  }, {
    "id": "draft_5",
    ...
  }, {
    "id": "draft_4",
    ...
  }, {
    "id": "draft_3",
    ...
  }, {
    "id": "draft_2",
    ...
  }, {
    "id": "draft_1",
    ...
  }],
}
```

```
GET /drafts/?limit=3,before=draft_3

Host: api.ediket.com
Content-Type: application/json
Authorization: "api-key"=<API_KEY>

{
  "data": [{
    "id": "draft_6",
    ...
  }, {
    "id": "draft_5",
    ...
  }, {
    "id": "draft_4",
    ...
  }],
}
```
