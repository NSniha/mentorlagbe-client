import {DashboardSection} from '@/components/DashboardPages';
export default async function SectionPage({params}:{params:Promise<{role:string;section:string}>}){const {role,section}=await params;return <DashboardSection role={role} section={section}/>}
