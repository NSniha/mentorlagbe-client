'use client';
import Link from 'next/link';
import {usePathname,useRouter} from 'next/navigation';
import {useEffect,useState} from 'react';
import {ArrowUpRight,BookOpen,ChevronDown,LogOut,Menu,Sun,Moon,UserRound,LayoutDashboard,X} from 'lucide-react';
import {useAuth} from './Providers';

export default function Header(){
 const pathname=usePathname(),router=useRouter(),{user,logout}=useAuth();const [open,setOpen]=useState(false),[profile,setProfile]=useState(false),[dark,setDark]=useState(false),[scrolled,setScrolled]=useState(false);
 useEffect(()=>{setOpen(false);setProfile(false);},[pathname]);
 useEffect(()=>{const saved=localStorage.getItem('mentorlagbe-theme')==='dark';setDark(saved);document.documentElement.classList.toggle('dark',saved);const fn=()=>setScrolled(window.scrollY>50);window.addEventListener('scroll',fn);fn();return()=>window.removeEventListener('scroll',fn);},[]);
 const toggleTheme=()=>{setDark(v=>{const next=!v;document.documentElement.classList.toggle('dark',next);localStorage.setItem('mentorlagbe-theme',next?'dark':'light');return next;});};
 const onHome=pathname==='/',isDashboard=pathname.startsWith('/dashboard');
 const links=[['/','Home'],['/tuitions','Browse Tuitions'],['/pricing','Pricing'],['/how-it-works','How It Works']];
 return <header className={`site-header ${onHome?'on-hero':''} ${scrolled?'scrolled':''} ${isDashboard?'dash-header':''}`}>
  <div className="container header-inner"><Link href="/" className="brand"><span className="brand-symbol"><BookOpen size={23} strokeWidth={2.4}/></span><span>mentor<span className="brand-accent">lagbe</span><i>.</i></span></Link>
  <nav className={`main-nav ${open?'nav-open':''}`} aria-label="Main navigation">{links.map(([url,label])=><Link key={url} href={url} className={(pathname===url?'active ':'')+'nav-link'}>{label}</Link>)}<Link href="/about" className={`nav-link ${pathname==='/about'?'active':''}`}>About Us</Link></nav>
  <div className="header-actions"><button className="theme-button" onClick={toggleTheme} title="Toggle light and dark theme" aria-label="Toggle theme">{dark?<Sun size={18}/>:<Moon size={18}/>}</button>
  {!user?<div className="auth-actions"><Link className="header-login" href="/sign-in">Log in</Link><Link href="/sign-up" className="btn btn-primary btn-sm">Get Started <ArrowUpRight size={16}/></Link></div>:
  <div className="profile-menu-wrap"><button className="profile-trigger" onClick={()=>setProfile(x=>!x)}><span className="avatar small-avatar">{user.image?<img src={user.image} alt={user.name}/>:user.name.slice(0,1)}</span><span className="profile-short"><b>{user.name.split(' ')[0]}</b><small>{user.role}</small></span><ChevronDown size={15}/></button>{profile&&<div className="profile-dropdown"><div className="profile-dropdown-head"><strong>{user.name}</strong><small>{user.email}</small></div><Link href={`/dashboard/${user.role}`}><LayoutDashboard size={16}/> Dashboard</Link><Link href="/dashboard/profile"><UserRound size={16}/> Edit profile</Link><button onClick={async()=>{await logout();router.push('/');}}><LogOut size={16}/> Sign out</button></div>}</div>}
  <button className="mobile-toggle" onClick={()=>setOpen(x=>!x)} aria-label="Toggle navigation">{open?<X size={22}/>:<Menu size={22}/>}</button></div></div>
 </header>;
}
