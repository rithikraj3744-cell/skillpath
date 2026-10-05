import {handleAPI} from '../server/api.js';
export default {
 async fetch(request){
  const url=new URL(request.url);
  if(url.searchParams.has('route')){url.pathname='/api/'+url.searchParams.get('route');url.searchParams.delete('route');request=new Request(url,request);}
  return handleAPI(request,process.env);
 }
};
