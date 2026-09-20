# Native questionnaires (design)

A minimalistic, built-in questionnaire builder so simple studies need no external
survey tool. Qualtrics (and LimeSurvey) stay the escape hatch for anything
advanced: branching, piping, quotas, multilingual, complex logic.

## Scope

In scope (first version):

- Item types: `display` (description text), `text` (short/long), `number`,
  `slider` (VAS / numeric continuous, with optional left/right anchors),
  `choice` (single or multiple; radio, checkbox, or dropdown), `scale`
  (Likert item or matrix, including semantic differential via bipolar anchors).
- Multi-page questionnaires. Groups are visual sections on a page only, no
  semantics.
- Templates: seeded global presets (demographics, SUS, UEQ, NASA-TLX). Used by
  deep copy. CSI (Creativity Support Index) is deliberately out for now (its
  pairwise weighting does not fit the flat model yet).
- Required fields and validation.
- Item-order randomization (per page, and per scale rows).
- Behavior config: allow back navigation, show progress bar.
- Participant view with instant save and resume-on-refresh.
- Responses in the study data view and in the export.

Out of scope (later phases): ranking/forced choice, skip logic, piping, i18n,
per-template scoring.

## Naming

The existing `Questionnaire` model is only a pointer to an external survey
(`system` + `url`). The native builder is a separate entity, called `Form` in
the code to avoid collision. It surfaces to researchers and participants as a
"questionnaire". A native questionnaire is reached through the existing
`questionnaire` procedure step with the new `system: "native"`, referencing a
`Form` instead of a URL.

## Model

- `Form`: `id`, `name`, `description`, `definition` (JSONB, the whole
  structure), `is_template` (bool), `is_global` (bool), `slug` (nullable, used
  to seed and dedupe templates), `owner_id` (user, nullable), `study_id`
  (study, nullable), `version` (int), `created_at`, `updated_at`.
  - Templates: `is_template = true`, `study_id = null`.
  - Study questionnaires: `is_template = false`, `study_id` set. Created from
    scratch or by copying a template.
- `FormResponse`: `id`, `form_id`, `participant_id`, `study_id`,
  `form_version`, `answers` (JSONB, keyed by item key), `submitted` (bool),
  `created_at`, `updated_at`. One row per participant per form (upsert).

### Definition JSON

```jsonc
{
  "settings": { "allow_back": true, "show_progress": true, "randomize_pages": false },
  "pages": [
    {
      "id": "p1",
      "title": "Optional section title",
      "randomize_items": false,
      "items": [
        { "id": "i1", "type": "display", "html": "<p>Welcome ...</p>" },
        { "id": "i2", "type": "number", "key": "age", "label": "Age",
          "required": true, "config": { "min": 18, "max": 120, "step": 1 } },
        { "id": "i3", "type": "text", "key": "role", "label": "Your role",
          "required": false, "config": { "multiline": false } },
        { "id": "i3b", "type": "slider", "key": "confidence", "label": "How confident?",
          "required": false,
          "config": { "min": 0, "max": 100, "step": 1, "left": "Not at all", "right": "Very" } },
        { "id": "i4", "type": "choice", "key": "gender", "label": "Gender",
          "required": true,
          "config": { "multiple": false, "render": "radio",
                      "options": [ { "value": "f", "label": "Female" } ] } },
        { "id": "i5", "type": "scale", "key": "sus", "label": "Please rate ...",
          "required": true,
          "config": {
            "points": [ { "value": 1, "label": "Strongly disagree" },
                        { "value": 5, "label": "Strongly agree" } ],
            "rows": [ { "key": "sus_1", "text": "I think that I would like ..." } ],
            "randomize_rows": false,
            "bipolar": false, "left": null, "right": null
          } }
      ]
    }
  ]
}
```

Answers are keyed by item `key` (and, for scales, by each row `key`):

```jsonc
{ "age": 34, "role": "researcher", "gender": "f", "sus_1": 4, "sus_2": 2 }
```

For a multi-select `choice` the value is an array of option values.

Storing answers as JSONB keyed by stable keys keeps the first version small.
Export flattens them to one column per key. A normalized long table
(`participant, form_version, item_key, value`) is the likely later step if
answers need heavy querying.

### Versioning and immutability

Editing a study questionnaire bumps `Form.version`. Once a study is running its
questionnaires are frozen (same running check the other study entities use), so
answers stay interpretable. `FormResponse.form_version` records what the
participant actually saw.

Copy-on-place: adding a native step copies the chosen global questionnaire into a
study-scoped `Form`. The step stores `source_form_id` (the global you picked, for
the editor) and `form_id` (the study copy that participants render). Editing the
global source afterwards never changes a placed study; changing the source in the
editor re-copies and drops the previous copy. The study copy is study-scoped, so a
running study is frozen with the rest of its entities, and a study can even
customize its own copy without touching the global.

## API

Forms (researcher, `userAccessTokenValidator`):

- `GET /forms/templates` list global templates.
- `POST /forms/from-template/{template_id}` deep-copy a template into a study.
- `GET /studies/{study_id}/forms` list a study's questionnaires.
- `POST /forms` create, `GET /forms/{id}`, `PATCH /forms/{id}`,
  `DELETE /forms/{id}` (blocked while running).

Responses (participant, `ParticipantValidator`):

- `GET /forms/{form_id}/response` current participant's saved answers (resume).
- `PUT /forms/{form_id}/response` upsert answers (autosave); `submitted` flag
  set on final submit. Server re-validates required on submit.

Responses (researcher):

- `GET /studies/{study_id}/form-responses` for the data view and export.

## Frontend

Admin: an interactive builder (pages, items, per-item config, required,
randomize) plus a configuration view (back navigation, progress bar). A template
picker seeds the definition by copy.

Study: a renderer that walks pages, applies randomization once per participant,
autosaves (debounced) to the response endpoint, rehydrates from the server on
refresh, enforces required at page-forward and submit, then advances the
procedure. No iframe, no passthrough, direct procedure advance on submit.

Data view: a "Questionnaire responses" tab in the study view, and inclusion of
responses in the study export, mirroring the interaction data pattern.

## Non-negotiables

- Server-side validation on submit (never trust the client).
- Definition versioning and running-study immutability.
- Stable item keys so exports have durable columns.
