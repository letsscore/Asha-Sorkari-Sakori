import { dbPush, dbSet } from './firebase.js';
import { trackActivity, esc, formatDate } from './ui.js';
import { FREE_FOUNDATION } from './free-foundation-data.js';

const CATS = Object.values(FREE_FOUNDATION);
const CATEGORY_BY_ID = Object.fromEntries(CATS.map(c => [c.id, c]));
const CATEGORY_LABELS = { gk:'General Knowledge', ap:'Aptitude', re:'Reasoning', en:'English' };

function shuffleQuestion(q){
  const pairs = q.options.map((text,i)=>({text,correct:i===q.answer}));
  for(let i=pairs.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pairs[i],pairs[j]]=[pairs[j],pairs[i]];}
  return { ...q, options:pairs.map(x=>x.text), answer:pairs.findIndex(x=>x.correct) };
}
function escText(v){return esc(v==null?'':String(v));}

export async function renderFreeFoundationCourse(root,user,course){
  if(!root || !user) return;
  let current='gk';
  let mode='overview';
  let practiceState=null;
  let mockState=null;
  let mockTimer=null;

  root.innerHTML=`
  <div class="ff-wrap">
    <section class="ff-hero">
      <div>
        <span class="course-badge free">FREE FOUNDATION</span>
        <span class="ff-kicker">ACCOUNT-BASED COURSE</span>
        <h1>Free Foundation</h1>
        <p>Build your competitive-exam fundamentals with selected General Knowledge, Aptitude, Reasoning and English topics.</p>
      </div>
      <div class="ff-hero-stat"><strong>4</strong><span>Core categories</span><b>50 + 30</b><span>Practice + Mock / category</span></div>
    </section>

    <section class="ff-progress-card">
      <div><b>Free course access active</b><span>Registration is complete. Your learning activity can be saved to your aspirant account.</span></div>
      <a class="btn secondary small" href="dashboard.html">My Dashboard</a>
    </section>

    <nav class="ff-tabs" aria-label="Course sections">
      <button data-mode="overview" class="active">Course Overview</button>
      <button data-mode="notes">Basic Notes</button>
      <button data-mode="practice">50 Practice Questions</button>
      <button data-mode="mock">30-Question Mock</button>
    </nav>

    <section id="ff-content"></section>
  </div>`;

  const content=root.querySelector('#ff-content');

  // Robust navigation: use delegated click handlers so dynamically re-rendered
  // category buttons always remain clickable on mobile and desktop.
  root.addEventListener('click', (event) => {
    const tab = event.target.closest('.ff-tabs button[data-mode]');
    if (tab) {
      event.preventDefault();
      mode = tab.dataset.mode;
      setActiveTab();
      render();
      return;
    }

    const category = event.target.closest('[data-cat]');
    if (category && root.contains(category)) {
      event.preventDefault();
      event.stopPropagation();
      const nextCategory = category.dataset.cat;
      if (!CATEGORY_BY_ID[nextCategory]) return;
      current = nextCategory;
      practiceState = null;
      mockState = null;
      mode = 'notes';
      render();
      trackActivity(user,'free_course_category_open',{courseId:course.id,category:current}).catch(()=>{});
    }
  });

  function categoryPicker(){
    if(!CATEGORY_BY_ID[current]) current='gk';
    return `<div class="ff-category-picker">${CATS.map(c=>`<button class="${c.id===current?'selected':''}" data-cat="${c.id}"><span>${escText(c.title)}</span><small>5 topics · 50 practice · 30 mock</small></button>`).join('')}</div>`;
  }
  function bindCategories(){
    root.querySelectorAll('[data-cat]').forEach(btn=>{
      btn.onclick=(event)=>{
        event.preventDefault();
        event.stopPropagation();
        const nextCategory=btn.getAttribute('data-cat');
        if(!CATEGORY_BY_ID[nextCategory]){ console.error('Unknown free-foundation category:',nextCategory); return; }
        current=nextCategory;
        practiceState=null;
        mockState=null;
        mode='notes';
        render();
        trackActivity(user,'free_course_category_open',{courseId:course.id,category:current}).catch(()=>{});
      };
    });
  }

  function overview(){
    content.innerHTML=`<div class="ff-section-head"><span class="eyebrow">START HERE</span><h2>Build the basics before premium preparation</h2><p>This limited foundation course covers the essential patterns an aspirant should know first. Premium courses remain separate for deeper and broader preparation.</p></div>
    <div class="ff-category-grid">${CATS.map(c=>`<article class="ff-category-card"><div class="ff-icon">${escText(c.title[0])}</div><span class="course-badge free">FREE</span><h3>${escText(c.title)}</h3><p>5 selected topics</p><div class="ff-mini-stats"><b>50</b><span>Practice</span><b>30</b><span>Mock</span></div><button class="btn small full" data-cat="${c.id}">Open Category</button></article>`).join('')}</div>
    <div class="ff-how"><div><b>01</b><h3>Read the notes</h3><p>Review the five selected foundation topics in each category.</p></div><div><b>02</b><h3>Practise 50 questions</h3><p>Attempt the category practice set and check your performance.</p></div><div><b>03</b><h3>Take the mock</h3><p>Finish a 30-question timed mock and save your result to your account.</p></div></div>`;
  }

  function notes(){
    const c=CATEGORY_BY_ID[current];
    content.innerHTML=`<div class="ff-section-head"><span class="eyebrow">BASIC NOTES</span><h2>${escText(c.title)} Foundation</h2><p>Selected fundamentals for competitive-exam preparation.</p></div>${categoryPicker()}<div class="ff-topic-grid">${c.topics.map((t,i)=>`<article class="ff-topic"><span class="badge">TOPIC ${i+1}</span><h3>${escText(t[0])}</h3><p>${escText(t[1])}</p><div class="ff-note">Focus on definitions, standard formulas/rules and common exam patterns.</div></article>`).join('')}</div><div class="ff-next"><button class="btn" id="to-practice">Start 50 Practice Questions →</button><button class="btn secondary" id="to-mock">Take 30-Question Mock</button></div>`;
    bindCategories();
    $('to-practice')?.addEventListener('click',()=>{mode='practice';setActiveTab();render();});
    $('to-mock')?.addEventListener('click',()=>{mode='mock';setActiveTab();render();});
    trackActivity(user,'free_course_notes_view',{courseId:course.id,category:current});
  }

  function practice(){
    const c=CATEGORY_BY_ID[current];
    if(!practiceState || practiceState.category!==current){practiceState={category:current,questions:c.practice.map(shuffleQuestion),answers:{},submitted:false};}
    const answered=Object.keys(practiceState.answers).length;
    content.innerHTML=`<div class="ff-section-head"><span class="eyebrow">PRACTICE SET</span><h2>50 Questions · ${escText(c.title)}</h2><p>Attempt all questions. Options are shuffled for a fair practice experience.</p></div>${categoryPicker()}<div class="ff-quiz-meta"><span>${answered}/50 answered</span><span>50 marks · No negative marking</span></div><form id="practice-form" class="ff-question-list">${practiceState.questions.map((q,i)=>`<fieldset class="ff-q"><legend><span>${i+1}</span>${escText(q.question)}</legend>${q.options.map((o,j)=>`<label class="ff-option"><input type="radio" name="q${i}" value="${j}" ${practiceState.answers[i]===j?'checked':''}><span>${escText(o)}</span></label>`).join('')}${practiceState.submitted?`<div class="ff-feedback ${practiceState.answers[i]===q.answer?'correct':'wrong'}">${practiceState.answers[i]===q.answer?'✓ Correct':'✗ Incorrect'} · Correct answer: <b>${escText(q.options[q.answer])}</b>${q.explanation?`<small>${escText(q.explanation)}</small>`:''}</div>`:''}</fieldset>`).join('')}<button class="btn" type="submit">${practiceState.submitted?'Recheck Practice':'Check 50 Answers'}</button><p id="practice-msg" class="form-message"></p></form>`;
    bindCategories();
    root.querySelector('#practice-form').addEventListener('submit',e=>{
      e.preventDefault(); const fd=new FormData(e.currentTarget); practiceState.answers={};
      practiceState.questions.forEach((_,i)=>{const v=fd.get(`q${i}`);if(v!==null)practiceState.answers[i]=Number(v);});
      practiceState.submitted=true; const score=practiceState.questions.reduce((s,q,i)=>s+(practiceState.answers[i]===q.answer?1:0),0);
      render();
      trackActivity(user,'free_course_practice_submitted',{courseId:course.id,category:current,score,total:50});
      setTimeout(()=>root.querySelector('.ff-quiz-meta')?.scrollIntoView({behavior:'smooth',block:'start'}),50);
    });
  }

  function mock(){
    const c=CATEGORY_BY_ID[current];
    if(!mockState || mockState.category!==current){mockState={category:current,questions:c.mock.questions.map(shuffleQuestion),answers:{},startedAt:Date.now(),submitted:false,seconds:c.mock.duration*60};}
    if(mockState.submitted){
      const score=mockState.questions.reduce((s,q,i)=>s+(mockState.answers[i]===q.answer?1:0),0);
      content.innerHTML=`<div class="ff-result"><span class="eyebrow">MOCK COMPLETE</span><div class="ff-result-score">${score}<small>/30</small></div><h2>${escText(c.title)} Mock Test</h2><p>Your result is saved to your aspirant account.</p><div class="ff-result-grid"><div><span>Percentage</span><b>${Math.round(score/30*100)}%</b></div><div><span>Correct</span><b>${score}</b></div><div><span>Incorrect</span><b>${30-score}</b></div></div><div class="button-row"><button class="btn" id="retry-mock">Retry Mock</button><a class="btn secondary" href="dashboard.html">View Dashboard</a></div></div>`;
      root.querySelector('#retry-mock').onclick=()=>{mockState=null;render();};
      return;
    }
    const answered=Object.keys(mockState.answers).length;
    content.innerHTML=`<div class="ff-section-head"><span class="eyebrow">TIMED MOCK TEST</span><h2>30 Questions · ${escText(c.title)}</h2><p>25 minutes · 30 marks · no negative marking. Submit when finished.</p></div>${categoryPicker()}<div class="ff-mockbar"><b>Progress: ${answered}/30</b><strong id="ff-timer">${Math.floor(mockState.seconds/60)}:${String(mockState.seconds%60).padStart(2,'0')}</strong></div><form id="mock-form" class="ff-question-list">${mockState.questions.map((q,i)=>`<fieldset class="ff-q"><legend><span>${i+1}</span>${escText(q.question)}</legend>${q.options.map((o,j)=>`<label class="ff-option"><input type="radio" name="q${i}" value="${j}"><span>${escText(o)}</span></label>`).join('')}</fieldset>`).join('')}<button class="btn" type="submit">Submit Mock Test</button><p id="mock-msg" class="form-message"></p></form>`;
    bindCategories();
    const form=root.querySelector('#mock-form');
    let remaining=mockState.seconds;
    mockTimer=setInterval(()=>{remaining--;mockState.seconds=remaining;const t=root.querySelector('#ff-timer');if(t)t.textContent=`${Math.max(0,Math.floor(remaining/60))}:${String(Math.max(0,remaining%60)).padStart(2,'0')}`;if(remaining<=0){clearInterval(mockTimer);mockTimer=null;form.requestSubmit();}},1000);
    form.addEventListener('submit',async e=>{e.preventDefault();if(mockTimer){clearInterval(mockTimer);mockTimer=null;}if(mockState.submitted)return;const fd=new FormData(form);mockState.answers={};mockState.questions.forEach((_,i)=>{const v=fd.get(`q${i}`);if(v!==null)mockState.answers[i]=Number(v);});mockState.submitted=true;const score=mockState.questions.reduce((s,q,i)=>s+(mockState.answers[i]===q.answer?1:0),0);const btn=form.querySelector('button');btn.disabled=true;btn.textContent='Saving result…';try{const ref=await dbPush(`users/${user.uid}/results`);const result={resultId:ref.key,testId:`free-foundation-${current}-mock`,testTitle:`Free Foundation • ${c.title} Mock`,examId:'all',userId:user.uid,score,total:30,percentage:Math.round(score/30*100),answers:mockState.answers,submittedAt:Date.now()};await dbSet(`users/${user.uid}/results/${ref.key}`,result);await dbSet(`results/${ref.key}`,result);await trackActivity(user,'free_course_mock_submitted',{courseId:course.id,category:current,score,total:30});render();}catch(err){mockState.submitted=false;const msg=root.querySelector('#mock-msg');if(msg)msg.textContent=err.message;btn.disabled=false;btn.textContent='Submit Mock Test';}});
  }

  function setActiveTab(){root.querySelectorAll('.ff-tabs button').forEach(x=>x.classList.toggle('active',x.dataset.mode===mode));}
  function render(){if(mockTimer){clearInterval(mockTimer);mockTimer=null;}setActiveTab(); if(mode==='overview')overview(); else if(mode==='notes')notes(); else if(mode==='practice')practice(); else mock();}
  render();
}

function $(id){return document.getElementById(id);}
