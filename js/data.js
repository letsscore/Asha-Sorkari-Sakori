export const EXAMS = [
  {id:'apsc',name:'APSC',short:'Assam Public Service Commission',tag:'STATE PSC',icon:'A',desc:'Focused preparation for APSC and Assam government competitive examinations.'},
  {id:'adre',name:'ADRE',short:'Assam Direct Recruitment',tag:'ASSAM RECRUITMENT',icon:'D',desc:'Structured preparation for Assam Direct Recruitment examinations.'},
  {id:'assam-police',name:'Assam Police',short:'Police recruitment examinations',tag:'POLICE',icon:'P',desc:'Practice, revision and exam-focused preparation for Assam Police recruitment.'},
  {id:'tet',name:'TET',short:'Teacher Eligibility Test',tag:'ELIGIBILITY',icon:'T',desc:'Dedicated TET preparation with pedagogy, subject practice and mock tests.'},
  {id:'other',name:'Other Govt. Exams',short:'SSC, Railway, Banking & more',tag:'OTHER EXAMS',icon:'+',desc:'A growing preparation library for other central and state government examinations.'}
];

export const PAYMENT={upiId:'hussain.abidur@ybl',payeeName:'Asha Sorkari Sakori'};

export const COURSES=[
 {id:'free-foundation',title:'Free Foundation',examId:'all',type:'free',price:0,icon:'F',label:'LIMITED • FREE',desc:'A genuine starter course for aspirants who want to build fundamentals before moving to premium preparation.',highlights:['GK — selected topics','Aptitude — selected topics','Reasoning — selected topics','English — selected topics','Basic exam strategy & guidance']},
 {id:'apsc-complete',title:'APSC Complete Preparation',examId:'apsc',type:'paid',price:499,icon:'A',label:'PREMIUM • APSC',desc:'Broad, structured APSC preparation with deeper topic coverage, premium practice and Assam-focused resources.',highlights:['Broad / unlimited topic coverage','Premium mock tests & practice sets','Assam-specific GK & resources','Current-affairs revision','Important exam resources']},
 {id:'adre-complete',title:'ADRE Complete Preparation',examId:'adre',type:'paid',price:399,icon:'D',label:'PREMIUM • ADRE',desc:'Complete ADRE-oriented preparation designed around practice, revision and recruitment-focused resources.',highlights:['Broad / unlimited topic coverage','Premium mock tests','Assam GK & current affairs','Topic-wise practice','Important revision resources']},
 {id:'assam-police-complete',title:'Assam Police Complete',examId:'assam-police',type:'paid',price:349,icon:'P',label:'PREMIUM • POLICE',desc:'Dedicated Assam Police preparation with extensive practice, revision and premium test support.',highlights:['Broad / unlimited topic coverage','Premium practice sets','Premium mock tests','Assam-specific revision','Important resources']},
 {id:'tet-complete',title:'TET Complete Preparation',examId:'tet',type:'paid',price:349,icon:'T',label:'PREMIUM • TET',desc:'Complete TET preparation with pedagogy resources, subject-wise practice and premium tests.',highlights:['Broad / unlimited topic coverage','Premium mock tests','Pedagogy resources','Subject-wise practice','Important revision resources']}
];

export const DEMO_TESTS=[
 {id:'apsc-demo-01',title:'APSC General Studies • Practice 01',examId:'apsc',courseId:'free-foundation',duration:10,totalMarks:5,free:true,questions:[
  {id:'q1',text:'The Constitution of India came into force on:',options:['15 August 1947','26 January 1950','26 November 1949','2 October 1950'],answer:1},
  {id:'q2',text:'Kaziranga National Park is especially known for:',options:['One-horned rhinoceros','Asiatic lion','Snow leopard','Blackbuck'],answer:0},
  {id:'q3',text:'The capital of Assam is:',options:['Guwahati','Dispur','Jorhat','Dibrugarh'],answer:1},
  {id:'q4',text:'Which is a renewable source of energy?',options:['Coal','Petroleum','Solar energy','Natural gas'],answer:2},
  {id:'q5',text:'Article 14 is associated with:',options:['Freedom of speech','Equality before law','Right to education','Constitutional remedies'],answer:1}
 ]},
 {id:'tet-demo-01',title:'TET Foundation • Practice 01',examId:'tet',courseId:'free-foundation',duration:10,totalMarks:5,free:true,questions:[
  {id:'q1',text:'An assessment used during instruction to improve learning is:',options:['Formative assessment','Summative assessment','Entrance test','Placement test'],answer:0},
  {id:'q2',text:'Which approach gives learners an active role in constructing knowledge?',options:['Constructivist approach','Dictation method','Rote-only method','Lecture-only method'],answer:0},
  {id:'q3',text:'The capital of Assam is:',options:['Guwahati','Dispur','Jorhat','Dibrugarh'],answer:1},
  {id:'q4',text:'Which is a renewable source of energy?',options:['Coal','Petroleum','Solar energy','Natural gas'],answer:2},
  {id:'q5',text:'Learning is generally more effective when students:',options:['Only memorise','Actively participate','Never practise','Avoid feedback'],answer:1}
 ]}
];
