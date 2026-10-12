from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
root=Path(__file__).resolve().parent.parent
out=root/'public/downloads/skillpath-source.zip'
out.parent.mkdir(parents=True,exist_ok=True)
with ZipFile(out,'w',ZIP_DEFLATED) as z:
    for name in ['CORRECTION_STUDIO.md','README.md','ASSESSMENT_FOCUS.md','RECOVERY_SETUP.md','QUESTION_IMPORT.md','UPDATE_GUIDE.md','TEST_REPORT.md','RESOURCE_SOURCES.md','LAUNCH.md','RESPONSIVE_UPDATE.md','package.json','vercel.json','firebase.json','firestore.rules','firestore.indexes.json','.env.example','.gitignore']:
        z.write(root/name,name)
    for folder in ['public','server','api','scripts','tests']:
        for file in (root/folder).rglob('*'):
            if file.is_file() and ('downloads' not in file.parts or file.name=='question-import-example.xlsx'):
                z.write(file,file.relative_to(root))
print('Prepared source archive without credentials or Site identity.')
