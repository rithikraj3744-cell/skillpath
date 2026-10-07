export const EXTRA_CONTENT={
  "competencies": [
    {
      "id": "python",
      "name": "Python Foundations",
      "prerequisites": [],
      "category": "Data",
      "difficulty": "Beginner",
      "requiredLevel": 90,
      "description": "Use lists, dictionaries, loops, and functions to solve small data problems."
    },
    {
      "id": "sql",
      "name": "SQL for Analysis",
      "prerequisites": [],
      "category": "Data",
      "difficulty": "Beginner",
      "requiredLevel": 90,
      "description": "Filter rows, aggregate groups, and join related tables."
    },
    {
      "id": "statistics",
      "name": "Statistics for Decisions",
      "prerequisites": [],
      "category": "Data",
      "difficulty": "Beginner",
      "requiredLevel": 90,
      "description": "Interpret averages, spread, samples, and uncertainty."
    },
    {
      "id": "data-quality",
      "name": "Data Quality",
      "prerequisites": [
        "sql"
      ],
      "category": "Data",
      "difficulty": "Intermediate",
      "requiredLevel": 90,
      "description": "Audit missing values, duplicates, units, and keys before analysis."
    },
    {
      "id": "pandas",
      "name": "Data Analysis with pandas",
      "prerequisites": [
        "python",
        "data-quality"
      ],
      "category": "Data",
      "difficulty": "Intermediate",
      "requiredLevel": 90,
      "description": "Inspect, filter, and summarize tabular data with explicit assumptions."
    },
    {
      "id": "visualization",
      "name": "Data Storytelling",
      "prerequisites": [
        "statistics",
        "pandas"
      ],
      "category": "Data",
      "difficulty": "Intermediate",
      "requiredLevel": 90,
      "description": "Choose readable charts and explain their limits."
    },
    {
      "id": "ml-foundations",
      "name": "Machine Learning Foundations",
      "prerequisites": [
        "python",
        "statistics"
      ],
      "category": "AI",
      "difficulty": "Intermediate",
      "requiredLevel": 90,
      "description": "Frame prediction tasks and establish a baseline."
    },
    {
      "id": "model-evaluation",
      "name": "Model Evaluation",
      "prerequisites": [
        "ml-foundations",
        "pandas"
      ],
      "category": "AI",
      "difficulty": "Intermediate",
      "requiredLevel": 90,
      "description": "Evaluate models using suitable metrics and held-out data."
    },
    {
      "id": "prompt-design",
      "name": "AI Prompt Design",
      "prerequisites": [
        "python"
      ],
      "category": "AI",
      "difficulty": "Beginner",
      "requiredLevel": 90,
      "description": "Specify tasks, context, constraints, and verifiable output formats."
    },
    {
      "id": "retrieval",
      "name": "Retrieval-Augmented Applications",
      "prerequisites": [
        "prompt-design",
        "model-evaluation"
      ],
      "category": "AI",
      "difficulty": "Advanced",
      "requiredLevel": 90,
      "description": "Ground answers in retrieved material and measure answer quality."
    }
  ],
  "careers": [
    {
      "id": "data-analyst",
      "name": "Data Analyst",
      "description": "Build a foundation in Python, SQL, data quality, and clear analytical communication.",
      "competencyIds": [
        "python",
        "sql",
        "statistics",
        "data-quality",
        "pandas",
        "visualization",
        "git"
      ]
    },
    {
      "id": "applied-ai",
      "name": "Applied AI Developer",
      "description": "Develop foundations in data handling, evaluation, prompt design, and grounded AI applications.",
      "competencyIds": [
        "python",
        "sql",
        "statistics",
        "data-quality",
        "pandas",
        "ml-foundations",
        "model-evaluation",
        "prompt-design",
        "retrieval",
        "git"
      ]
    }
  ],
  "modules": [
    {
      "id": "python-module",
      "title": "Python Foundations",
      "competencyId": "python",
      "objectives": [
        "Use lists, dictionaries, loops, and functions to solve small data problems.",
        "Complete the worked example and explain its assumptions.",
        "Verify the practice activity with a small hand-checked example."
      ],
      "content": "A list keeps an ordered sequence; a dictionary associates keys with values. Choose a structure that matches the question you need to answer. Use a function to name a repeatable operation and return its result instead of only printing it.\n\nWorked example\nscores = [60, 80, 100]\naverage = sum(scores) / len(scores)\nThe result is 80.0. An empty list needs an explicit policy because division by zero is invalid. A score of zero is valid data and should not be confused with missing data.\n\nCheck your work\nTry an empty list, one score, and several scores. Do not change the input list unless the function contract explicitly says so.",
      "practice": "Write summarize(scores) that returns the count, minimum, maximum, and average. Return None for statistics on an empty list. Verify [60,80,100] returns count 3 and average 80.0.",
      "durationMinutes": 60,
      "resources": [
        {
          "label": "Read the reference documentation",
          "url": "https://docs.python.org/3/tutorial/"
        }
      ]
    },
    {
      "id": "sql-module",
      "title": "SQL for Analysis",
      "competencyId": "sql",
      "objectives": [
        "Filter rows, aggregate groups, and join related tables.",
        "Complete the worked example and explain its assumptions.",
        "Verify the practice activity with a small hand-checked example."
      ],
      "content": "Start with the grain: what does one row represent? A sales row might represent one order line rather than one customer. WHERE filters rows before aggregation; GROUP BY forms groups; HAVING filters the resulting groups.\n\nWorked example\nSELECT department, AVG(score) AS average_score\nFROM results\nWHERE score IS NOT NULL\nGROUP BY department;\n\nA join can multiply rows when multiple records match. Compare row counts and totals before and after joining. NULL indicates a missing or unknown value; test it with IS NULL, not = NULL.",
      "practice": "Create six results rows across two departments, including one NULL score. Calculate department averages and counts. Join a department lookup and confirm the join does not duplicate results.",
      "durationMinutes": 60,
      "resources": [
        {
          "label": "Read the reference documentation",
          "url": "https://www.postgresql.org/docs/current/tutorial-sql.html"
        }
      ]
    },
    {
      "id": "statistics-module",
      "title": "Statistics for Decisions",
      "competencyId": "statistics",
      "objectives": [
        "Interpret averages, spread, samples, and uncertainty.",
        "Complete the worked example and explain its assumptions.",
        "Verify the practice activity with a small hand-checked example."
      ],
      "content": "A summary should describe both the typical value and the variation. The mean uses every value and is sensitive to extreme observations. The median is the middle value after sorting and is often useful for skewed data.\n\nWorked example\nFor [10, 11, 12, 13, 100], the mean is 29.2 and the median is 12. Reporting only the mean hides the shape of this small dataset.\n\nReason carefully\nAn association does not establish a cause. A sample can be biased even when it contains many rows. Explain where observations came from, who may be missing, and whether the sample supports the conclusion.",
      "practice": "Compare the mean and median of [10,11,12,13,100]. Write three sentences explaining the difference, the outlier, and why five observations are insufficient for a broad population claim.",
      "durationMinutes": 60,
      "resources": [
        {
          "label": "Read the reference documentation",
          "url": "https://developers.google.com/machine-learning/crash-course"
        }
      ]
    },
    {
      "id": "data-quality-module",
      "title": "Data Quality",
      "competencyId": "data-quality",
      "objectives": [
        "Audit missing values, duplicates, units, and keys before analysis.",
        "Complete the worked example and explain its assumptions.",
        "Verify the practice activity with a small hand-checked example."
      ],
      "content": "Write a data contract before cleaning. State the row grain, required fields, valid ranges, units, and uniqueness rules. A duplicate is defined by the business key, not merely by whether every field happens to match.\n\nWorked example\nIf order_id is unique, two rows with the same order_id need investigation. If one row represents an order line, the key may instead be (order_id, line_number). A price of 100 is ambiguous without a currency and unit.\n\nSafe workflow\nKeep raw data, record each transformation, and produce an audit summary. Do not replace every missing number with zero: zero may have a different meaning. Compare counts and totals before and after cleaning.",
      "practice": "Audit a ten-row orders table containing a missing customer ID, repeated order ID, negative quantity, and inconsistent currency. Record each issue and justify every correction without overwriting the raw file.",
      "durationMinutes": 60,
      "resources": [
        {
          "label": "Read the reference documentation",
          "url": "https://pandas.pydata.org/docs/getting_started/intro_tutorials/"
        }
      ]
    },
    {
      "id": "pandas-module",
      "title": "Data Analysis with pandas",
      "competencyId": "pandas",
      "objectives": [
        "Inspect, filter, and summarize tabular data with explicit assumptions.",
        "Complete the worked example and explain its assumptions.",
        "Verify the practice activity with a small hand-checked example."
      ],
      "content": "A DataFrame represents a table with labeled rows and columns. Inspect column types and missing values before calculating results. Filter with explicit conditions and group rows at the grain your question requires.\n\nWorked example\nFor a table with department and score columns, df.groupby(\"department\")[\"score\"].mean() calculates each department mean. Missing scores are excluded by this mean calculation, so also report the non-missing count.\n\nValidate results\nCheck one small group by hand. A merge can multiply records when keys are not unique. Document whether your output is one row per event, learner, or department.",
      "practice": "Load a small CSV, inspect dtypes and missing values, filter invalid scores, and produce a department summary with count and mean. Hand-calculate one group to verify the output.",
      "durationMinutes": 60,
      "resources": [
        {
          "label": "Read the reference documentation",
          "url": "https://pandas.pydata.org/docs/getting_started/intro_tutorials/"
        }
      ]
    },
    {
      "id": "visualization-module",
      "title": "Data Storytelling",
      "competencyId": "visualization",
      "objectives": [
        "Choose readable charts and explain their limits.",
        "Complete the worked example and explain its assumptions.",
        "Verify the practice activity with a small hand-checked example."
      ],
      "content": "Choose a chart based on the comparison. Bars compare categories; lines show ordered changes such as time; scatter plots show relationships between two numeric variables. Label units and the time period.\n\nWorked example\nTo compare weekly completed lessons, use a line chart with weeks in chronological order and completions on the vertical axis. For a one-week comparison between departments, bars usually make comparison easier.\n\nCommunicate honestly\nA truncated bar-chart baseline can exaggerate differences because viewers compare lengths. Do not rely on color alone. State the main observation, a plausible limitation, and the next question; do not claim the chart proves causation.",
      "practice": "Create a bar chart of department averages and a line chart of weekly completions. Add units, descriptive titles, a text summary, and a note about sample size.",
      "durationMinutes": 60,
      "resources": [
        {
          "label": "Read the reference documentation",
          "url": "https://pandas.pydata.org/docs/getting_started/intro_tutorials/"
        }
      ]
    },
    {
      "id": "ml-foundations-module",
      "title": "Machine Learning Foundations",
      "competencyId": "ml-foundations",
      "objectives": [
        "Frame prediction tasks and establish a baseline.",
        "Complete the worked example and explain its assumptions.",
        "Verify the practice activity with a small hand-checked example."
      ],
      "content": "In supervised learning, inputs are features and the quantity to predict is a label. Regression predicts a numeric value; classification predicts a class. Start with a simple baseline before choosing a more complex model.\n\nWorked example\nPredicting the number of study hours is regression. Predicting whether a learner will finish a course is classification. Include only features that would be available when the prediction is made. Using final exam results to predict an earlier outcome leaks future information.\n\nWorkflow\nDefine the target, split the data, train on training data, tune using validation data, and reserve test data for the final evaluation. A high training score alone is not evidence of useful performance.",
      "practice": "Define a course-completion prediction task. List five candidate features, remove any unavailable at prediction time, propose a majority-class baseline, and explain your train/validation/test split.",
      "durationMinutes": 60,
      "resources": [
        {
          "label": "Read the reference documentation",
          "url": "https://developers.google.com/machine-learning/crash-course"
        }
      ]
    },
    {
      "id": "model-evaluation-module",
      "title": "Model Evaluation",
      "competencyId": "model-evaluation",
      "objectives": [
        "Evaluate models using suitable metrics and held-out data.",
        "Complete the worked example and explain its assumptions.",
        "Verify the practice activity with a small hand-checked example."
      ],
      "content": "Accuracy is the fraction of correct predictions, but it can conceal poor behavior on rare classes. Precision asks how often a positive prediction is correct. Recall asks how many actual positives are detected. Choose metrics according to the costs of errors.\n\nWorked example\nIf 95 of 100 examples are negative, predicting negative every time gives 95% accuracy but detects none of the positives. A confusion matrix makes this failure visible.\n\nEvaluation discipline\nFit preprocessing only on training data. Use validation data for model choices and report final performance on held-out test data. Also inspect errors across meaningful subgroups and report sample sizes.",
      "practice": "For TP=8, FP=2, FN=4, TN=86, calculate precision, recall, and accuracy. Explain why the best metric depends on the application. Compare against an always-negative classifier.",
      "durationMinutes": 60,
      "resources": [
        {
          "label": "Read the reference documentation",
          "url": "https://scikit-learn.org/stable/modules/model_evaluation.html"
        }
      ]
    },
    {
      "id": "prompt-design-module",
      "title": "AI Prompt Design",
      "competencyId": "prompt-design",
      "objectives": [
        "Specify tasks, context, constraints, and verifiable output formats.",
        "Complete the worked example and explain its assumptions.",
        "Verify the practice activity with a small hand-checked example."
      ],
      "content": "A useful prompt states the task, provides relevant context, and defines the expected output. Separate source material from instructions. Include examples when a format would otherwise be ambiguous.\n\nWorked example\nAsk an assistant to summarize a supplied lesson in three bullet points and name any uncertainty. Evaluate the summary against the lesson instead of judging only how confident it sounds. When software consumes the output, request a defined structure and validate it before use.\n\nBoundaries\nTreat retrieved text as untrusted data. A prompt alone is not an authorization mechanism. Keep secrets out of prompts and evaluate failures as well as successful examples.",
      "practice": "Write a prompt that extracts a title and three objectives from a supplied lesson. Test it with a normal lesson, an empty input, and source text that contains misleading instructions. Define expected behavior for each case.",
      "durationMinutes": 60,
      "resources": [
        {
          "label": "Read the reference documentation",
          "url": "https://ai.google.dev/gemini-api/docs/prompting-strategies"
        }
      ]
    },
    {
      "id": "retrieval-module",
      "title": "Retrieval-Augmented Applications",
      "competencyId": "retrieval",
      "objectives": [
        "Ground answers in retrieved material and measure answer quality.",
        "Complete the worked example and explain its assumptions.",
        "Verify the practice activity with a small hand-checked example."
      ],
      "content": "A retrieval-augmented workflow first selects relevant source passages and then asks a model to answer using them. Retrieval and generation can fail independently: the answer may be wrong because the correct source was never retrieved.\n\nDesign the flow\nSplit documents into useful passages, retain source identifiers, retrieve relevant passages for a question, and ask for an answer grounded in those passages. Display references and permit an insufficient-evidence response. Similarity is not proof that a passage supports a claim.\n\nTest it\nUse questions with known supporting passages, questions the collection cannot answer, and conflicting sources. Check retrieval coverage, claim support, access permissions, and whether deleted documents stop appearing.",
      "practice": "Design a lesson Q&A assistant over three documents. Write five answerable and two unanswerable questions. For each expected answer, identify the supporting passage and specify how missing evidence should be reported.",
      "durationMinutes": 60,
      "resources": [
        {
          "label": "Read the reference documentation",
          "url": "https://developers.google.com/machine-learning/crash-course"
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "python-q1",
      "competencyId": "python",
      "prompt": "Which structure maps a learner ID to a score?",
      "options": [
        "Dictionary",
        "Set",
        "Float",
        "Boolean"
      ],
      "correctIndex": 0,
      "explanation": "A dictionary maps keys to values.",
      "concept": "data structures",
      "difficulty": "Beginner"
    },
    {
      "id": "python-q2",
      "competencyId": "python",
      "prompt": "What is sum([2,4,6]) / len([2,4,6])?",
      "options": [
        "6.0",
        "4.0",
        "3.0",
        "12.0"
      ],
      "correctIndex": 1,
      "explanation": "The sum is 12 and the count is 3, so the mean is 4.0.",
      "concept": "aggregation",
      "difficulty": "Beginner"
    },
    {
      "id": "python-q3",
      "competencyId": "python",
      "prompt": "What should an average function check before dividing by the item count?",
      "options": [
        "Whether the list is empty",
        "Whether all values are strings",
        "Whether a loop exists",
        "Whether printing is enabled"
      ],
      "correctIndex": 0,
      "explanation": "An empty list has a count of zero.",
      "concept": "edge cases",
      "difficulty": "Beginner"
    },
    {
      "id": "sql-q1",
      "competencyId": "sql",
      "prompt": "Which clause filters groups after aggregation?",
      "options": [
        "WHERE",
        "HAVING",
        "ORDER BY",
        "SELECT DISTINCT"
      ],
      "correctIndex": 1,
      "explanation": "HAVING filters aggregate groups.",
      "concept": "aggregation",
      "difficulty": "Beginner"
    },
    {
      "id": "sql-q2",
      "competencyId": "sql",
      "prompt": "How do you test for a missing SQL value?",
      "options": [
        "= NULL",
        "IS NULL",
        "= 0",
        "LIKE NULL"
      ],
      "correctIndex": 1,
      "explanation": "IS NULL is the predicate for a null value.",
      "concept": "missing values",
      "difficulty": "Beginner"
    },
    {
      "id": "sql-q3",
      "competencyId": "sql",
      "prompt": "Why can a join increase a total unexpectedly?",
      "options": [
        "Multiple matching rows duplicate contributions",
        "Joins always remove duplicates",
        "SQL converts every number to zero",
        "GROUP BY is mandatory"
      ],
      "correctIndex": 0,
      "explanation": "A one-to-many join can repeat the values from the one side.",
      "concept": "join grain",
      "difficulty": "Beginner"
    },
    {
      "id": "statistics-q1",
      "competencyId": "statistics",
      "prompt": "What is the median of [2,3,4,5,100]?",
      "options": [
        "22.8",
        "100",
        "4",
        "5"
      ],
      "correctIndex": 2,
      "explanation": "The middle of the five sorted values is 4.",
      "concept": "median",
      "difficulty": "Beginner"
    },
    {
      "id": "statistics-q2",
      "competencyId": "statistics",
      "prompt": "Does correlation alone prove causation?",
      "options": [
        "Yes",
        "No",
        "Only for large samples",
        "Only with a chart"
      ],
      "correctIndex": 1,
      "explanation": "Confounding or selection can explain an association.",
      "concept": "causation",
      "difficulty": "Beginner"
    },
    {
      "id": "statistics-q3",
      "competencyId": "statistics",
      "prompt": "Which statistic is usually more affected by a single extreme value?",
      "options": [
        "Mean",
        "Median",
        "Count of columns",
        "Mode in every case"
      ],
      "correctIndex": 0,
      "explanation": "An extreme value directly affects the sum used by the mean.",
      "concept": "outliers",
      "difficulty": "Beginner"
    },
    {
      "id": "data-quality-q1",
      "competencyId": "data-quality",
      "prompt": "What should define a duplicate record?",
      "options": [
        "The intended business key",
        "The file size",
        "Its position in a CSV",
        "The dashboard color"
      ],
      "correctIndex": 0,
      "explanation": "Uniqueness depends on the data grain and business key.",
      "concept": "keys",
      "difficulty": "Intermediate"
    },
    {
      "id": "data-quality-q2",
      "competencyId": "data-quality",
      "prompt": "Why not replace every missing amount with zero?",
      "options": [
        "Zero may imply a real measured amount",
        "Zero is not numeric",
        "It always changes the schema",
        "It prevents sorting"
      ],
      "correctIndex": 0,
      "explanation": "Missing and measured zero have different meanings.",
      "concept": "missing values",
      "difficulty": "Intermediate"
    },
    {
      "id": "data-quality-q3",
      "competencyId": "data-quality",
      "prompt": "Which artifact makes cleaning reproducible?",
      "options": [
        "A transformation log and preserved raw data",
        "Only a screenshot",
        "Deleting source files",
        "Manually changing numbers without notes"
      ],
      "correctIndex": 0,
      "explanation": "A log and raw input allow others to repeat and audit the work.",
      "concept": "reproducibility",
      "difficulty": "Intermediate"
    },
    {
      "id": "pandas-q1",
      "competencyId": "pandas",
      "prompt": "What is a pandas DataFrame?",
      "options": [
        "A labeled table",
        "Only a single integer",
        "An HTML element",
        "An HTTP status"
      ],
      "correctIndex": 0,
      "explanation": "A DataFrame is a two-dimensional labeled data structure.",
      "concept": "DataFrame",
      "difficulty": "Intermediate"
    },
    {
      "id": "pandas-q2",
      "competencyId": "pandas",
      "prompt": "Which operation groups records for summaries?",
      "options": [
        "groupby",
        "print only",
        "rename only",
        "head only"
      ],
      "correctIndex": 0,
      "explanation": "groupby splits records by key for aggregation.",
      "concept": "grouping",
      "difficulty": "Intermediate"
    },
    {
      "id": "pandas-q3",
      "competencyId": "pandas",
      "prompt": "What should accompany a group mean with missing data?",
      "options": [
        "The count of non-missing observations",
        "Only its color",
        "The Python logo",
        "The file extension"
      ],
      "correctIndex": 0,
      "explanation": "The count shows how many observations contributed to the mean.",
      "concept": "interpretation",
      "difficulty": "Intermediate"
    },
    {
      "id": "visualization-q1",
      "competencyId": "visualization",
      "prompt": "Which chart usually suits changes over ordered weeks?",
      "options": [
        "Line chart",
        "Unordered pie chart",
        "Word cloud",
        "A decorative icon"
      ],
      "correctIndex": 0,
      "explanation": "A line connects measurements in their ordered sequence.",
      "concept": "chart selection",
      "difficulty": "Intermediate"
    },
    {
      "id": "visualization-q2",
      "competencyId": "visualization",
      "prompt": "Why should a bar-chart baseline normally start at zero?",
      "options": [
        "Bar lengths encode magnitude",
        "Zero improves all correlations",
        "It hides missing data",
        "Every chart must start at zero"
      ],
      "correctIndex": 0,
      "explanation": "A truncated baseline can distort length comparisons.",
      "concept": "honest scales",
      "difficulty": "Intermediate"
    },
    {
      "id": "visualization-q3",
      "competencyId": "visualization",
      "prompt": "How can a chart be more accessible?",
      "options": [
        "Provide text labels and a summary",
        "Use color as the only signal",
        "Remove units",
        "Shrink all text"
      ],
      "correctIndex": 0,
      "explanation": "Labels and text alternatives help readers who cannot distinguish colors or see the chart.",
      "concept": "accessibility",
      "difficulty": "Intermediate"
    },
    {
      "id": "ml-foundations-q1",
      "competencyId": "ml-foundations",
      "prompt": "Predicting a house price is normally which task?",
      "options": [
        "Regression",
        "Classification of file types",
        "Clustering only",
        "Authentication"
      ],
      "correctIndex": 0,
      "explanation": "Price is a numeric target.",
      "concept": "task framing",
      "difficulty": "Intermediate"
    },
    {
      "id": "ml-foundations-q2",
      "competencyId": "ml-foundations",
      "prompt": "What is data leakage?",
      "options": [
        "Using information unavailable at prediction time",
        "Using a separate test set",
        "Recording a random seed",
        "Comparing a baseline"
      ],
      "correctIndex": 0,
      "explanation": "Leaked information makes evaluation unrealistically optimistic.",
      "concept": "leakage",
      "difficulty": "Intermediate"
    },
    {
      "id": "ml-foundations-q3",
      "competencyId": "ml-foundations",
      "prompt": "Why build a simple baseline?",
      "options": [
        "To judge whether added complexity improves results",
        "To avoid evaluation",
        "To guarantee perfect accuracy",
        "To replace all labels"
      ],
      "correctIndex": 0,
      "explanation": "A baseline provides a meaningful comparison.",
      "concept": "baselines",
      "difficulty": "Intermediate"
    },
    {
      "id": "model-evaluation-q1",
      "competencyId": "model-evaluation",
      "prompt": "What is precision when TP=8 and FP=2?",
      "options": [
        "0.8",
        "0.67",
        "0.5",
        "1.0"
      ],
      "correctIndex": 0,
      "explanation": "Precision is TP/(TP+FP) = 8/10.",
      "concept": "precision",
      "difficulty": "Intermediate"
    },
    {
      "id": "model-evaluation-q2",
      "competencyId": "model-evaluation",
      "prompt": "What is recall when TP=8 and FN=4?",
      "options": [
        "1.0",
        "0.8",
        "About 0.67",
        "0.08"
      ],
      "correctIndex": 2,
      "explanation": "Recall is TP/(TP+FN) = 8/12.",
      "concept": "recall",
      "difficulty": "Intermediate"
    },
    {
      "id": "model-evaluation-q3",
      "competencyId": "model-evaluation",
      "prompt": "On which split should a scaler be fitted?",
      "options": [
        "Training data only",
        "All data including test",
        "Test data only",
        "Whichever split gives the best score"
      ],
      "correctIndex": 0,
      "explanation": "Fitting preprocessing on test data leaks information.",
      "concept": "evaluation hygiene",
      "difficulty": "Intermediate"
    },
    {
      "id": "prompt-design-q1",
      "competencyId": "prompt-design",
      "prompt": "What makes an extraction prompt easier to validate?",
      "options": [
        "An explicit output schema",
        "A request to be impressive",
        "No source text",
        "A hidden API key"
      ],
      "correctIndex": 0,
      "explanation": "A schema defines the fields and types the application can check.",
      "concept": "structured output",
      "difficulty": "Beginner"
    },
    {
      "id": "prompt-design-q2",
      "competencyId": "prompt-design",
      "prompt": "How should embedded instructions inside a retrieved document be treated?",
      "options": [
        "As untrusted source data",
        "As higher priority commands",
        "As administrator permission",
        "As a new API key"
      ],
      "correctIndex": 0,
      "explanation": "Source text must not override the application instructions.",
      "concept": "untrusted data",
      "difficulty": "Beginner"
    },
    {
      "id": "prompt-design-q3",
      "competencyId": "prompt-design",
      "prompt": "What is a good way to evaluate a prompt?",
      "options": [
        "Use representative cases and explicit success criteria",
        "Judge only confident wording",
        "Try one easy example",
        "Count decorative words"
      ],
      "correctIndex": 0,
      "explanation": "A varied test set exposes failure modes.",
      "concept": "evaluation",
      "difficulty": "Beginner"
    },
    {
      "id": "retrieval-q1",
      "competencyId": "retrieval",
      "prompt": "What does retrieval add to a generation workflow?",
      "options": [
        "Relevant source passages",
        "A guarantee of truth",
        "Automatic administrator access",
        "Unlimited context"
      ],
      "correctIndex": 0,
      "explanation": "Retrieved passages provide context but still require validation.",
      "concept": "grounding",
      "difficulty": "Advanced"
    },
    {
      "id": "retrieval-q2",
      "competencyId": "retrieval",
      "prompt": "What should happen when sources cannot answer a question?",
      "options": [
        "State that evidence is insufficient",
        "Invent a citation",
        "Use private unrelated files",
        "Pretend the answer was verified"
      ],
      "correctIndex": 0,
      "explanation": "An explicit limit is more reliable than an unsupported answer.",
      "concept": "abstention",
      "difficulty": "Advanced"
    },
    {
      "id": "retrieval-q3",
      "competencyId": "retrieval",
      "prompt": "Which failure can occur before generation?",
      "options": [
        "The retriever misses the relevant passage",
        "A user receives a password reset",
        "A CSS class changes",
        "An icon fails to load"
      ],
      "correctIndex": 0,
      "explanation": "Missing context can make a correct grounded answer impossible.",
      "concept": "retrieval evaluation",
      "difficulty": "Advanced"
    }
  ]
};
