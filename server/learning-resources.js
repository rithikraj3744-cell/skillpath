// Free English resources checked against publisher pages on 2026-10-07.
// Video length is separate from the estimated time for the SkillPath activity.
const fcc=slug=>'https://www.freecodecamp.org/news/'+slug+'/';
const video=(title,id)=>({label:title+' · English · freeCodeCamp',url:'https://www.youtube.com/watch?v='+id});
const course=(label,url)=>({label:label+' · English',url});
const webCourse=course('The Odin Project — Foundations','https://www.theodinproject.com/paths/foundations/courses/foundations');
const jsCourse=course('freeCodeCamp — JavaScript course',fcc('full-javascript-course-for-beginners'));
const dataCourse=course('freeCodeCamp — Data analyst bootcamp',fcc('learn-data-analysis-with-comprehensive-19-hour-bootcamp'));
const infraCourse=course('freeCodeCamp — IT fundamentals',fcc('learn-hardware-cloud-devops-networking-security-databases-dns-git-and-linux'));
const dataVideo=video('Data analyst bootcamp — choose the relevant chapter','PSNXoAs2FtQ');
const infraVideo=video('IT fundamentals — choose the relevant chapter','4m9j6hlbf4g');
const jsVideo=video('JavaScript full course — fundamentals and DOM','jS4aFq5-91M');
const htmlVideo=video('HTML and CSS full course','mU6anWqZJcc');
const mlVideo=video('Machine learning with Python and Scikit-Learn','hDKCxebp88A');
const testVideo=video('Software testing with Playwright','jydYq7oAtD8');
const devopsVideo=video('DevOps engineering course','j5Zsa_eOXeY');
export const LEARNING_RESOURCES={
 html:[webCourse,htmlVideo],css:[webCourse,htmlVideo],javascript:[jsCourse,jsVideo],dom:[jsCourse,jsVideo],
 async:[course('freeCodeCamp — APIs for beginners',fcc('apis-for-beginners')),video('APIs for beginners — requests and responses','WXsD0ZgxjRw')],
 rest:[course('freeCodeCamp — APIs for beginners',fcc('apis-for-beginners')),video('APIs for beginners','WXsD0ZgxjRw')],
 git:[webCourse,infraVideo],
 firebase:[course('freeCodeCamp — Build apps with Firebase',fcc('create-apps-with-firebase')),video('Firebase full course — setup and services','fgdpvwEWJ9M')],
 auth:[course('freeCodeCamp — Firebase authentication course',fcc('create-apps-with-firebase')),video('Firebase full course — authentication chapter','fgdpvwEWJ9M')],
 firestore:[course('freeCodeCamp — Firestore crash course',fcc('firebase-firestore-crash-course')),video('Firebase full course — Firestore chapter','fgdpvwEWJ9M')],
 security:[infraCourse,infraVideo],deployment:[course('freeCodeCamp — DevOps engineering',fcc('devops-engineering-course-for-beginners')),devopsVideo],
 capstone:[webCourse,video('Firebase project with HTML, CSS, and JavaScript','UFD4SP91tSM')],
 python:[course('Kaggle Learn — Python','https://www.kaggle.com/learn/python'),video('Python full course for beginners','rfscVS0vtbw')],
 sql:[course('SQLBolt — Interactive SQL lessons','https://sqlbolt.com/'),video('SQL full database course','HXV3zeQKqGY')],
 statistics:[course('Khan Academy — Statistics and probability','https://www.khanacademy.org/math/statistics-probability'),mlVideo],
 'data-quality':[course('Kaggle Learn — Data cleaning','https://www.kaggle.com/learn/data-cleaning'),dataVideo],
 pandas:[course('Kaggle Learn — Pandas','https://www.kaggle.com/learn/pandas'),dataVideo],
 visualization:[course('Kaggle Learn — Data visualization','https://www.kaggle.com/learn/data-visualization'),dataVideo],
 'ml-foundations':[course('Kaggle Learn — Intro to machine learning','https://www.kaggle.com/learn/intro-to-machine-learning'),mlVideo],
 'model-evaluation':[course('freeCodeCamp — Practical machine learning course',fcc('machine-learning-with-python-and-scikit-learn')),mlVideo],
 'prompt-design':[course('freeCodeCamp — Prompt engineering basics',fcc('prompt-engineering-basics')),video('Prompt engineering full course','_ZvnD73m40o')],
 retrieval:[course('freeCodeCamp — RAG from scratch',fcc('mastering-rag-from-scratch')),video('RAG from scratch with Python','sVcwVQRHIc8')],
 react:[course('Full Stack Open — Introduction to React','https://fullstackopen.com/en/part1/introduction_to_react/'),video('Modern React with Bob Ziroll','x4rFhThSX04')],
 'ux-design':[course('freeCodeCamp — Figma and interface design',fcc('learn-figma-for-ui-ux-design')),video('Figma and UI design course','mT_Jjn8RJdo')],
 testing:[course('freeCodeCamp — Software testing course',fcc('software-testing-with-playwright')),testVideo],
 'test-automation':[course('freeCodeCamp — Browser testing course',fcc('software-testing-with-playwright')),testVideo],
 etl:[dataCourse,dataVideo], 'business-intelligence':[dataCourse,dataVideo],
 linux:[course('Linux Journey — Free Linux lessons','https://labex.io/linuxjourney'),infraVideo],
 networking:[infraCourse,infraVideo],cloud:[infraCourse,infraVideo],containers:[infraCourse,infraVideo],
 'ci-cd':[course('freeCodeCamp — DevOps engineering',fcc('devops-engineering-course-for-beginners')),devopsVideo],
 cybersecurity:[infraCourse,infraVideo]
};
