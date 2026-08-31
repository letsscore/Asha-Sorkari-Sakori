export const EXAMS = [
  {id:"apsc", name:"APSC", tag:"STATE PSC", icon:"◎", desc:"Focused preparation for Assam Public Service Commission examinations."},
  {id:"adre", name:"ADRE", tag:"ASSAM RECRUITMENT", icon:"◆", desc:"Structured preparation for Assam Direct Recruitment examinations."},
  {id:"assam-police", name:"Assam Police", tag:"POLICE RECRUITMENT", icon:"★", desc:"Exam-focused practice for Assam Police recruitment examinations."},
  {id:"tet", name:"TET", tag:"TEACHER ELIGIBILITY", icon:"✓", desc:"Preparation resources and practice for Teacher Eligibility Tests."}
];

export const PAYMENT = { upiId: "ADD-YOUR-UPI-ID-HERE" };

export const COURSES = [
  {
    id:"free-foundation", title:"Free Foundation", examId:"all", type:"free", price:0, icon:"◈",
    desc:"A limited starter library for aspirants who want to experience the platform before choosing premium preparation.",
    highlights:["GK — selected topics","Aptitude — selected topics","Reasoning — selected topics","English — selected topics","Basic exam guidance"]
  },
  {
    id:"apsc-complete", title:"APSC Complete Preparation", examId:"apsc", type:"paid", price:499, icon:"◎",
    desc:"Comprehensive APSC preparation with broad topic coverage, premium practice and important revision resources.",
    highlights:["Unlimited topic coverage","Premium mock tests","Assam-specific resources","Current-affairs revision","Important study resources"]
  },
  {
    id:"adre-complete", title:"ADRE Complete Preparation", examId:"adre", type:"paid", price:399, icon:"◆",
    desc:"Complete ADRE-focused preparation with extensive practice, revision sets and premium resources.",
    highlights:["Unlimited topic coverage","Premium mock tests","Assam GK resources","Current-affairs revision","Important study resources"]
  },
  {
    id:"assam-police-complete", title:"Assam Police Complete Preparation", examId:"assam-police", type:"paid", price:349, icon:"★",
    desc:"Dedicated Assam Police preparation with extensive practice, recruitment-focused revision and premium resources.",
    highlights:["Unlimited topic coverage","Premium practice sets","Premium mock tests","Assam-specific revision","Important resources"]
  },
  {
    id:"tet-complete", title:"TET Complete Preparation", examId:"tet", type:"paid", price:349, icon:"✓",
    desc:"Complete TET preparation with extensive practice, revision, pedagogy resources and premium tests.",
    highlights:["Unlimited topic coverage","Premium mock tests","Pedagogy resources","Subject-wise practice","Important revision resources"]
  }
];

export const DEMO_TESTS = [
 {id:"tet-demo-01",title:"TET Practice Test 01",examId:"tet",duration:20,totalMarks:5,free:true,questions:[
  {id:"q1",text:"Which fundamental right is associated with equality before law?",options:["Article 14","Article 19","Article 21","Article 32"],answer:0},
  {id:"q2",text:"Which approach gives learners an active role in constructing knowledge?",options:["Constructivist approach","Dictation method","Rote-only method","Lecture-only method"],answer:0},
  {id:"q3",text:"The capital of Assam is:",options:["Guwahati","Dispur","Jorhat","Dibrugarh"],answer:1},
  {id:"q4",text:"An assessment used during instruction to improve learning is:",options:["Formative assessment","Summative assessment","Entrance test","Placement test"],answer:0},
  {id:"q5",text:"Which is a renewable source of energy?",options:["Coal","Petroleum","Solar energy","Natural gas"],answer:2}
 ]},
 {id:"apsc-demo-01",title:"APSC General Studies Practice 01",examId:"apsc",duration:15,totalMarks:2,free:true,questions:[
  {id:"q1",text:"The Constitution of India came into force on:",options:["15 August 1947","26 January 1950","26 November 1949","2 October 1950"],answer:1},
  {id:"q2",text:"Kaziranga National Park is especially known for:",options:["One-horned rhinoceros","Asiatic lion","Snow leopard","Blackbuck"],answer:0}
 ]}
];
