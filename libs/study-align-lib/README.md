# study-align-lib

Client library for talking to the [StudyAlign](https://gitlab.uni-bayreuth.de/studyalign/study-align)
API comfortably. It wraps the REST endpoints and the interaction-logging used by
the StudyAlign admin and study frontends.

## Install

```bash
npm install study-align-lib
```

## Usage

The package ships a UMD bundle that exposes the `StudyAlignLib` class.

```js
import StudyAlignLib from "study-align-lib";

// baseUrl points at the StudyAlign backend; studyId is optional
const sal = new StudyAlignLib("https://your-backend.example.com", studyId);

// each call returns a Promise resolving to { status, body }
const { body: users } = await sal.getUsers(0, 10, "name", "asc");
```

Requests resolve with `{ status, body }` and reject with
`{ status, statusText, requestBody }`.

## Notes

- The published artifact is a plain JavaScript bundle; it does **not** ship
  TypeScript declarations.
- License: AGPL-3.0.
