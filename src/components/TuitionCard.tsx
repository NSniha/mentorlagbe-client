'use client';
import Link from 'next/link';
import {ArrowUpRight,Bookmark,CalendarDays,MapPin,MonitorPlay} from 'lucide-react';
import {Tuition,formatMoney} from '@/lib/types';
import {useAuth} from './Providers';
import {request} from '@/lib/api';
import {toast} from 'sonner';
export default function TuitionCard({tuition,showSave=true}:{tuition:Tuition;showSave?:boolean}){
 const {user,token}=useAuth();
 const bookmark=async()=>{if(!user){toast.info('Please sign in as a student to save a tuition.');return;}if(user.role!=='student'){toast.info('Bookmarks are available for students.');return;}try{const data=await request<{saved:boolean}>(`/api/student/bookmarks/${tuition.id}`,{method:'POST'},token);toast.success(data.saved?'Saved to your list':'Removed from saved tuitions');}catch(e){toast.error((e as Error).message);}};
 return <article className="tuition-card"><div className="tuition-image"><Link href={`/tuitions/${tuition.id}`}><img src={tuition.bannerImage} loading="lazy" alt={`${tuition.subject} mentoring session`}/></Link><span className="image-tag">{tuition.mode==='Online'?<MonitorPlay size={12}/>:<MapPin size={12}/>} {tuition.mode}</span>{showSave&&<button className="save-button" onClick={bookmark} aria-label="Save tuition"><Bookmark size={17}/></button>}</div><div className="tuition-body"><div className="tuition-meta"><span className="subject-label">{tuition.subject}</span><span><CalendarDays size={13}/> {tuition.daysPerWeek} days / week</span></div><Link href={`/tuitions/${tuition.id}`} className="tuition-title">{tuition.title}</Link><p className="tuition-level">{tuition.classLevel} <span>·</span> {tuition.location}</p><div className="tuition-bottom"><div className="tutor-mini"><span className="mini-portrait">{tuition.tutorName?.split(' ').map(w=>w[0]).slice(0,2).join('')}</span><div><b>{tuition.tutorName}</b><small>Verified mentor</small></div></div><div className="price"><strong>{formatMoney(tuition.monthlyFee)}</strong><small>/ month</small></div></div><Link href={`/tuitions/${tuition.id}`} className="card-action">View mentorship <ArrowUpRight size={17}/></Link></div></article>;
}
