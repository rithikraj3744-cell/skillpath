// Original foundational review concepts and misconceptions.
export const QUESTION_TOPICS={
  "html": [
    [
      "Semantic structure",
      "Use main for the dominant content of a page.",
      "Use a span to convey every structural role."
    ],
    [
      "Accessible labels",
      "Associate a label with an input through matching for and id values.",
      "A placeholder always replaces a visible label."
    ],
    [
      "Image alternatives",
      "Describe an informative image with useful alternative text.",
      "Every image needs its filename as alternative text."
    ],
    [
      "Heading hierarchy",
      "Organize headings by the logical structure of the content.",
      "Choose heading levels only to change font size."
    ],
    [
      "Form submission",
      "Give controls a name when their values must be submitted.",
      "An id attribute alone guarantees form submission of a value."
    ],
    [
      "Button behavior",
      "Use type=\"button\" for a form button that must not submit.",
      "Every button inside a form should submit the form."
    ],
    [
      "Lists",
      "Use an ordered list when item order carries meaning.",
      "List order can never communicate meaning."
    ],
    [
      "Links",
      "Use an anchor with href for navigation to a destination.",
      "A div without keyboard handling is a complete substitute for a link."
    ],
    [
      "Document language",
      "Set the html lang attribute to help language-aware tools.",
      "The document language is determined only by its background color."
    ],
    [
      "Table headers",
      "Use header cells to describe data table columns or rows.",
      "Bold text in a regular cell always creates header semantics."
    ]
  ],
  "css": [
    [
      "Box model",
      "Padding adds space inside the border around content.",
      "Margin is always inside the border."
    ],
    [
      "Border box",
      "With border-box, a declared width includes padding and border.",
      "Border-box removes every margin from a page."
    ],
    [
      "Flexbox",
      "Flexbox primarily arranges items along one main axis.",
      "Flexbox requires every item to have an absolute position."
    ],
    [
      "Grid",
      "Grid can coordinate rows and columns together.",
      "Grid can control only text color."
    ],
    [
      "Media queries",
      "Media queries conditionally apply styles for matching device or viewport features.",
      "A media query permanently changes the HTML source."
    ],
    [
      "Relative units",
      "rem is relative to the root element font size.",
      "rem always equals one physical pixel."
    ],
    [
      "Cascade",
      "The cascade resolves competing declarations using origins, importance, layers, specificity, and order.",
      "The longest selector always wins regardless of importance."
    ],
    [
      "Overflow",
      "Overflow handling controls content that exceeds its container.",
      "Hidden overflow automatically makes clipped controls accessible."
    ],
    [
      "Responsive images",
      "A constrained image can scale within its container while keeping its aspect ratio.",
      "Every image must have a fixed width wider than the phone screen."
    ],
    [
      "Focus styling",
      "Keep a visible focus style for keyboard interaction.",
      "Removing focus outlines improves keyboard navigation."
    ]
  ],
  "javascript": [
    [
      "Const binding",
      "const prevents reassignment of the binding but does not freeze an object.",
      "const makes every nested property immutable."
    ],
    [
      "Strict equality",
      "Strict equality compares values without type coercion.",
      "Strict equality always converts both operands to strings."
    ],
    [
      "Array mapping",
      "map returns an array of transformed values.",
      "map automatically mutates every source element."
    ],
    [
      "Array filtering",
      "filter returns the elements that satisfy a predicate.",
      "filter always returns exactly one element."
    ],
    [
      "Numeric conversion",
      "Validate a conversion result before using it as a number.",
      "Every string converts to a finite number."
    ],
    [
      "Object properties",
      "An object associates property keys with values.",
      "Object property values must all be strings."
    ],
    [
      "Function return",
      "return supplies a result and ends the current function call.",
      "return always stops the entire application."
    ],
    [
      "Block scope",
      "let and const are scoped to their enclosing block.",
      "A let declaration inside a block is always global."
    ],
    [
      "Default values",
      "The nullish coalescing operator falls back only for null or undefined.",
      "The nullish coalescing operator replaces every zero with its fallback."
    ],
    [
      "Error handling",
      "A catch block can handle an exception thrown in its associated try block.",
      "A try block guarantees that an operation cannot fail."
    ]
  ],
  "dom": [
    [
      "Element selection",
      "querySelector returns the first matching element or null.",
      "querySelector always returns every matching element."
    ],
    [
      "Text content",
      "textContent inserts plain text without interpreting markup.",
      "textContent executes any script string assigned to it."
    ],
    [
      "Event listeners",
      "addEventListener registers a callback for an event type.",
      "addEventListener immediately clicks the element."
    ],
    [
      "Event delegation",
      "A parent listener can handle bubbling events from its descendants.",
      "Event delegation requires one listener for every future child."
    ],
    [
      "Default actions",
      "preventDefault can cancel a cancelable event's default action.",
      "preventDefault always stops event propagation."
    ],
    [
      "Class management",
      "classList provides operations to add or remove class names.",
      "classList can only change the document title."
    ],
    [
      "Element creation",
      "createElement creates a DOM element that can later be inserted.",
      "createElement automatically publishes the element to every page."
    ],
    [
      "Document readiness",
      "Code must access elements after they exist in the document.",
      "A selector always finds elements that have not been parsed yet."
    ],
    [
      "Input values",
      "Read an input's value property for its current entered text.",
      "The original value attribute always tracks every user edit."
    ],
    [
      "Accessible updates",
      "Use appropriate live regions for important dynamic status messages.",
      "Every DOM change is automatically announced by every screen reader."
    ]
  ],
  "async": [
    [
      "Promise states",
      "A promise settles as fulfilled or rejected.",
      "A settled promise repeatedly changes between fulfilled and rejected."
    ],
    [
      "Await",
      "await pauses the enclosing async function until the promise settles.",
      "await freezes every browser tab until the network completes."
    ],
    [
      "Async return",
      "An async function returns a promise.",
      "An async function always returns a plain number."
    ],
    [
      "Rejected requests",
      "Use try and catch around awaited work that can reject.",
      "A rejected promise is always a successful response."
    ],
    [
      "Parallel work",
      "Promise.all combines independent promises and rejects when one rejects.",
      "Promise.all automatically retries every failed operation."
    ],
    [
      "All settled",
      "Promise.allSettled reports each input outcome.",
      "Promise.allSettled silently discards every rejection."
    ],
    [
      "HTTP failures",
      "Check response.ok because fetch can resolve for an HTTP error status.",
      "fetch rejects automatically for every HTTP 404 response."
    ],
    [
      "Cancellation",
      "AbortController can signal cancellation to supported operations.",
      "An abort signal guarantees that a remote write was never processed."
    ],
    [
      "Timeout handling",
      "A timeout should lead to a clear retry or recovery path.",
      "A timeout proves that the server deleted the request."
    ],
    [
      "Stale responses",
      "Check whether a response still belongs to the current UI state.",
      "The last response to arrive always represents the newest user request."
    ]
  ],
  "git": [
    [
      "Working tree",
      "The working tree contains files being edited in the checkout.",
      "Every working-tree edit is already in the remote repository."
    ],
    [
      "Staging",
      "The index selects content for the next commit.",
      "Staging automatically deploys a website."
    ],
    [
      "Commit",
      "A commit records a snapshot with history metadata.",
      "A commit automatically uploads all untracked files."
    ],
    [
      "Status",
      "git status shows tracked changes and staging state.",
      "git status rewrites repository history."
    ],
    [
      "Branch",
      "A branch names a line of development.",
      "Creating a branch deletes the original branch."
    ],
    [
      "Fetch",
      "git fetch retrieves remote objects and refs without automatically merging them into the current branch.",
      "git fetch always merges all remote branches."
    ],
    [
      "Pull",
      "git pull fetches and integrates changes according to configuration.",
      "git pull only displays the current file names."
    ],
    [
      "Merge conflict",
      "Resolve conflicting content deliberately and verify the result.",
      "Choosing either side blindly guarantees a correct merge."
    ],
    [
      "Ignore rules",
      "Ignore rules mainly affect untracked files.",
      "Adding a committed secret to gitignore removes it from past history."
    ],
    [
      "Revert",
      "git revert creates a new commit that reverses specified changes.",
      "git revert necessarily erases all earlier commits."
    ]
  ],
  "rest": [
    [
      "HTTP GET",
      "GET should retrieve a representation without requesting a state change.",
      "GET should be used to delete a private account."
    ],
    [
      "HTTP POST",
      "POST submits data for processing according to an endpoint contract.",
      "POST always means a request cannot be retried safely."
    ],
    [
      "Status codes",
      "A response status communicates the broad result of a request.",
      "A 500 response means the user authenticated successfully."
    ],
    [
      "JSON parsing",
      "Parse and validate JSON before relying on its fields.",
      "Any valid JSON automatically matches the application schema."
    ],
    [
      "Authentication",
      "Authentication establishes the caller's identity.",
      "Authentication alone grants access to every record."
    ],
    [
      "Authorization",
      "Authorization checks whether the caller may perform the requested action.",
      "Hiding a button is sufficient server authorization."
    ],
    [
      "Idempotency",
      "An idempotent operation can be repeated without additional intended effects.",
      "Idempotency means every response must have identical timestamps."
    ],
    [
      "Pagination",
      "Pagination splits a large collection into manageable result pages.",
      "Pagination requires sending all records in every response."
    ],
    [
      "Rate limits",
      "Rate limits bound how frequently clients can perform operations.",
      "Rate limits eliminate the need for authentication."
    ],
    [
      "Input validation",
      "Validate request fields on the server before processing them.",
      "Client-side validation cannot be bypassed."
    ]
  ],
  "firebase": [
    [
      "Service boundaries",
      "Authentication identifies users while Firestore stores application data.",
      "Authentication automatically stores every lesson document."
    ],
    [
      "Project configuration",
      "Web configuration identifies which Firebase project a client uses.",
      "A public web configuration object grants administrator permission."
    ],
    [
      "Service accounts",
      "Keep a service account private key on trusted servers.",
      "A service account key belongs in public browser JavaScript."
    ],
    [
      "Authentication state",
      "Use an auth-state listener to respond to session changes.",
      "A displayed username proves that a session is valid."
    ],
    [
      "Authorization rules",
      "Access still needs rules or trusted server permission checks.",
      "Creating a project makes all user data safe without access controls."
    ],
    [
      "Emulator practice",
      "Local emulators can support development without touching production data.",
      "Local test success proves the production credentials are correct."
    ],
    [
      "Environment separation",
      "Separate development and production data to reduce accidental interference.",
      "Every experiment must use the production learner collection."
    ],
    [
      "Usage monitoring",
      "Monitor reads, writes, storage, and service limits.",
      "A free allowance means unlimited usage of every service."
    ],
    [
      "Client and server",
      "The client presents UI while trusted server code enforces privileged operations.",
      "The browser should decide who becomes an administrator."
    ],
    [
      "Error reporting",
      "Show actionable errors without exposing credentials.",
      "Displaying a private key helps users diagnose login failures."
    ]
  ],
  "auth": [
    [
      "ID tokens",
      "Send a current ID token to authenticate a protected server API request.",
      "A plain email address is equivalent to a verified ID token."
    ],
    [
      "Token verification",
      "A server must verify a token and its project before trusting its claims.",
      "Decoding a token payload alone verifies its signature."
    ],
    [
      "User identifiers",
      "Use the authenticated UID to scope user-owned records.",
      "Let the client choose any UID for private writes."
    ],
    [
      "Auth observers",
      "An auth-state observer reacts to sign-in and sign-out changes.",
      "A one-time username check replaces all session handling."
    ],
    [
      "Provider setup",
      "Enable the intended provider in the authentication project.",
      "Adding a Google logo alone enables Google authentication."
    ],
    [
      "Authorized domains",
      "Configure the hostname used for the supported web sign-in flow.",
      "Any hostname automatically becomes an authorized domain."
    ],
    [
      "Password reset",
      "Verify control of the recovery channel before changing a password.",
      "Anyone who knows an email may set a new password."
    ],
    [
      "Sign-out",
      "Sign-out clears the local authenticated session through the SDK.",
      "Hiding the sign-out button ends the session."
    ],
    [
      "Admin access",
      "Derive administrator access from trusted server configuration or verified claims.",
      "A browser localStorage admin flag grants privileged access."
    ],
    [
      "Session errors",
      "Prompt users to sign in again when a session cannot be verified.",
      "Treat a rejected token as a successful login."
    ]
  ],
  "firestore": [
    [
      "Documents",
      "A document contains fields and belongs to a collection.",
      "Every Firestore document must be a SQL table."
    ],
    [
      "Collections",
      "A collection groups documents.",
      "All documents in a collection must contain identical fields."
    ],
    [
      "Document IDs",
      "Stable IDs can prevent accidental duplicate records.",
      "Creating a random ID always deduplicates repeated requests."
    ],
    [
      "Atomic writes",
      "A batch applies its writes atomically.",
      "A batch guarantees partial updates on failure."
    ],
    [
      "Transactions",
      "A transaction can coordinate reads and writes when data changes concurrently.",
      "Transactions never need to retry on contention."
    ],
    [
      "Indexes",
      "Indexes support the queries a database can execute efficiently.",
      "Indexes replace every authorization rule."
    ],
    [
      "Ownership",
      "Enforce access to user-owned documents using verified identity.",
      "A document path supplied by a client is automatically authorized."
    ],
    [
      "Read costs",
      "Repeated reads can affect usage and latency.",
      "Reading a collection always costs the same as reading one field locally."
    ],
    [
      "Concurrency",
      "Use preconditions or transactions to prevent overwriting newer edits.",
      "The oldest edit should always overwrite newer data."
    ],
    [
      "Data modeling",
      "Choose document boundaries based on access patterns and size constraints.",
      "One ever-growing document is always the best database design."
    ]
  ],
  "security": [
    [
      "Least privilege",
      "Grant only the permissions required for a task.",
      "Every user should receive administrator access by default."
    ],
    [
      "Secret handling",
      "Keep private API secrets out of public assets and logs.",
      "A secret hidden in a CSS file is protected."
    ],
    [
      "Input validation",
      "Validate untrusted inputs at the trusted boundary.",
      "A disabled form field is a reliable server security control."
    ],
    [
      "Output encoding",
      "Encode untrusted text for its output context.",
      "Every string should be interpreted as HTML."
    ],
    [
      "Ownership checks",
      "Verify that the caller may access the requested record.",
      "Knowing a record ID proves ownership."
    ],
    [
      "Transport protection",
      "HTTPS protects data in transit but does not replace application permissions.",
      "HTTPS grants every user permission to modify all data."
    ],
    [
      "Error disclosure",
      "Return useful errors without leaking sensitive internal details.",
      "Raw credential errors should include the full secret value."
    ],
    [
      "Dependency maintenance",
      "Review and update dependencies through a controlled process.",
      "A dependency can never acquire a security vulnerability."
    ],
    [
      "Rate limiting",
      "Bound repeated sensitive actions to reduce abuse.",
      "Unlimited password guesses improve account security."
    ],
    [
      "Recovery verification",
      "A recovery flow needs expiring, single-use proof of control.",
      "An expired recovery code must remain valid forever."
    ]
  ],
  "deployment": [
    [
      "Environment variables",
      "Configure server secrets through the hosting environment.",
      "Commit real service account keys to the source repository."
    ],
    [
      "Same-origin APIs",
      "Relative API paths can work across preview and production origins.",
      "A public app should always call the developer's localhost."
    ],
    [
      "Build checks",
      "Run relevant checks before releasing a changed artifact.",
      "A successful file upload proves every feature works."
    ],
    [
      "Health checks",
      "A liveness endpoint shows whether the application can answer a basic request.",
      "A liveness result proves every external service credential is valid."
    ],
    [
      "Rollback",
      "Keep a way to restore a known-good release.",
      "Delete all earlier releases before checking the new one."
    ],
    [
      "Asset paths",
      "Use paths that match the files included in the deployed artifact.",
      "A file existing on a laptop guarantees it was deployed."
    ],
    [
      "Logs",
      "Use operational logs to diagnose failures without exposing secrets.",
      "Logging every password is required for debugging."
    ],
    [
      "Configuration changes",
      "Redeploy or restart when required for new environment settings to take effect.",
      "Changing a local env file always updates a hosted server immediately."
    ],
    [
      "Release verification",
      "Check a real critical user journey after deployment.",
      "A homepage screenshot proves database writes are correct."
    ],
    [
      "Data compatibility",
      "Plan releases so application code and stored data remain compatible.",
      "Every deployment must erase the production database."
    ]
  ],
  "capstone": [
    [
      "Requirements",
      "Define the user outcome before choosing implementation details.",
      "A capstone is complete as soon as a logo exists."
    ],
    [
      "Vertical workflow",
      "Demonstrate a flow that crosses UI, API, and persistence.",
      "Testing each screenshot separately proves integration."
    ],
    [
      "Authentication boundary",
      "Verify identity and permissions in protected backend routes.",
      "A frontend route guard secures the database by itself."
    ],
    [
      "Validation",
      "Validate data before saving and explain invalid input to users.",
      "Every client payload should be saved unchanged."
    ],
    [
      "Failure recovery",
      "Preserve completed work when an optional service fails.",
      "An AI timeout should erase a saved assessment."
    ],
    [
      "Acceptance criteria",
      "Use observable conditions to decide whether a feature works.",
      "Acceptance criteria should depend only on personal taste."
    ],
    [
      "Testing evidence",
      "Record tested behavior and remaining limits.",
      "Claim every device passed after testing only one browser."
    ],
    [
      "Version control",
      "Keep meaningful commits that support review and recovery.",
      "A single folder with no history is the only way to collaborate."
    ],
    [
      "Documentation",
      "Explain setup, configuration, and important user workflows.",
      "A project should hide all setup requirements from maintainers."
    ],
    [
      "Demonstration",
      "Show the user task and its persisted result.",
      "Changing a color demonstrates every backend requirement."
    ]
  ],
  "python": [
    [
      "Lists",
      "Lists hold ordered collections of values.",
      "Python lists can store only integers."
    ],
    [
      "Dictionaries",
      "Dictionaries map hashable keys to values.",
      "A dictionary requires every value to be unique."
    ],
    [
      "Iteration",
      "A for loop visits items from an iterable.",
      "A for loop can only count from one to ten."
    ],
    [
      "Function returns",
      "A function without an explicit return value returns None.",
      "Every Python function automatically returns zero."
    ],
    [
      "Exceptions",
      "Catch expected exceptions at an appropriate boundary.",
      "A bare except should silently hide every programming defect."
    ],
    [
      "Context managers",
      "A with block manages entry and cleanup for supported resources.",
      "A with block guarantees that its code cannot raise an exception."
    ],
    [
      "Mutability",
      "A list can be changed in place.",
      "A tuple permits reassignment of its individual items."
    ],
    [
      "Slicing",
      "A slice normally excludes its stop index.",
      "A slice always includes the stop index."
    ],
    [
      "Truth values",
      "Empty collections are false in a Boolean context.",
      "Every empty list is true in an if condition."
    ],
    [
      "Virtual environments",
      "A virtual environment isolates project Python packages.",
      "A virtual environment is a separate physical computer."
    ]
  ],
  "sql": [
    [
      "SELECT",
      "SELECT retrieves expressions or columns from a query result.",
      "SELECT always changes every stored row."
    ],
    [
      "WHERE",
      "WHERE filters rows before grouping.",
      "WHERE filters only the final displayed column names."
    ],
    [
      "GROUP BY",
      "GROUP BY combines rows into groups for aggregation.",
      "GROUP BY always sorts the final output."
    ],
    [
      "HAVING",
      "HAVING filters groups using aggregate conditions.",
      "HAVING is only used to rename a database."
    ],
    [
      "INNER JOIN",
      "An inner join keeps combinations that satisfy its join condition.",
      "An inner join always keeps every unmatched row from both tables."
    ],
    [
      "LEFT JOIN",
      "A left join retains left-side rows even when no right-side match exists.",
      "A left join always removes unmatched left rows."
    ],
    [
      "NULL",
      "Use IS NULL to test whether a value is null.",
      "Equality to NULL works like equality to an ordinary number."
    ],
    [
      "Primary keys",
      "A primary key identifies a row uniquely.",
      "A primary key allows duplicate key values in the same table."
    ],
    [
      "Ordering",
      "ORDER BY requests a defined result ordering.",
      "Rows always return in insertion order without ORDER BY."
    ],
    [
      "Parameterized queries",
      "Bind input values instead of concatenating them into SQL.",
      "Concatenating untrusted input is the safest query construction method."
    ]
  ],
  "statistics": [
    [
      "Mean",
      "The mean sums observations and divides by their count.",
      "The mean always equals the most frequent observation."
    ],
    [
      "Median",
      "The median represents the middle of ordered observations.",
      "The median is always the largest observation."
    ],
    [
      "Mode",
      "A mode is a most frequently occurring value.",
      "A mode must occur exactly once."
    ],
    [
      "Variance",
      "Variance measures squared dispersion around the mean.",
      "Variance measures only the number of column names."
    ],
    [
      "Standard deviation",
      "Standard deviation is in the same units as the observations.",
      "Standard deviation always has squared measurement units."
    ],
    [
      "Sampling bias",
      "A large sample can still be systematically unrepresentative.",
      "A large sample automatically eliminates selection bias."
    ],
    [
      "Correlation",
      "Correlation alone does not establish causation.",
      "Every correlation proves that one variable causes the other."
    ],
    [
      "Outliers",
      "Investigate unusual values before deciding how to handle them.",
      "Always delete every extreme value without investigation."
    ],
    [
      "Uncertainty",
      "Report uncertainty and limitations alongside an estimate.",
      "An estimate from a sample is always an exact population value."
    ],
    [
      "Distributions",
      "Inspect the shape and spread as well as a typical value.",
      "One average fully describes every possible distribution."
    ]
  ],
  "data-quality": [
    [
      "Missing values",
      "Choose a missing-data policy based on meaning and use.",
      "Replace every missing value with zero regardless of context."
    ],
    [
      "Duplicates",
      "Define the record key before removing duplicates.",
      "Every pair of rows sharing one value must be a duplicate."
    ],
    [
      "Data types",
      "Validate that values match their intended types.",
      "A numeric-looking string is always safe for arithmetic."
    ],
    [
      "Valid ranges",
      "Check values against justified domain constraints.",
      "Any number is valid for every field."
    ],
    [
      "Consistency",
      "Standardize equivalent categories using a documented mapping.",
      "Different spellings always mean different real categories."
    ],
    [
      "Provenance",
      "Record where data came from and how it was transformed.",
      "Deleting source information improves traceability."
    ],
    [
      "Freshness",
      "Evaluate whether data is recent enough for its intended use.",
      "An old dataset is automatically current if its file opens."
    ],
    [
      "Reconciliation",
      "Compare totals with an independent trusted source or invariant.",
      "A total compared with itself proves accuracy."
    ],
    [
      "Validation errors",
      "Make rejected records and reasons visible for review.",
      "Silently dropping bad rows is always sufficient."
    ],
    [
      "Repeatability",
      "Use reproducible cleaning steps that can run on new inputs.",
      "Manually changing unexplained values is the most reproducible method."
    ]
  ],
  "pandas": [
    [
      "DataFrames",
      "A DataFrame represents labeled tabular data.",
      "A DataFrame can contain only one column."
    ],
    [
      "Column selection",
      "Select a column by its label when its name is known.",
      "Column labels are always numeric row positions."
    ],
    [
      "Boolean filtering",
      "Use a Boolean mask to select matching rows.",
      "A Boolean mask must contain unrelated text labels."
    ],
    [
      "Groupby",
      "Groupby supports aggregation within categories.",
      "Groupby necessarily changes every original record."
    ],
    [
      "Merge keys",
      "Check join keys and cardinality before merging tables.",
      "Every merge preserves the original row count."
    ],
    [
      "Missing data",
      "Use missing-value checks before applying an imputation rule.",
      "Missing values always mean a measured zero."
    ],
    [
      "Sorting",
      "Sort explicitly when output order matters.",
      "Every DataFrame is always sorted by its first column."
    ],
    [
      "Indexing",
      "loc uses labels while iloc uses integer positions.",
      "loc and iloc always mean exactly the same thing."
    ],
    [
      "Vector operations",
      "Column operations can apply calculations across many rows.",
      "Every calculation requires a Python loop over each cell."
    ],
    [
      "Input files",
      "Validate parsed columns and types after loading a file.",
      "A readable CSV guarantees a correct analytical schema."
    ]
  ],
  "visualization": [
    [
      "Bar charts",
      "Bar charts compare values across categories.",
      "A bar chart requires continuous time on every axis."
    ],
    [
      "Line charts",
      "Line charts can show change across ordered time points.",
      "A line chart proves one variable causes another."
    ],
    [
      "Scatterplots",
      "A scatterplot shows relationships between two numeric variables.",
      "A scatterplot can only show one category name."
    ],
    [
      "Axis labels",
      "Label units so readers can interpret quantities.",
      "Units should always be omitted to save space."
    ],
    [
      "Baseline choices",
      "Use an honest baseline and explain nonstandard axis choices.",
      "Truncating a bar axis can never exaggerate differences."
    ],
    [
      "Color accessibility",
      "Use labels or shapes as well as color for essential distinctions.",
      "Color alone is always sufficient for every viewer."
    ],
    [
      "Aggregation",
      "Choose aggregation that matches the analytical question.",
      "Summing percentages is always meaningful."
    ],
    [
      "Overplotting",
      "Adjust the display when many points hide each other.",
      "Overlapping points always make a chart more accurate to read."
    ],
    [
      "Uncertainty display",
      "Show uncertainty when it materially affects interpretation.",
      "Every estimate must look perfectly precise."
    ],
    [
      "Audience focus",
      "Choose charts that help answer the reader's actual question.",
      "The most decorative chart is always the most informative."
    ]
  ],
  "ml-foundations": [
    [
      "Supervised learning",
      "Supervised learning uses examples with target labels.",
      "Supervised learning never uses target labels."
    ],
    [
      "Regression",
      "Regression predicts a numeric quantity.",
      "Regression always predicts a named class only."
    ],
    [
      "Classification",
      "Classification predicts a category or class.",
      "Classification can never produce class probabilities."
    ],
    [
      "Training data",
      "Fit model parameters using the training portion.",
      "Train on the final test labels before evaluating."
    ],
    [
      "Validation data",
      "Use validation data for model selection and tuning.",
      "Validation and final test data must always be the same records."
    ],
    [
      "Test data",
      "Reserve test data for final evaluation of the chosen approach.",
      "Repeatedly tuning to test results preserves an unbiased final test."
    ],
    [
      "Baselines",
      "Compare complex models against a simple reference approach.",
      "A complex model is useful even if it loses to a simple baseline."
    ],
    [
      "Leakage",
      "Exclude information unavailable at prediction time.",
      "Using future outcomes as current inputs is always valid."
    ],
    [
      "Overfitting",
      "A model can fit training examples well and generalize poorly.",
      "Perfect training accuracy guarantees perfect future performance."
    ],
    [
      "Feature preparation",
      "Fit preprocessing on training data and apply it consistently elsewhere.",
      "Fit preprocessing on all test labels before splitting the data."
    ]
  ],
  "model-evaluation": [
    [
      "Precision",
      "Precision measures the share of predicted positives that are correct.",
      "Precision is the share of all actual positives that were found."
    ],
    [
      "Recall",
      "Recall measures the share of actual positives that were found.",
      "Recall counts only how many negative predictions were correct."
    ],
    [
      "Accuracy",
      "Accuracy is the fraction of predictions that are correct.",
      "High accuracy always proves usefulness on an imbalanced dataset."
    ],
    [
      "Confusion matrix",
      "A confusion matrix separates true and false prediction outcomes.",
      "A confusion matrix shows only a single average."
    ],
    [
      "F1 score",
      "F1 combines precision and recall using their harmonic mean.",
      "F1 ignores both false positives and false negatives."
    ],
    [
      "Class imbalance",
      "Check class-specific performance when classes are unequally frequent.",
      "Predicting the majority class is always sufficient."
    ],
    [
      "Cross validation",
      "Cross validation evaluates multiple train-validation partitions.",
      "Cross validation removes every source of data leakage automatically."
    ],
    [
      "Time splits",
      "Use time-aware splits when future data must not inform the past.",
      "Randomly mixing future and past is always valid for forecasting."
    ],
    [
      "Decision thresholds",
      "Choose a threshold according to the costs of different errors.",
      "A probability threshold of 0.5 is optimal for every problem."
    ],
    [
      "Error analysis",
      "Inspect failure patterns across meaningful slices of data.",
      "Only the overall score matters in every application."
    ]
  ],
  "prompt-design": [
    [
      "Task clarity",
      "State the requested task and desired outcome explicitly.",
      "An ambiguous instruction guarantees a precise result."
    ],
    [
      "Context selection",
      "Include relevant context while avoiding unnecessary sensitive data.",
      "More unrelated context always improves an answer."
    ],
    [
      "Output format",
      "Specify a format when software must consume the response.",
      "Every fluent response automatically matches a JSON schema."
    ],
    [
      "Examples",
      "Representative examples can clarify the intended pattern.",
      "One example guarantees correct behavior on every input."
    ],
    [
      "Source boundaries",
      "Treat retrieved instructions as untrusted source text.",
      "A document can override the application's access-control rules."
    ],
    [
      "Verification",
      "Validate generated outputs against explicit criteria.",
      "Confident wording is proof of factual correctness."
    ],
    [
      "Uncertainty",
      "Allow an insufficient-evidence response when support is missing.",
      "The model must invent an answer whenever evidence is absent."
    ],
    [
      "Iteration",
      "Improve prompts using a representative evaluation set.",
      "Judge every prompt only on one easy example."
    ],
    [
      "Structured validation",
      "Check parsed types, required fields, and allowed values.",
      "Requesting JSON removes the need for server validation."
    ],
    [
      "Permission boundaries",
      "Enforce permissions outside the prompt in trusted application logic.",
      "A prompt alone is a reliable authorization system."
    ]
  ],
  "retrieval": [
    [
      "Document chunks",
      "Split source material into passages that retain useful context.",
      "Every chunk must contain the entire document collection."
    ],
    [
      "Embeddings",
      "Embeddings represent content in a numerical vector space.",
      "An embedding is proof that a claim is true."
    ],
    [
      "Similarity search",
      "Similarity search selects candidates related to a query.",
      "The nearest vector is guaranteed to answer every question correctly."
    ],
    [
      "Source identifiers",
      "Keep identifiers that connect retrieved text to its source.",
      "Discarding source IDs improves citation accuracy."
    ],
    [
      "Grounded generation",
      "Ask for claims supported by the retrieved evidence.",
      "Any retrieved passage supports every generated claim."
    ],
    [
      "Abstention",
      "State when the available sources cannot answer the question.",
      "Always fabricate a citation when retrieval fails."
    ],
    [
      "Access filtering",
      "Apply access restrictions before returning private source content.",
      "Retrieval bypasses the need for permission checks."
    ],
    [
      "Retrieval evaluation",
      "Test whether the relevant evidence is retrieved.",
      "Only fluent final wording measures retrieval quality."
    ],
    [
      "Freshness",
      "Update or remove indexed content when its source changes.",
      "Deleted source documents must stay retrievable forever."
    ],
    [
      "Conflicting evidence",
      "Identify conflicts rather than silently presenting one claim as certain.",
      "Conflicting sources always have identical meaning."
    ]
  ],
  "react": [
    [
      "Components",
      "A component encapsulates part of an interface.",
      "Every component must directly rewrite the entire document."
    ],
    [
      "Props",
      "Props pass data into a component.",
      "A child should mutate its incoming props to update the parent."
    ],
    [
      "State",
      "State represents data that can change and trigger rendering.",
      "Changing a plain local variable always triggers a React render."
    ],
    [
      "Stable keys",
      "Use stable identities for items in changing lists.",
      "Generate a new random key on every render for each item."
    ],
    [
      "Immutable updates",
      "Create updated objects or arrays when changing state.",
      "Mutating an existing state object is always a reliable update signal."
    ],
    [
      "Derived values",
      "Calculate values that can be derived directly from current state.",
      "Store every derived count as independent duplicated state."
    ],
    [
      "Events",
      "Pass a handler for an event instead of invoking it during render.",
      "Call every click handler immediately while rendering the button."
    ],
    [
      "Controlled inputs",
      "A controlled input gets its value from component state.",
      "A controlled input can never respond to user typing."
    ],
    [
      "Effects",
      "Use effects to synchronize with systems outside React rendering.",
      "Use an effect for every value that can be directly calculated."
    ],
    [
      "Data flow",
      "Keep shared state at an appropriate common owner.",
      "Unrelated duplicate state always remains automatically synchronized."
    ]
  ],
  "ux-design": [
    [
      "User research",
      "Investigate real user tasks and constraints.",
      "Research should only confirm the designer's first idea."
    ],
    [
      "Interview evidence",
      "Ask for concrete past experiences rather than leading praise.",
      "Ask every participant to agree that the design is perfect."
    ],
    [
      "Task flows",
      "Map the steps and decisions needed to complete a task.",
      "A task flow must only list colors."
    ],
    [
      "Wireframes",
      "Use wireframes to explore structure before detailed styling.",
      "A wireframe must already contain production code."
    ],
    [
      "Prototypes",
      "A prototype lets people try important interactions.",
      "A polished prototype proves every backend feature works."
    ],
    [
      "Usability testing",
      "Observe whether users can complete realistic tasks.",
      "Tell users every click and call that independent usability testing."
    ],
    [
      "Focus visibility",
      "Show where keyboard focus is located.",
      "Remove all focus indicators for keyboard users."
    ],
    [
      "Consistency",
      "Reuse recognizable patterns for similar actions.",
      "Identical labels should perform unrelated actions without explanation."
    ],
    [
      "Error messages",
      "Explain the problem and a useful next action.",
      "Show only an unexplained error number for every user mistake."
    ],
    [
      "Evidence-based iteration",
      "Revise a design using observed problems and outcomes.",
      "Ignore task failures if the designer likes the screen."
    ]
  ],
  "testing": [
    [
      "Expected results",
      "State the expected outcome before evaluating a test.",
      "A test needs only clicks and no expected behavior."
    ],
    [
      "Boundary cases",
      "Test values on and around important limits.",
      "Middle-range values reveal every boundary error."
    ],
    [
      "Equivalence classes",
      "Select representative inputs from behaviorally similar groups.",
      "Every input value must produce identical behavior."
    ],
    [
      "Unit tests",
      "Unit tests focus on a small piece of logic.",
      "Every unit test must access the production database."
    ],
    [
      "Integration tests",
      "Integration tests check interactions between components.",
      "Integration testing checks only the spelling of a title."
    ],
    [
      "End-to-end tests",
      "End-to-end tests exercise a meaningful user workflow.",
      "A screenshot of a button proves the workflow completed."
    ],
    [
      "Regression tests",
      "Regression tests help detect failures in previously working behavior.",
      "A regression test should never be rerun after changes."
    ],
    [
      "Defect reports",
      "Record reproducible steps and expected versus actual outcomes.",
      "A report saying broken without context is always sufficient."
    ],
    [
      "Test isolation",
      "Keep test data and state independent when possible.",
      "One test should depend on an unrelated test's leftover data."
    ],
    [
      "Risk selection",
      "Prioritize tests according to impact and likelihood of failure.",
      "The number of tests alone proves product reliability."
    ]
  ],
  "test-automation": [
    [
      "Role locators",
      "Use accessible roles and names to identify user-facing controls.",
      "A random generated CSS class is always the most stable locator."
    ],
    [
      "Assertions",
      "Assert an observable outcome after performing an action.",
      "A successful click alone proves the intended result occurred."
    ],
    [
      "Condition waits",
      "Wait for a meaningful state instead of a fixed arbitrary delay.",
      "A fixed pause guarantees every network request is finished."
    ],
    [
      "Independent data",
      "Create or reset data so tests can run independently.",
      "All tests must share one mutable production account."
    ],
    [
      "API checks",
      "Use API checks for service behavior that does not require browser rendering.",
      "Every service assertion must use pixel coordinates."
    ],
    [
      "Failure traces",
      "Capture useful evidence to diagnose a failed run.",
      "Deleting every failure trace makes diagnosis easier."
    ],
    [
      "Retries",
      "Investigate flaky behavior rather than hiding it with unlimited retries.",
      "Retrying until green proves the application never failed."
    ],
    [
      "Mocked responses",
      "Mocks can exercise controlled failures and edge cases.",
      "Mocked tests prove the live external provider is healthy."
    ],
    [
      "Cross-browser checks",
      "Run relevant workflows in the browsers the product supports.",
      "Passing in one browser proves every other browser behaves identically."
    ],
    [
      "Continuous checks",
      "Run valuable automated checks as part of the delivery workflow.",
      "Automation should never run after source changes."
    ]
  ],
  "etl": [
    [
      "Extraction",
      "Read data from a defined source with known access and schema.",
      "Extraction automatically fixes every source quality problem."
    ],
    [
      "Transformation",
      "Transform data according to explicit business and quality rules.",
      "Every transformation must silently drop invalid rows."
    ],
    [
      "Loading",
      "Write transformed data into the intended destination.",
      "Loading means deleting every destination table regardless of the task."
    ],
    [
      "Idempotency",
      "Reprocessing the same input should avoid duplicate intended results.",
      "Retrying a daily file should double every sales total."
    ],
    [
      "Incremental jobs",
      "Process new or changed records using a defined change boundary.",
      "An incremental job always reloads all historical data."
    ],
    [
      "Checkpoints",
      "Advance a successful checkpoint after the intended load succeeds.",
      "Advance a checkpoint before any destination writes succeed."
    ],
    [
      "Rejected records",
      "Record invalid rows and reasons for investigation.",
      "Invalid records should always disappear without a trace."
    ],
    [
      "Schema changes",
      "Detect source structure changes and handle compatibility deliberately.",
      "A renamed source column can never affect a pipeline."
    ],
    [
      "Observability",
      "Record counts, failures, timing, and successful completion.",
      "A pipeline needs no evidence of what it processed."
    ],
    [
      "Reconciliation",
      "Compare loaded results with source totals or independent controls.",
      "A successful job status alone proves every row is correct."
    ]
  ],
  "business-intelligence": [
    [
      "Metric definitions",
      "Define the unit, time window, and aggregation rule.",
      "A metric title alone guarantees identical interpretation."
    ],
    [
      "Table grain",
      "State what one row in a table represents.",
      "Table grain describes only the background color."
    ],
    [
      "Fact tables",
      "Fact tables record events or measurements at a defined grain.",
      "Every fact table must contain one row for the entire company."
    ],
    [
      "Dimensions",
      "Dimensions describe entities or contexts used to analyze facts.",
      "Dimensions always contain only aggregate totals."
    ],
    [
      "Join cardinality",
      "Check match counts to avoid unintentionally multiplying measures.",
      "Every join preserves all numerical totals automatically."
    ],
    [
      "Measures",
      "A measure computes a value in an analytical context.",
      "A measure is always just a decorative chart label."
    ],
    [
      "Filter context",
      "Make active filters visible when interpreting a dashboard.",
      "Filters can never change a dashboard total."
    ],
    [
      "Trend charts",
      "Use a consistent time grain when comparing trends.",
      "Mixing daily and annual points without explanation improves comparisons."
    ],
    [
      "Reconciliation",
      "Check reported totals against a trusted calculation.",
      "A visually attractive chart guarantees numerical accuracy."
    ],
    [
      "Decision focus",
      "Design a dashboard around the decisions its audience needs to make.",
      "Add every possible chart regardless of user needs."
    ]
  ],
  "linux": [
    [
      "Working directory",
      "pwd reports the current working directory.",
      "pwd prints every stored password."
    ],
    [
      "File listing",
      "ls lists directory entries.",
      "ls always deletes the files it displays."
    ],
    [
      "Paths",
      "An absolute path starts from the filesystem root.",
      "Every relative path starts from the root regardless of context."
    ],
    [
      "Quoting",
      "Quote paths containing spaces to preserve their intended argument boundaries.",
      "Spaces never affect shell argument parsing."
    ],
    [
      "Pipes",
      "A pipe connects one command's output to another command's input.",
      "A pipe automatically grants root privileges."
    ],
    [
      "Redirection",
      "Output redirection can write command output to a file.",
      "Redirecting output always preserves an existing file unchanged."
    ],
    [
      "Permissions",
      "Permissions control read, write, and execute access.",
      "Making all files world-writable is the safest default."
    ],
    [
      "Processes",
      "Inspect the process identity before attempting to stop it.",
      "Every process ID refers to the same program forever."
    ],
    [
      "Manual pages",
      "Use command documentation to understand options and behavior.",
      "A command copied from the internet is always safe without inspection."
    ],
    [
      "Privilege",
      "Run tasks with only the privileges they require.",
      "Every file operation requires an administrator shell."
    ]
  ],
  "networking": [
    [
      "IP addresses",
      "An IP address identifies a network interface or endpoint in its context.",
      "An IP address is a user's password."
    ],
    [
      "Ports",
      "Ports distinguish transport service endpoints on a host.",
      "A port always describes a physical monitor connector."
    ],
    [
      "DNS",
      "DNS provides records associated with domain names.",
      "DNS automatically authorizes access to every application account."
    ],
    [
      "TCP",
      "TCP provides an ordered reliable byte stream.",
      "TCP guarantees that an application will never return an error."
    ],
    [
      "HTTP",
      "HTTP defines request and response semantics.",
      "HTTP alone determines all database permissions."
    ],
    [
      "TLS",
      "TLS protects communication in transit and helps authenticate the server.",
      "TLS makes every stored database record publicly writable."
    ],
    [
      "Routing",
      "Routing selects paths for packets between networks.",
      "Routing changes the color of browser links."
    ],
    [
      "Latency",
      "Latency measures delay, distinct from data-transfer capacity.",
      "High bandwidth guarantees zero delay."
    ],
    [
      "Layered diagnosis",
      "Distinguish name resolution, connectivity, and application errors.",
      "Every failed web request is caused by the same network layer."
    ],
    [
      "Local versus remote",
      "A localhost address refers to the machine making the request.",
      "localhost always points to the developer's laptop for every visitor."
    ]
  ],
  "cloud": [
    [
      "Compute choices",
      "Choose compute services according to control and operational needs.",
      "Every cloud workload requires a manually maintained virtual machine."
    ],
    [
      "Object storage",
      "Object storage holds data as objects with identifiers and metadata.",
      "Object storage automatically acts as every relational database."
    ],
    [
      "Identity",
      "Use scoped service identities for application operations.",
      "All services should share a public administrator credential."
    ],
    [
      "Regions",
      "Choose locations according to latency, availability, and data requirements.",
      "Every region is physically in the same place."
    ],
    [
      "Backups",
      "A backup plan should include restoration checks.",
      "A backup filename alone proves the data can be recovered."
    ],
    [
      "Scaling",
      "Scale according to workload and service limits.",
      "Scaling always removes every performance bottleneck automatically."
    ],
    [
      "Failure handling",
      "Plan for timeouts and partial service failures.",
      "Cloud services make network failures impossible."
    ],
    [
      "Usage budgets",
      "Track usage and understand free allowances and billing behavior.",
      "A free allowance guarantees unlimited use at no cost."
    ],
    [
      "Managed services",
      "Managed services transfer some operational tasks to the provider.",
      "A managed service removes every application security responsibility."
    ],
    [
      "Configuration",
      "Keep environment configuration separate from public application assets.",
      "Put production service secrets in downloadable JavaScript."
    ]
  ],
  "containers": [
    [
      "Images",
      "An image is a reusable filesystem and runtime template.",
      "An image is only a screenshot of a running server."
    ],
    [
      "Containers",
      "A container runs a process from an image with isolation boundaries.",
      "Every container is a fully independent physical computer."
    ],
    [
      "Volumes",
      "Use persistent storage for data that must survive container replacement.",
      "A disposable container layer is the only safe location for durable data."
    ],
    [
      "Port publishing",
      "Publish a container port deliberately when a host needs to reach it.",
      "Every container port is automatically public on the internet."
    ],
    [
      "Build context",
      "Limit build inputs and exclude secrets and unnecessary files.",
      "Copying all private files into the image is always harmless."
    ],
    [
      "Runtime secrets",
      "Provide secrets securely at runtime rather than baking them into layers.",
      "Deleting a key in a later layer guarantees it never existed in the image."
    ],
    [
      "Dependency versions",
      "Pin or otherwise control dependencies for reproducible builds.",
      "Unbounded dependency changes always produce the same build."
    ],
    [
      "Least privilege",
      "Run container processes with the privileges they need.",
      "Every container must run with unrestricted host access."
    ],
    [
      "Logs",
      "Inspect application logs and health signals when diagnosing a container.",
      "A running process guarantees every user request is healthy."
    ],
    [
      "Host kernel",
      "Containers generally share the host operating system kernel.",
      "Each ordinary container always boots its own separate kernel."
    ]
  ],
  "ci-cd": [
    [
      "Continuous integration",
      "Run checks when changes are integrated or proposed.",
      "Continuous integration means skipping tests to merge faster."
    ],
    [
      "Build artifacts",
      "Associate a release artifact with its source revision.",
      "A release artifact should have no identifiable source history."
    ],
    [
      "Required checks",
      "Stop promotion when a required check fails.",
      "A failed required test should be marked successful automatically."
    ],
    [
      "Deployment environments",
      "Separate practice or staging environments from production where appropriate.",
      "Every test run must modify production data."
    ],
    [
      "Secrets",
      "Use a secret store with scoped access for pipeline credentials.",
      "Print all deployment credentials in public logs."
    ],
    [
      "Smoke tests",
      "Check a small critical workflow after a release.",
      "A smoke test must validate every possible input in the application."
    ],
    [
      "Rollback",
      "Define how to restore a known-good release.",
      "A rollback plan is unnecessary whenever a build succeeds."
    ],
    [
      "Database compatibility",
      "Consider data compatibility alongside application rollback.",
      "Restoring old code always reverses every database migration."
    ],
    [
      "Flaky tests",
      "Investigate nondeterministic failures instead of hiding them indefinitely.",
      "Unlimited retries are proof of stable behavior."
    ],
    [
      "Release traceability",
      "Record which change produced the deployed artifact.",
      "The newest file date always identifies the exact source commit."
    ]
  ],
  "cybersecurity": [
    [
      "Confidentiality",
      "Restrict information access to authorized parties.",
      "Confidentiality means everyone can read every private record."
    ],
    [
      "Integrity",
      "Protect information against unauthorized or accidental modification.",
      "Integrity means data is never checked for changes."
    ],
    [
      "Availability",
      "Keep services usable by authorized users when needed.",
      "Availability requires disabling every authentication control."
    ],
    [
      "Multi-factor authentication",
      "Use factors from different categories to strengthen identity verification.",
      "Two copies of the same password are two independent factors."
    ],
    [
      "Least privilege",
      "Grant only the access needed for a role or task.",
      "Every account needs permanent administrator permissions."
    ],
    [
      "Patch management",
      "Apply updates through a controlled process to address known issues.",
      "Software can never need a security update after installation."
    ],
    [
      "Incident evidence",
      "Preserve relevant logs during investigation.",
      "Delete all logs before investigating an alert."
    ],
    [
      "Containment",
      "Limit ongoing impact while following an incident-response process.",
      "Containment always means publishing private user data."
    ],
    [
      "Authorized testing",
      "Test only systems you own or have explicit permission to assess.",
      "Any publicly reachable system permits unrestricted testing."
    ],
    [
      "Recovery",
      "Confirm normal service and address the cause after an incident.",
      "An incident is resolved solely by changing the homepage color."
    ]
  ]
};
