'use client';
import {useEffect,useMemo,useState} from 'react';
import {useSearchParams,useRouter} from 'next/navigation';
import {Search,SlidersHorizontal,ArrowLeft,ArrowRight,X,GraduationCap} from 'lucide-react';
import TuitionCard from '@/components/TuitionCard';
import {EmptyState,PageIntro,Spinner} from '@/components/Elements';
import {request} from '@/lib/api';
import {Tuition,PageResult} from '@/lib/types';
import {Suspense} from 'react';
const SUBJECTS=['All subjects','Mathematics','Physics','Programming','IELTS','English','Chemistry','Biology','Accounting'];
const LEVELS=['All levels','Class 6–8','SSC / Class 9–10','Class 9–10','HSC / Class 11–12','University / Adult'];
function BrowseInner(){
 const router=useRouter(),params=useSearchParams();
 const [search,setSearch]=useState(params.get('search')||''),[subject,setSubject]=useState(params.get('subject')||'All subjects'),[level,setLevel]=useState(params.get('classLevel')||'All levels'),[mode,setMode]=useState(params.get('mode')||'All modes'),[page,setPage]=useState(1),[loading,setLoading]=useState(true),[result,setResult]=useState<PageResult<Tuition>>({items:[],page:1,pages:1,total:0});
 useEffect(()=>{setPage(1);},[search,subject,level,mode]);
 useEffect(()=>{let cancelled=false;const timer=setTimeout(()=>{
  const qs=new URLSearchParams({page:String(page),limit:'9'});if(search)qs.set('search',search);if(subject!=='All subjects')qs.set('subject',subject);if(level!=='All levels')qs.set('classLevel',level);if(mode!=='All modes')qs.set('mode',mode);
  router.replace('/tuitions?'+qs.toString(),{scroll:false});setLoading(true);
  request<PageResult<Tuition>>('/api/tuitions?'+qs.toString()).then(d=>{if(!cancelled)setResult(d)}).catch(()=>{if(!cancelled)setResult({items:[],total:0,pages:1,page:1})}).finally(()=>{if(!cancelled)setLoading(false)});
 },280);return()=>{cancelled=true;clearTimeout(timer)};
 },[search,subject,level,mode,page,router]);
 const hasFilters=!!search||subject!=='All subjects'||level!=='All levels'||mode!=='All modes';
 const reset=()=>{setSearch('');setSubject('All subjects');setLevel('All levels');setMode('All modes');setPage(1);};
 return <><PageIntro label="THE MENTORSHIP DIRECTORY" title={<>Find guidance that <em>fits your goals.</em></>} description="Discover approved mentors. Search by subject, class level, learning mode or budget-friendly monthly tuition."/><section className="browse-section section"><div className="container"><div className="filter-panel"><div className="filter-main"><label className="search-box"><Search size={21}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Try Mathematics, IELTS, Programming..." aria-label="Search by title or subject"/>{search&&<button onClick={()=>setSearch('')} aria-label="Clear search"><X size={16}/></button>}</label><span className="filter-label"><SlidersHorizontal size={18}/> Filter by</span></div><div className="filter-selects"><label>Subject<select value={subject} onChange={e=>setSubject(e.target.value)}>{SUBJECTS.map(x=><option key={x}>{x}</option>)}</select></label><label>Class level<select value={level} onChange={e=>setLevel(e.target.value)}>{LEVELS.map(x=><option key={x}>{x}</option>)}</select></label><label>Mode<select value={mode} onChange={e=>setMode(e.target.value)}>{['All modes','Online','Offline'].map(x=><option key={x}>{x}</option>)}</select></label>{hasFilters&&<button className="clear-btn" onClick={reset}>Clear filters <X size={15}/></button>}</div></div><div className="browse-results-head"><div><h2>Explore mentorships <span>({result.total})</span></h2><p>Each listing is reviewed before it appears here.</p></div><span className="browse-count">Showing {result.items.length} of {result.total} listings</span></div>{loading?<div className="result-spinner"><Spinner/></div>:result.items.length?<div className="course-grid">{result.items.map(t=><TuitionCard key={t.id} tuition={t}/>)}</div>:<EmptyState title="No matching tuitions yet" description="Try another subject or clear the filters to see more opportunities."/>}{!loading&&result.pages>1&&<div className="pagination"><button disabled={page<=1} onClick={()=>setPage(p=>p-1)}><ArrowLeft size={17}/> Previous</button>{Array.from({length:result.pages},(_,i)=><button key={i} onClick={()=>setPage(i+1)} className={page===i+1?'selected':''}>{i+1}</button>)}<button disabled={page>=result.pages} onClick={()=>setPage(p=>p+1)}>Next <ArrowRight size={17}/></button></div>}</div></section></>;
}
export default function TuitionsPage(){return <Suspense fallback={<div className="result-spinner"><Spinner/></div>}><BrowseInner/></Suspense>}
