'use client';
import {createContext,useContext,useEffect,useMemo,useState,useCallback} from 'react';
import {createAuthClient} from 'better-auth/react';
import {toast,Toaster} from 'sonner';
import {API_URL,User,Role} from '@/lib/types';
import {request} from '@/lib/api';

type AuthContextType={user:User|null;token:string|null;loading:boolean;demo:boolean;login:(email:string,password:string)=>Promise<void>;register:(input:{name:string;email:string;password:string;role:Role})=>Promise<void>;logout:()=>Promise<void>;refresh:()=>Promise<void>;setUser:(user:User|null)=>void};
const Context=createContext<AuthContextType|null>(null);
const authClient=createAuthClient({baseURL:API_URL});
const TOKEN_KEY='mentorlagbe-access-token';
export function Providers({children}:{children:React.ReactNode}){
 const [token,setToken]=useState<string|null>(null),[user,setUser]=useState<User|null>(null),[loading,setLoading]=useState(true),[demo,setDemo]=useState(true);
 const remember=(newToken:string|null,newUser:User|null)=>{setToken(newToken);setUser(newUser);if(typeof window!=='undefined'){if(newToken)localStorage.setItem(TOKEN_KEY,newToken);else localStorage.removeItem(TOKEN_KEY);}};
 const refresh=useCallback(async()=>{
  const stored=typeof window!=='undefined'?localStorage.getItem(TOKEN_KEY):null;
  if(stored){try{const result=await request<{user:User}>('/api/me',{},stored);setToken(stored);setUser(result.user);return;}catch{/* try Better Auth cookie below */}}
  try{const result=await request<{token:string;user:User}>('/api/token',{method:'POST'});remember(result.token,result.user);}catch{remember(null,null);}
 },[]);
 useEffect(()=>{(async()=>{try{const health=await request<{mode:string}>('/api/health');setDemo(health.mode==='demo');}catch{setDemo(true);}await refresh();setLoading(false);})();},[refresh]);
 const login=async(email:string,password:string)=>{
  if(demo){const data=await request<{token:string;user:User}>('/api/demo/login',{method:'POST',body:JSON.stringify({email,password})});remember(data.token,data.user);return;}
  const result=await authClient.signIn.email({email,password});if(result.error)throw new Error(result.error.message||'Sign in failed');const data=await request<{token:string;user:User}>('/api/token',{method:'POST'});remember(data.token,data.user);
 };
 const register=async(values:{name:string;email:string;password:string;role:Role})=>{
  if(demo){const data=await request<{token:string;user:User}>('/api/demo/register',{method:'POST',body:JSON.stringify(values)});remember(data.token,data.user);return;}
  const result=await authClient.signUp.email(values as Parameters<typeof authClient.signUp.email>[0]);if(result.error)throw new Error(result.error.message||'Sign up failed');const data=await request<{token:string;user:User}>('/api/token',{method:'POST'});remember(data.token,data.user);
 };
 const logout=async()=>{if(!demo){try{await authClient.signOut();}catch{}}remember(null,null);toast.success('You have signed out.');};
 const value=useMemo(()=>({user,token,loading,demo,login,register,logout,refresh,setUser}),[user,token,loading,demo,refresh]);
 return <Context.Provider value={value}>{children}<Toaster position="top-right" richColors closeButton duration={3200}/></Context.Provider>;
}
export function useAuth(){const value=useContext(Context);if(!value)throw new Error('useAuth requires Providers');return value;}
