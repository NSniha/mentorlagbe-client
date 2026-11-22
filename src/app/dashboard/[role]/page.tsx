import {DashboardHome} from '@/components/DashboardPages';
export default async function RoleDashboard({params}:{params:Promise<{role:string}>}){const {role}=await params;return <DashboardHome role={role}/>}
