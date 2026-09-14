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
