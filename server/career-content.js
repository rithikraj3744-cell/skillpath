// Career expansion: original lessons and assessment questions.
export const CAREER_CONTENT={
  "competencies": [
    {
      "id": "react",
      "name": "React Components",
      "prerequisites": [
        "dom",
        "async"
      ],
      "category": "Frontend",
      "difficulty": "Intermediate",
      "description": "Build reusable components with props, state, and predictable data flow.",
      "requiredLevel": 90
    },
    {
      "id": "ux-design",
      "name": "UX Research & Interface Design",
      "prerequisites": [],
      "category": "Design",
      "difficulty": "Beginner",
      "description": "Turn user needs into accessible wireframes and testable prototypes.",
      "requiredLevel": 90
    },
    {
      "id": "testing",
      "name": "Software Testing Fundamentals",
      "prerequisites": [],
      "category": "Quality",
      "difficulty": "Beginner",
      "description": "Design repeatable tests and write useful defect reports.",
      "requiredLevel": 90
    },
    {
      "id": "test-automation",
      "name": "Browser Test Automation",
      "prerequisites": [
        "testing",
        "javascript"
      ],
      "category": "Quality",
      "difficulty": "Intermediate",
      "description": "Automate user journeys with stable locators and meaningful assertions.",
      "requiredLevel": 90
    },
    {
      "id": "etl",
      "name": "Data Pipelines & ETL",
      "prerequisites": [
        "python",
        "sql",
        "data-quality"
      ],
      "category": "Data",
      "difficulty": "Intermediate",
      "description": "Move and transform data with validation and safe retries.",
      "requiredLevel": 90
    },
    {
      "id": "business-intelligence",
      "name": "BI Dashboards & Data Modeling",
      "prerequisites": [
        "sql",
        "visualization"
      ],
      "category": "Data",
      "difficulty": "Intermediate",
      "description": "Define metrics and build dashboards that answer business questions.",
      "requiredLevel": 90
    },
    {
      "id": "linux",
      "name": "Linux & Command Line",
      "prerequisites": [],
      "category": "Infrastructure",
      "difficulty": "Beginner",
      "description": "Navigate files, inspect processes, and apply basic permissions.",
      "requiredLevel": 90
    },
    {
      "id": "networking",
      "name": "Networking Fundamentals",
      "prerequisites": [],
      "category": "Infrastructure",
      "difficulty": "Beginner",
      "description": "Explain DNS, IP addresses, ports, HTTP, and TLS.",
      "requiredLevel": 90
    },
    {
      "id": "cloud",
      "name": "Cloud Computing Foundations",
      "prerequisites": [
        "networking",
        "linux"
      ],
      "category": "Infrastructure",
      "difficulty": "Intermediate",
      "description": "Compare compute, storage, identity, and reliability choices.",
      "requiredLevel": 90
    },
    {
      "id": "containers",
      "name": "Containers & Docker",
      "prerequisites": [
        "linux"
      ],
      "category": "Infrastructure",
      "difficulty": "Intermediate",
      "description": "Package an application with reproducible dependencies and persistent storage.",
      "requiredLevel": 90
    },
    {
      "id": "ci-cd",
      "name": "CI/CD & Release Safety",
      "prerequisites": [
        "git",
        "testing",
        "containers"
      ],
      "category": "Infrastructure",
      "difficulty": "Intermediate",
      "description": "Build repeatable checks and release with a recovery plan.",
      "requiredLevel": 90
    },
    {
      "id": "cybersecurity",
      "name": "Cybersecurity Foundations",
      "prerequisites": [
        "networking",
        "linux"
      ],
      "category": "Security",
      "difficulty": "Intermediate",
      "description": "Recognize risks and build a defensive incident-response checklist.",
      "requiredLevel": 90
    }
  ],
  "modules": [
    {
      "id": "react-module",
      "title": "React Components",
      "competencyId": "react",
      "objectives": [
        "Build reusable components with props, state, and predictable data flow.",
        "Complete the practical activity and explain the result."
      ],
      "content": "Break a screen into components with one clear responsibility. Props pass data from a parent; local state stores values that change after interaction. Render a list with stable IDs as keys so the UI can track each item.\n\nExample: a task list owns an array of tasks and passes each task to a TaskRow. A checkbox calls a callback that updates the array with map rather than mutating it. The new state triggers the next render.\n\nKeep derived values such as the number of completed tasks calculated from state. Use effects for synchronization with external systems, not to duplicate a value that can be computed during render.",
      "practice": "Build a task list with add, complete, and filter controls. Use stable keys and show an empty state.",
      "durationMinutes": 60,
      "resources": []
    },
    {
      "id": "ux-design-module",
      "title": "UX Research & Interface Design",
      "competencyId": "ux-design",
      "objectives": [
        "Turn user needs into accessible wireframes and testable prototypes.",
        "Complete the practical activity and explain the result."
      ],
      "content": "Start with a task a real user needs to finish. Ask about the last time they performed it and observe where they hesitate. Record evidence separately from your assumptions. A short task flow shows decisions, entry points, and completion.\n\nExample: a learner wants to resume a lesson. A wireframe places the current lesson and its next action before secondary information. Test the flow by asking someone to resume learning without telling them which control to press.\n\nUse consistent spacing, meaningful labels, visible keyboard focus, and sufficient contrast. A polished prototype still needs usability checks. Measure task completion and note obstacles rather than asking only whether the design looks attractive.",
      "practice": "Design a three-screen learning flow on paper or in Figma. Test it with two people and document one change based on their actions.",
      "durationMinutes": 60,
      "resources": []
    },
    {
      "id": "testing-module",
      "title": "Software Testing Fundamentals",
      "competencyId": "testing",
      "objectives": [
        "Design repeatable tests and write useful defect reports.",
        "Complete the practical activity and explain the result."
      ],
      "content": "A test compares observed behavior with an explicit expected result. Use unit tests for focused logic, integration tests for boundaries, and a smaller number of end-to-end tests for important user journeys. Passing tests reduce uncertainty; they do not prove the absence of all defects.\n\nExample: an input accepts ages from 18 to 60. Check 17, 18, 60, and 61, as well as missing and invalid input. Boundary cases often reveal mistakes that a typical value misses.\n\nA defect report includes environment, reproducible steps, expected behavior, actual behavior, and relevant evidence. Retest the fix and nearby behavior. Choose regression tests by impact and likelihood, not by counting as many tests as possible.",
      "practice": "Write six test cases for sign-in, including invalid credentials, empty input, a blocked popup, and a network failure. Produce one reproducible defect report.",
      "durationMinutes": 60,
      "resources": []
    },
    {
      "id": "test-automation-module",
      "title": "Browser Test Automation",
      "competencyId": "test-automation",
      "objectives": [
        "Automate user journeys with stable locators and meaningful assertions.",
        "Complete the practical activity and explain the result."
      ],
      "content": "An automated browser test should exercise a user outcome. Prefer accessible role and label locators because they describe what users interact with. Wait for observable UI conditions rather than using arbitrary delays.\n\nExample: fill a task input, press Add task, and assert that the new task appears in the list. A click without an assertion cannot tell you whether the feature worked. Create independent test data so one failure does not corrupt the next test.\n\nSeparate an application defect from a test-environment failure. Save useful traces when a test fails. Keep a small set of high-value end-to-end checks and test detailed logic closer to the code.",
      "practice": "Automate adding and completing a task in your own local app. Assert the visible result and reset test data between runs.",
      "durationMinutes": 60,
      "resources": []
    },
    {
      "id": "etl-module",
      "title": "Data Pipelines & ETL",
      "competencyId": "etl",
      "objectives": [
        "Move and transform data with validation and safe retries.",
        "Complete the practical activity and explain the result."
      ],
      "content": "An ETL pipeline extracts source data, transforms it into a consistent shape, and loads it into a destination. Define the input schema, output schema, and freshness requirement before writing transformations. Keep a copy of raw input when appropriate so errors can be investigated.\n\nExample: daily sales files contain order_id, amount, and date. Validate types, reject impossible values into a separate error report, and merge by order_id. Re-running the same input should not double the sales total. This property is called idempotency.\n\nRecord row counts, validation failures, and the last successful run. A checkpoint should advance only after a successful load. Incremental jobs process changes; periodic reconciliation catches records they may have missed.",
      "practice": "Load a small sales CSV into SQLite with Python. Reject invalid amounts, deduplicate by order ID, and show that running twice keeps the same total.",
      "durationMinutes": 60,
      "resources": []
    },
    {
      "id": "business-intelligence-module",
      "title": "BI Dashboards & Data Modeling",
      "competencyId": "business-intelligence",
      "objectives": [
        "Define metrics and build dashboards that answer business questions.",
        "Complete the practical activity and explain the result."
      ],
      "content": "Begin with the decision a dashboard supports. Define each metric, its unit, time period, and aggregation rule. A daily total is not interchangeable with an average per customer. Document the grain of every table: what one row represents.\n\nExample: a sales fact table contains one row per order line. Product and date dimensions describe those records. Joining a second table with several rows per product can accidentally multiply sales. Check row counts and totals before and after joins.\n\nUse a small number of relevant charts, clear axis labels, and visible filter context. Compare the dashboard total with a trusted query. Separate a measure computed at query time from a stored field, and make missing data explicit.",
      "practice": "Create a sales dashboard using a free local tool or spreadsheet. Include total sales, a monthly trend, and a product breakdown; reconcile every total with SQL.",
      "durationMinutes": 60,
      "resources": []
    },
    {
      "id": "linux-module",
      "title": "Linux & Command Line",
      "competencyId": "linux",
      "objectives": [
        "Navigate files, inspect processes, and apply basic permissions.",
        "Complete the practical activity and explain the result."
      ],
      "content": "A shell runs commands and connects their input and output. Start in a disposable practice folder. pwd shows your current directory, ls lists entries, and cd changes directories. Quote paths containing spaces. Inspect a command before running it with elevated permissions.\n\nExample: create a logs folder and use a text search command to find ERROR lines in a sample log. Redirect the filtered output to a new report rather than overwriting the source. Pipes pass output between tools.\n\nFile permissions distinguish read, write, and execute access for the owner, group, and others. Grant only what is needed. Processes have IDs; check which process you are inspecting before stopping anything. Use local manual pages to understand command options.",
      "practice": "In a temporary directory, create a sample log, filter error lines into a report, and explain its owner and permissions. Avoid system directories.",
      "durationMinutes": 60,
      "resources": []
    },
    {
      "id": "networking-module",
      "title": "Networking Fundamentals",
      "competencyId": "networking",
      "objectives": [
        "Explain DNS, IP addresses, ports, HTTP, and TLS.",
        "Complete the practical activity and explain the result."
      ],
      "content": "An IP address identifies a network endpoint, while a port identifies a service on that endpoint. DNS maps names to records such as addresses. A browser normally resolves a hostname, establishes a connection, and exchanges application messages.\n\nExample: a web request can fail because name resolution fails, because the service cannot be reached, or because the application returns an error. These are different layers. Check the exact symptom before changing settings.\n\nTCP provides an ordered reliable byte stream. HTTP defines requests and responses above the transport. TLS protects data in transit and authenticates the server through certificates. It does not replace application-level authorization or input validation.",
      "practice": "Draw the steps between entering a website name and receiving a response. In your browser network panel, inspect a request method, status, and response headers.",
      "durationMinutes": 60,
      "resources": []
    },
    {
      "id": "cloud-module",
      "title": "Cloud Computing Foundations",
      "competencyId": "cloud",
      "objectives": [
        "Compare compute, storage, identity, and reliability choices.",
        "Complete the practical activity and explain the result."
      ],
      "content": "Cloud services provide computing resources through APIs. Separate compute, storage, networking, and identity when planning an application. A virtual machine gives more operating-system control; managed services reduce some operational work while introducing service-specific limits.\n\nExample: a small web app uses static hosting, an API, and a database. Give the API identity only the database permissions it needs. Store secrets in server configuration and plan how data will be backed up and restored.\n\nReliability requires handling timeouts, retries, and partial failures. Resource usage can have a cost even when a service advertises a free allowance. Learn with local simulations or explicitly free exercises; review limits before provisioning anything.",
      "practice": "Design a cloud architecture on paper for a learning app. Label identities, storage, backup, failure recovery, and an estimated usage budget without creating paid resources.",
      "durationMinutes": 60,
      "resources": []
    },
    {
      "id": "containers-module",
      "title": "Containers & Docker",
      "competencyId": "containers",
      "objectives": [
        "Package an application with reproducible dependencies and persistent storage.",
        "Complete the practical activity and explain the result."
      ],
      "content": "A container runs an isolated process using a filesystem built from an image. An image is a reusable template; a container is an instance of it. Pin dependencies and keep build instructions reproducible so another machine can run the same application.\n\nExample: package a small Python service, expose its port locally, and pass configuration when starting it. Keep API keys out of image layers. Use a volume for data that must outlive a container replacement.\n\nContainers share the host kernel; they are not identical to full virtual machines. Run with only the privileges required. Inspect logs and health behavior, and rebuild a patched image when dependencies change.",
      "practice": "Write a Dockerfile for a small local app. Explain image versus container, run without secrets in the file, and test persistence with a named volume.",
      "durationMinutes": 60,
      "resources": []
    },
    {
      "id": "ci-cd-module",
      "title": "CI/CD & Release Safety",
      "competencyId": "ci-cd",
      "objectives": [
        "Build repeatable checks and release with a recovery plan.",
        "Complete the practical activity and explain the result."
      ],
      "content": "Continuous integration runs checks when changes are proposed or merged. A pipeline commonly installs dependencies, checks code, runs tests, and builds an artifact. Keep the artifact associated with its source revision so you know what is running.\n\nExample: a failed test stops a release before deployment. After a successful deployment, a smoke check verifies a basic workflow. If it fails, restore the previous known-good artifact while investigating. Database changes also need a compatible recovery strategy.\n\nKeep credentials in the platform secret store and scope them to required actions. Use separate environments for practice and production. Make checks useful and deterministic; retrying a flaky test until it passes can hide a real issue.",
      "practice": "Create a pipeline definition for your repository that runs tests and builds. Document the exact rollback steps and one post-release smoke check.",
      "durationMinutes": 60,
      "resources": []
    },
    {
      "id": "cybersecurity-module",
      "title": "Cybersecurity Foundations",
      "competencyId": "cybersecurity",
      "objectives": [
        "Recognize risks and build a defensive incident-response checklist.",
        "Complete the practical activity and explain the result."
      ],
      "content": "Security protects confidentiality, integrity, and availability. Identify the assets, likely threats, and existing controls before selecting tools. Multi-factor authentication, updates, least privilege, and recoverable backups address common risks.\n\nExample: an unexpected login alert requires checking the event, preserving relevant logs, limiting affected access, and following the organization response process. Do not erase evidence while investigating. A single unusual event is a signal to evaluate, not proof of an attack.\n\nPractice only in systems you own or an explicitly authorized lab. Separate detection, containment, recovery, and lessons learned. Explain who makes decisions and how the team confirms that normal service is restored.",
      "practice": "Create a defensive checklist for a small web app and a response plan for a suspicious sign-in. Use a fictional incident and do not probe external systems.",
      "durationMinutes": 60,
      "resources": []
    }
  ],
  "questions": [
    {
      "id": "react-q1",
      "competencyId": "react",
      "prompt": "What should identify items in a rendered list?",
      "options": [
        "A stable item ID",
        "A new random value each render",
        "The item color",
        "The page title"
      ],
      "correctIndex": 0,
      "explanation": "Stable keys preserve item identity across updates.",
      "concept": "What should identify items in a rendered list",
      "difficulty": "Intermediate"
    },
    {
      "id": "react-q2",
      "competencyId": "react",
      "prompt": "How should a child request a parent state change?",
      "options": [
        "Call a callback passed through props",
        "Mutate the parent DOM directly",
        "Change a global CSS rule",
        "Reload the browser"
      ],
      "correctIndex": 0,
      "explanation": "A callback keeps ownership of the state in the parent.",
      "concept": "How should a child request a parent state change",
      "difficulty": "Intermediate"
    },
    {
      "id": "react-q3",
      "competencyId": "react",
      "prompt": "Which value usually does not need separate state?",
      "options": [
        "The count computed from the current task array",
        "A user-entered search query",
        "Whether a dialog is open",
        "An unsaved input value"
      ],
      "correctIndex": 0,
      "explanation": "Derived data can be calculated from the source state.",
      "concept": "Which value usually does not need separate state",
      "difficulty": "Intermediate"
    },
    {
      "id": "ux-design-q1",
      "competencyId": "ux-design",
      "prompt": "Which interview question is most useful?",
      "options": [
        "Describe the last time you tried this task",
        "Would you love my new design?",
        "Do you agree this is perfect?",
        "Which answer should I give you?"
      ],
      "correctIndex": 0,
      "explanation": "Past behavior offers more concrete evidence than leading opinions.",
      "concept": "Which interview question is most useful",
      "difficulty": "Beginner"
    },
    {
      "id": "ux-design-q2",
      "competencyId": "ux-design",
      "prompt": "What should a usability test observe?",
      "options": [
        "Whether someone can complete a realistic task",
        "Only the number of colors",
        "Only font popularity",
        "Whether the designer likes it"
      ],
      "correctIndex": 0,
      "explanation": "Task observation reveals friction and confusion.",
      "concept": "What should a usability test observe",
      "difficulty": "Beginner"
    },
    {
      "id": "ux-design-q3",
      "competencyId": "ux-design",
      "prompt": "What helps keyboard users find their position?",
      "options": [
        "A visible focus indicator",
        "Removing all outlines",
        "Hover-only labels",
        "Colorless hidden links"
      ],
      "correctIndex": 0,
      "explanation": "Visible focus identifies the active control.",
      "concept": "What helps keyboard users find their position",
      "difficulty": "Beginner"
    },
    {
      "id": "testing-q1",
      "competencyId": "testing",
      "prompt": "Which values test a minimum accepted age of 18?",
      "options": [
        "17 and 18",
        "30 and 40",
        "50 and 60",
        "Only 99"
      ],
      "correctIndex": 0,
      "explanation": "Values immediately around the boundary expose off-by-one errors.",
      "concept": "Which values test a minimum accepted age of 18",
      "difficulty": "Beginner"
    },
    {
      "id": "testing-q2",
      "competencyId": "testing",
      "prompt": "What belongs in a useful defect report?",
      "options": [
        "Steps, expected result, actual result, and environment",
        "Only the word broken",
        "Only a screenshot with no context",
        "A guess about who caused it"
      ],
      "correctIndex": 0,
      "explanation": "Reproducible evidence helps another person investigate.",
      "concept": "What belongs in a useful defect report",
      "difficulty": "Beginner"
    },
    {
      "id": "testing-q3",
      "competencyId": "testing",
      "prompt": "What do passing tests demonstrate?",
      "options": [
        "The checked cases passed in that environment",
        "No defects can exist",
        "Every device was tested",
        "No further maintenance is needed"
      ],
      "correctIndex": 0,
      "explanation": "Tests cover specific conditions, not every possible situation.",
      "concept": "What do passing tests demonstrate",
      "difficulty": "Beginner"
    },
    {
      "id": "test-automation-q1",
      "competencyId": "test-automation",
      "prompt": "Which locator usually describes a user-facing control best?",
      "options": [
        "Its accessible role and name",
        "Its position as the seventh div",
        "A randomly generated class",
        "An absolute pixel position"
      ],
      "correctIndex": 0,
      "explanation": "Role and name connect the test to the intended interaction.",
      "concept": "Which locator usually describes a user-facing control best",
      "difficulty": "Intermediate"
    },
    {
      "id": "test-automation-q2",
      "competencyId": "test-automation",
      "prompt": "How should a test wait for a result?",
      "options": [
        "Wait for the expected observable condition",
        "Always pause exactly ten seconds",
        "Assume every request is instant",
        "Skip all assertions"
      ],
      "correctIndex": 0,
      "explanation": "Condition-based waits adapt to actual application behavior.",
      "concept": "How should a test wait for a result",
      "difficulty": "Intermediate"
    },
    {
      "id": "test-automation-q3",
      "competencyId": "test-automation",
      "prompt": "Why isolate test data?",
      "options": [
        "To avoid one test changing another test result",
        "To hide failures",
        "To make every test slower",
        "To disable authentication"
      ],
      "correctIndex": 0,
      "explanation": "Independent data makes failures reproducible.",
      "concept": "Why isolate test data",
      "difficulty": "Intermediate"
    },
    {
      "id": "etl-q1",
      "competencyId": "etl",
      "prompt": "What makes a load idempotent?",
      "options": [
        "Reprocessing the same input does not duplicate results",
        "It always deletes the destination",
        "It ignores all keys",
        "It never records errors"
      ],
      "correctIndex": 0,
      "explanation": "Stable keys and merge logic let a job retry safely.",
      "concept": "What makes a load idempotent",
      "difficulty": "Intermediate"
    },
    {
      "id": "etl-q2",
      "competencyId": "etl",
      "prompt": "When should a successful checkpoint advance?",
      "options": [
        "After the intended load succeeds",
        "Before reading the input",
        "When the first row is seen",
        "Even when the database rejects writes"
      ],
      "correctIndex": 0,
      "explanation": "Advancing too early can silently skip data.",
      "concept": "When should a successful checkpoint advance",
      "difficulty": "Intermediate"
    },
    {
      "id": "etl-q3",
      "competencyId": "etl",
      "prompt": "What should happen to invalid source rows?",
      "options": [
        "Record them for review under a defined policy",
        "Silently treat them as valid",
        "Convert every missing amount to one",
        "Publish them without validation"
      ],
      "correctIndex": 0,
      "explanation": "An explicit rejection policy makes quality problems visible.",
      "concept": "What should happen to invalid source rows",
      "difficulty": "Intermediate"
    },
    {
      "id": "business-intelligence-q1",
      "competencyId": "business-intelligence",
      "prompt": "What does table grain describe?",
      "options": [
        "What one row represents",
        "The background color",
        "The number of chart types",
        "The database password"
      ],
      "correctIndex": 0,
      "explanation": "Grain defines the level at which records and measures can be combined.",
      "concept": "What does table grain describe",
      "difficulty": "Intermediate"
    },
    {
      "id": "business-intelligence-q2",
      "competencyId": "business-intelligence",
      "prompt": "Why can a join inflate a sales total?",
      "options": [
        "One source row may match several destination rows",
        "All joins always remove duplicates",
        "SQL cannot add amounts",
        "Dates cannot be joined"
      ],
      "correctIndex": 0,
      "explanation": "A one-to-many match repeats the source amount unless aggregation is designed correctly.",
      "concept": "Why can a join inflate a sales total",
      "difficulty": "Intermediate"
    },
    {
      "id": "business-intelligence-q3",
      "competencyId": "business-intelligence",
      "prompt": "What should a metric definition include?",
      "options": [
        "Unit, time window, and aggregation rule",
        "Only a catchy title",
        "Only the chart color",
        "Only an icon"
      ],
      "correctIndex": 0,
      "explanation": "A precise definition allows users to interpret and reconcile the result.",
      "concept": "What should a metric definition include",
      "difficulty": "Intermediate"
    },
    {
      "id": "linux-q1",
      "competencyId": "linux",
      "prompt": "What does pwd show?",
      "options": [
        "The current working directory",
        "All saved passwords",
        "The CPU model",
        "The remote Git branch"
      ],
      "correctIndex": 0,
      "explanation": "pwd reports the directory from which relative paths are resolved.",
      "concept": "What does pwd show",
      "difficulty": "Beginner"
    },
    {
      "id": "linux-q2",
      "competencyId": "linux",
      "prompt": "What does a pipe normally connect?",
      "options": [
        "One command output to another command input",
        "Two user passwords",
        "Two physical monitors",
        "A CSS rule to HTML"
      ],
      "correctIndex": 0,
      "explanation": "Pipes allow small tools to work together.",
      "concept": "What does a pipe normally connect",
      "difficulty": "Beginner"
    },
    {
      "id": "linux-q3",
      "competencyId": "linux",
      "prompt": "Which permission policy is preferable?",
      "options": [
        "Give only the access needed",
        "Make every file globally writable",
        "Run every task as root",
        "Disable ownership checks"
      ],
      "correctIndex": 0,
      "explanation": "Least privilege limits accidental or unauthorized changes.",
      "concept": "Which permission policy is preferable",
      "difficulty": "Beginner"
    },
    {
      "id": "networking-q1",
      "competencyId": "networking",
      "prompt": "What is a common purpose of DNS?",
      "options": [
        "Resolve a hostname to network records",
        "Encrypt every stored file",
        "Replace a user password",
        "Compile JavaScript"
      ],
      "correctIndex": 0,
      "explanation": "DNS provides records associated with names.",
      "concept": "What is a common purpose of DNS",
      "difficulty": "Beginner"
    },
    {
      "id": "networking-q2",
      "competencyId": "networking",
      "prompt": "What does a port identify?",
      "options": [
        "A service endpoint on a host",
        "The screen resolution",
        "A document author",
        "The browser theme"
      ],
      "correctIndex": 0,
      "explanation": "Ports distinguish services sharing a network address.",
      "concept": "What does a port identify",
      "difficulty": "Beginner"
    },
    {
      "id": "networking-q3",
      "competencyId": "networking",
      "prompt": "Does TLS replace application authorization?",
      "options": [
        "No, the app must still check permissions",
        "Yes, every HTTPS user is an admin",
        "Only if the page is blue",
        "Only for JSON responses"
      ],
      "correctIndex": 0,
      "explanation": "Transport protection does not determine which records a user may access.",
      "concept": "Does TLS replace application authorization",
      "difficulty": "Beginner"
    },
    {
      "id": "cloud-q1",
      "competencyId": "cloud",
      "prompt": "Which design follows least privilege?",
      "options": [
        "Give the API only its required database permissions",
        "Give every service owner access",
        "Share one public administrator key",
        "Store all secrets in browser code"
      ],
      "correctIndex": 0,
      "explanation": "A narrowly scoped identity reduces the impact of mistakes.",
      "concept": "Which design follows least privilege",
      "difficulty": "Intermediate"
    },
    {
      "id": "cloud-q2",
      "competencyId": "cloud",
      "prompt": "What should accompany a backup plan?",
      "options": [
        "A tested restore procedure",
        "Only a file name",
        "A new color palette",
        "An unchecked success message"
      ],
      "correctIndex": 0,
      "explanation": "A backup is useful only if the needed data can be restored.",
      "concept": "What should accompany a backup plan",
      "difficulty": "Intermediate"
    },
    {
      "id": "cloud-q3",
      "competencyId": "cloud",
      "prompt": "Does a free allowance guarantee zero charges at any usage?",
      "options": [
        "No, limits and billing behavior must be checked",
        "Yes, usage never matters",
        "Only on weekdays",
        "Only for large teams"
      ],
      "correctIndex": 0,
      "explanation": "Allowances have limits and service-specific billing conditions.",
      "concept": "Does a free allowance guarantee zero charges at any usage",
      "difficulty": "Intermediate"
    },
    {
      "id": "containers-q1",
      "competencyId": "containers",
      "prompt": "What is a container image?",
      "options": [
        "A reusable filesystem and runtime template",
        "A running user session only",
        "A database password",
        "A screenshot of a server"
      ],
      "correctIndex": 0,
      "explanation": "A container is created from an image template.",
      "concept": "What is a container image",
      "difficulty": "Intermediate"
    },
    {
      "id": "containers-q2",
      "competencyId": "containers",
      "prompt": "Where should persistent application data normally live?",
      "options": [
        "In an appropriate persistent volume or external store",
        "Only in a disposable container layer",
        "In an image label",
        "In a CSS file"
      ],
      "correctIndex": 0,
      "explanation": "Container replacement should not erase required data.",
      "concept": "Where should persistent application data normally live",
      "difficulty": "Intermediate"
    },
    {
      "id": "containers-q3",
      "competencyId": "containers",
      "prompt": "Should API secrets be baked into an image?",
      "options": [
        "No, provide them securely at runtime",
        "Yes, all images are private forever",
        "Only if the key is short",
        "Only in comments"
      ],
      "correctIndex": 0,
      "explanation": "Image layers can retain secrets even after later deletion.",
      "concept": "Should API secrets be baked into an image",
      "difficulty": "Intermediate"
    },
    {
      "id": "ci-cd-q1",
      "competencyId": "ci-cd",
      "prompt": "What should happen when a required test fails?",
      "options": [
        "Stop promotion and investigate",
        "Deploy anyway without a record",
        "Erase the test",
        "Mark it passed automatically"
      ],
      "correctIndex": 0,
      "explanation": "A required check is a gate for a reason.",
      "concept": "What should happen when a required test fails",
      "difficulty": "Intermediate"
    },
    {
      "id": "ci-cd-q2",
      "competencyId": "ci-cd",
      "prompt": "Why associate an artifact with a source revision?",
      "options": [
        "To identify and reproduce the deployed code",
        "To choose a font",
        "To hide the deployment date",
        "To skip all tests"
      ],
      "correctIndex": 0,
      "explanation": "Traceability supports diagnosis and rollback.",
      "concept": "Why associate an artifact with a source revision",
      "difficulty": "Intermediate"
    },
    {
      "id": "ci-cd-q3",
      "competencyId": "ci-cd",
      "prompt": "What belongs in a release plan?",
      "options": [
        "A smoke check and a recovery procedure",
        "Only a launch slogan",
        "Only a changed logo",
        "Only a screenshot"
      ],
      "correctIndex": 0,
      "explanation": "Verification and recovery address failures after deployment.",
      "concept": "What belongs in a release plan",
      "difficulty": "Intermediate"
    },
    {
      "id": "cybersecurity-q1",
      "competencyId": "cybersecurity",
      "prompt": "Which three goals are commonly called the CIA triad?",
      "options": [
        "Confidentiality, integrity, availability",
        "Code, images, animation",
        "Cloud, input, analytics",
        "Cache, install, archive"
      ],
      "correctIndex": 0,
      "explanation": "The triad describes three broad security objectives.",
      "concept": "Which three goals are commonly called the CIA triad",
      "difficulty": "Intermediate"
    },
    {
      "id": "cybersecurity-q2",
      "competencyId": "cybersecurity",
      "prompt": "What should you do with relevant incident logs?",
      "options": [
        "Preserve them according to the response process",
        "Delete them immediately",
        "Publish private logs publicly",
        "Change timestamps to look normal"
      ],
      "correctIndex": 0,
      "explanation": "Preserved evidence supports reliable investigation.",
      "concept": "What should you do with relevant incident logs",
      "difficulty": "Intermediate"
    },
    {
      "id": "cybersecurity-q3",
      "competencyId": "cybersecurity",
      "prompt": "Where should hands-on security testing take place?",
      "options": [
        "In an owned or explicitly authorized environment",
        "On any random website",
        "On a stranger account",
        "On a public service without permission"
      ],
      "correctIndex": 0,
      "explanation": "Authorization defines the permitted scope of testing.",
      "concept": "Where should hands-on security testing take place",
      "difficulty": "Intermediate"
    }
  ],
  "careers": [
    {
      "id": "python-developer",
      "name": "Python Developer",
      "description": "Write tested Python programs and work with structured data.",
      "competencyIds": [
        "python",
        "sql",
        "git",
        "testing",
        "linux"
      ]
    },
    {
      "id": "react-developer",
      "name": "React Developer",
      "description": "Create interactive web applications with reusable components.",
      "competencyIds": [
        "react",
        "git",
        "testing",
        "ux-design"
      ]
    },
    {
      "id": "ui-developer",
      "name": "UI Developer",
      "description": "Implement accessible interfaces with strong layout and interaction skills.",
      "competencyIds": [
        "html",
        "css",
        "javascript",
        "dom",
        "ux-design",
        "git"
      ]
    },
    {
      "id": "ux-designer",
      "name": "UX Designer",
      "description": "Research user needs, prototype task flows, and evaluate usability.",
      "competencyIds": [
        "ux-design",
        "html",
        "css",
        "testing"
      ]
    },
    {
      "id": "qa-tester",
      "name": "QA Tester",
      "description": "Design test cases, investigate defects, and validate user journeys.",
      "competencyIds": [
        "testing",
        "html",
        "javascript",
        "sql",
        "git"
      ]
    },
    {
      "id": "automation-engineer",
      "name": "Test Automation Engineer",
      "description": "Build reliable browser regression tests and integrate them into delivery.",
      "competencyIds": [
        "test-automation",
        "git",
        "ci-cd"
      ]
    },
    {
      "id": "data-engineer",
      "name": "Data Engineer",
      "description": "Create validated pipelines that move and prepare data reliably.",
      "competencyIds": [
        "etl",
        "sql",
        "python",
        "git",
        "linux",
        "cloud"
      ]
    },
    {
      "id": "analytics-engineer",
      "name": "Analytics Engineer",
      "description": "Transform raw data into tested models and trustworthy business metrics.",
      "competencyIds": [
        "etl",
        "business-intelligence",
        "sql",
        "git",
        "testing"
      ]
    },
    {
      "id": "bi-analyst",
      "name": "Business Intelligence Analyst",
      "description": "Model data and communicate decisions through dashboards.",
      "competencyIds": [
        "sql",
        "statistics",
        "data-quality",
        "visualization",
        "business-intelligence"
      ]
    },
    {
      "id": "data-scientist",
      "name": "Data Scientist",
      "description": "Explore data, evaluate hypotheses, and compare predictive models.",
      "competencyIds": [
        "python",
        "sql",
        "statistics",
        "pandas",
        "visualization",
        "ml-foundations",
        "model-evaluation",
        "git"
      ]
    },
    {
      "id": "ml-engineer",
      "name": "Machine Learning Engineer",
      "description": "Evaluate models and package reproducible machine learning workflows.",
      "competencyIds": [
        "ml-foundations",
        "model-evaluation",
        "data-quality",
        "etl",
        "containers",
        "git",
        "testing"
      ]
    },
    {
      "id": "cloud-engineer",
      "name": "Cloud Engineer",
      "description": "Plan cloud resources, identity, networking, and service recovery.",
      "competencyIds": [
        "cloud",
        "containers",
        "git",
        "cybersecurity"
      ]
    },
    {
      "id": "devops-engineer",
      "name": "DevOps Engineer",
      "description": "Automate builds and releases with Linux, containers, and cloud foundations.",
      "competencyIds": [
        "ci-cd",
        "cloud",
        "python"
      ]
    },
    {
      "id": "security-analyst",
      "name": "Cybersecurity Analyst",
      "description": "Understand systems and investigate security events using defensive practices.",
      "competencyIds": [
        "cybersecurity",
        "python",
        "testing",
        "cloud"
      ]
    },
    {
      "id": "database-developer",
      "name": "Database Developer",
      "description": "Write SQL, design reliable data flows, and validate database outputs.",
      "competencyIds": [
        "sql",
        "data-quality",
        "etl",
        "business-intelligence",
        "git"
      ]
    }
  ]
};
