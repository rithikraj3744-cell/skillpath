# Import questions from Excel

Open **Admin Studio → Question Bank → Import Excel**. Download the example, edit the Questions worksheet, upload it, choose the worksheet, review the detected answers, and select **Import reviewed questions**.

The example contains 40 HTML questions and a Guide sheet with all 35 starter competency IDs. Its unchanged questions already exist after applying the learning-library update, so importing them again skips duplicates. Replace the example questions with your own to add new material.

| Column | Meaning |
| --- | --- |
| Competency ID | Existing ID such as `html`, or an exact competency name. A selected default can fill blank cells. |
| Question | Required question text, at most 2,000 characters |
| Option A–F | 2–6 distinct, consecutive options; at most 200 characters each |
| Correct Answer | Letter A–F, number 1–6, or exact option text. Letters avoid ambiguity. |
| Explanation | Recommended teaching explanation, at most 3,000 characters |
| Concept | Tested concept, at most 120 characters; defaults to competency name |
| Difficulty | Beginner, Intermediate, or Advanced; defaults to Beginner |
| Question ID | Optional unique lowercase ID, at most 80 characters; omit to generate a stable ID |

Common aliases such as `Skill`, `Question Text`, `Answer Key`, and `Rationale` are recognized. The header must be within the first 20 rows. The importer reads the answer key supplied by the teacher; it does not guess which answer is correct with AI.

Incomplete, ambiguous and duplicate worksheet rows are flagged. Fix them in the workbook and upload again. The preview shows the first 100 rows, while validation covers all detected rows. The complete import is blocked until every row is valid. Content is escaped when displayed, and every imported record is validated again on the server.

Supported: `.xlsx`, `.xls`, `.csv`; up to 5 MB and 5,000 question rows. Use values, not formulas; encrypted workbooks and merged question layouts are not supported. Questions and answers must be in columns, one question per row.

Imports add questions only. Existing IDs or identical normalized question text within a competency are preserved and skipped. Edit existing answers using the normal question editor. Each request commits an atomic batch of at most 40 questions, bounded to 60 KB. If an import is interrupted, earlier batches remain saved; re-import the file to safely skip those rows and continue.

Every competency needs **at least 40 bank questions**. A quiz randomly selects exactly 40 and shuffles the answer choices. Banks may contain more than 40 questions. The built-in library contains exactly 40 for each of 35 competencies (1,400 total). These are foundation review questions, not a professionally validated certification exam.
