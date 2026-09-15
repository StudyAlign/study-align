# Example study exports

Ready-to-import StudyAlign study definitions. Import them in the admin
frontend via **Import Study** (drop the file or paste its contents), then adjust
the survey/prototype URLs, dates, and copy to your needs.

| File | Design |
| --- | --- |
| [`exploratory-study.json`](./exploratory-study.json) | An open, single-group exploratory session: welcome → demographics → one prototype condition → post-task feedback → thank you. |
| [`comparative-study-a-vs-b.json`](./comparative-study-a-vs-b.json) | A within-subjects A/B comparison: welcome → demographics → a **block** containing Variant A and Variant B (their order is counterbalanced) → comparison questionnaire → thank you. |

## Format

Each file is a `StudyImport` object:

```jsonc
{
  "study": { "name", "startDate", "endDate", "invite_only",
             "description", "consent", "planned_number_participants" },
  "procedure_config": {
    "procedure_config_steps": [
      { "order": 0, "counterbalance": false, "text":          { "title", "body" } },
      { "order": 1, "counterbalance": false, "questionnaire": { "url", "system" } },
      { "order": 2, "counterbalance": false, "condition":     { "name", "config", "url" } },
      { "order": 3, "counterbalance": false, "pause":         { "title", "body", "proceed_body", "type", "config" } },
      { "order": 4, "counterbalance": false, "block":         { "procedure_config_steps": [ /* nested steps */ ] } }
    ]
  }
}
```

- Each step wraps exactly one of `text`, `questionnaire`, `condition`, `pause`, or `block`.
- `counterbalance: true` on the steps inside a `block` randomises their order
  across participants — that is how the A/B example counterbalances the variants.
- `description` and `consent` are HTML (as produced by the rich-text editor).
- `questionnaire.system` is e.g. `"limesurvey"` or `"qualtrics"`.

# Example questionnaires (LimeSurvey)

Ready-to-import **LimeSurvey** surveys (`.lss`). These are the questionnaires a
`questionnaire` step points at — import them into LimeSurvey, not StudyAlign.

| File | Questionnaire |
| --- | --- |
| [`nasa-tlx.lss`](./nasa-tlx.lss) | **NASA-TLX** (Raw / RTLX): the six workload scales (mental, physical, temporal demand; performance; effort; frustration) as one multiple-numeric question, each a 0–100 slider in steps of 5. |
| [`sus.lss`](./sus.lss) | **System Usability Scale** (Brooke, 1996): the ten items as a 1–5 array (strongly disagree – strongly agree). **Pre-wired for StudyAlign** (hidden fields, panel-integration URL params, and the proceed End URL — see below). |

Import in LimeSurvey via **Surveys → Create → Import survey structure**, then
copy the survey's public URL into a StudyAlign `questionnaire` step
(`system: "limesurvey"`). StudyAlign passes `SAL_ID` and `SAL_TOKEN` as URL
parameters, so the response can be tied back to the participant.

> Raw TLX averages the six scales unweighted (no pairwise-comparison weighting).
> Performance runs good → poor (0 = perfect, 100 = failure); reverse it before
> averaging if you want "higher = more workload" throughout.

## StudyAlign integration (already baked into `sus.lss`)

`sus.lss` ships with the wiring below, so it is ready to drop into a study. To
add the same to another questionnaire, reproduce these three steps:

1. **Hidden fields.** Two hidden short-text questions store the study id and the
   participant token: `SALID` and `SALTOKEN` (both flagged "always hide").
2. **Panel Integration.** Two survey URL parameters map the incoming params to
   those fields: `SAL_ID → SALID` and `SAL_TOKEN → SALTOKEN`.
3. **Text Elements → End URL** returns the participant to StudyAlign, passing the
   captured values through:
   ```
   http://localhost:8000/{PASSTHRU:SAL_ID}/proceed/{PASSTHRU:SAL_TOKEN}
   ```
   The **End message** is `Please click on the following link`; LimeSurvey
   appends the End URL to it automatically when the survey ends.

> **Change the End URL host** to your deployment — `localhost:8000` is the local
> dev backend. Registering the params in Panel Integration is what makes both the
> hidden-field capture *and* the `{PASSTHRU:…}` substitution work.
