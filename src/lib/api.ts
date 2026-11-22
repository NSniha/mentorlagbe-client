import {API_URL} from './types';
export async function request<T=any>(path:string,options:RequestInit={},token?:string|null):Promise<T>{
 const headers:Record<string,string>={...(options.headers as Record<string,string>||{})};
 if(!(options.body instanceof FormData)&&options.body)headers['Content-Type']='application/json';
 if(token)headers.Authorization=`Bearer ${token}`;
 let response:Response;
 try{response=await fetch(API_URL+path,{...options,headers,credentials:'include',cache:'no-store'});}catch{throw new Error('Cannot connect to the API. Start the Express server on port 5000.');}
 const data=await response.json().catch(()=>({}));if(!response.ok)throw new Error(data.error||`Request failed (${response.status})`);return data as T;
}
export const post=(path:string,body:any,token?:string|null)=>request(path,{method:'POST',body:JSON.stringify(body)},token);
export const patch=(path:string,body:any,token?:string|null)=>request(path,{method:'PATCH',body:JSON.stringify(body)},token);
export const del=(path:string,token?:string|null)=>request(path,{method:'DELETE'},token);
