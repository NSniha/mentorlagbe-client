'use client';
import {Suspense,useEffect,useState} from 'react';
import {useSearchParams,useRouter} from 'next/navigation';
import {Search,SlidersHorizontal,ArrowLeft,ArrowRight,X,GraduationCap} from 'lucide-react';
import TuitionCard from '@/components/TuitionCard';
import {EmptyState,PageIntro,Spinner} from '@/components/Elements';
import {request} from '@/lib/api';
import {Tuition,PageResult} from '@/lib/types';
const SUBJECTS=['All subjects','Mathematics','Physics','Programming','IELTS','English','Chemistry','Biology','Accounting'];
const LEVELS=['All levels','Class 6–8','SSC / Class 9–10','Class 9–10','HSC / Class 11–12','University / Adult'];
function BrowseInner(){
 const router=useRouter(),params=useSearchParams();
 const [search,setSearch]=useState(params.get('search')||''),[subject,setSubject]=useState(params.get('subject')||'All subjects'),[level,setLevel]=useState(params.get('classLevel')||'All levels'),[mode,setMode]=useState(params.get('mode')||'All modes');
 const [page,setPage]=useState(()=>{
  const initialPage = Number(params.get('page'));
  return Number.isSafeInteger(initialPage) && initialPage > 0 ? initialPage : 1;
 });
 const [loading,setLoading]=useState(true),[result,setResult]=useState<PageResult<Tuition>>({items:[],page:1,pages:1,total:0});
 const [loadError,setLoadError]=useState(false),[attempt,setAttempt]=useState(0);
 useEffect(()=>{
  const controller = new AbortController();
  const qs=new URLSearchParams({page:String(page),limit:'9'});if(search)qs.set('search',search);if(subject!=='All subjects')qs.set('subject',subject);if(level!=='All levels')qs.set('classLevel',level);if(mode!=='All modes')qs.set('mode',mode);
  const timer=setTimeout(async()=>{
   setLoading(true);
   setLoadError(false);
   let visiblePage = page;
   try {
    const response = await request<PageResult<Tuition>>('/api/tuitions?'+qs.toString(), {signal:controller.signal});
    if (controller.signal.aborted) return;
    setResult(response);
    visiblePage = response.page;
   } catch {
    if (controller.signal.aborted) return;
    setLoadError(true);
   }
   if (controller.signal.aborted) return;
   qs.set('page', String(visiblePage));
   router.replace('/tuitions?'+qs.toString(),{scroll:false});
   setLoading(false);
  },280);
  return()=>{controller.abort();clearTimeout(timer);};
 },[search,subject,level,mode,page,router,attempt]);
 const hasFilters=!!search||subject!=='All subjects'||level!=='All levels'||mode!=='All modes';
 const reset=()=>{setSearch('');setSubject('All subjects');setLevel('All levels');setMode('All modes');setPage(1);};
 return <><PageIntro label="THE MENTORSHIP DIRECTORY" title={<>Find guidance that <em>fits your goals.</em></>} description="Discover approved mentors. Search by subject, class level, learning mode or budget-friendly monthly tuition."/><section className="browse-section section"><div className="container"><div className="filter-panel"><div className="filter-main"><label className="search-box"><Search size={21}/><input value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} placeholder="Try Mathematics, IELTS, Programming..." aria-label="Search by title or subject"/>{search&&<button onClick={()=>{setSearch('');setPage(1);}} aria-label="Clear search"><X size={16}/></button>}</label><span className="filter-label"><SlidersHorizontal size={18}/> Filter by</span></div><div className="filter-selects"><label>Subject<select value={subject} onChange={e=>{setSubject(e.target.value);setPage(1);}}>{SUBJECTS.map(x=><option key={x}>{x}</option>)}</select></label><label>Class level<select value={level} onChange={e=>{setLevel(e.target.value);setPage(1);}}>{LEVELS.map(x=><option key={x}>{x}</option>)}</select></label><label>Mode<select value={mode} onChange={e=>{setMode(e.target.value);setPage(1);}}>{['All modes','Online','Offline'].map(x=><option key={x}>{x}</option>)}</select></label>{hasFilters&&<button className="clear-btn" onClick={reset}>Clear filters <X size={15}/></button>}</div></div><div className="browse-results-head"><div><h2>Explore mentorships <span>({result.total})</span></h2><p>Each listing is reviewed before it appears here.</p></div><span className="browse-count">Showing {result.items.length} of {result.total} listings</span></div>{loading?<div className="result-spinner"><Spinner/></div>:loadError?<div role="alert" className="result-spinner"><p>We couldn’t load the tuition listings.</p><button type="button" className="btn" onClick={()=>setAttempt(value=>value+1)}>Try again</button></div>:result.items.length?<div className="course-grid">{result.items.map(t=><TuitionCard key={t.id} tuition={t}/>)}</div>:<EmptyState title="No matching tuitions yet" description="Try another subject or clear the filters to see more opportunities."/>}{!loading&&!loadError&&result.pages>1&&<div className="pagination"><button disabled={result.page<=1} onClick={()=>setPage(result.page-1)}><ArrowLeft size={17}/> Previous</button>{Array.from({length:result.pages},(_,i)=><button key={i} onClick={()=>setPage(i+1)} aria-current={result.page===i+1?'page':undefined} className={result.page===i+1?'selected':''}>{i+1}</button>)}<button disabled={result.page>=result.pages} onClick={()=>setPage(result.page+1)}>Next <ArrowRight size={17}/></button></div>}</div></section></>;
}
export default function TuitionsPage(){return <Suspense fallback={<div className="result-spinner"><Spinner/></div>}><BrowseInner/></Suspense>}
