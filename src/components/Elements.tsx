import {ArrowUpRight} from 'lucide-react';
import Link from 'next/link';
export function SectionTitle({label,title,description,center=false,action}:{label:string;title:React.ReactNode;description?:string;center?:boolean;action?:{href:string;text:string}}){return <div className={`section-head ${center?'center-head':''}`}><div><span className="eyebrow"><span className="sparkle">✳</span> {label}</span><h2>{title}</h2>{description&&<p>{description}</p>}</div>{action&&<Link href={action.href} className="text-link">{action.text}<ArrowUpRight size={19}/></Link>}</div>}
export function PageIntro({label,title,description}:{label:string;title:React.ReactNode;description:string}){return <section className="page-intro"><div className="container"><span className="eyebrow">✳ {label}</span><h1>{title}</h1><p>{description}</p></div></section>}
export function EmptyState({title='Nothing here yet',description='New opportunities are on their way.'}:{title?:string;description?:string}){return <div className="empty-state"><div className="empty-illustration">✳</div><h3>{title}</h3><p>{description}</p></div>}
export function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="field-label"><span>{label}</span>{children}</label>}
export function Spinner(){return <div className="spinner" aria-label="Loading"/>}
