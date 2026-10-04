const key=String(process.env.EASY_ORDERS_API_KEY||"").trim();
const enabled=String(process.env.TEMP_EO_SYNC_TOKEN||"").trim();
if(process.env.VERCEL_ENV!=="production"||!key||!enabled){console.log("[easyorders-category-sync] skipped");process.exit(0)}
(async()=>{
  const id="917e9a46-466e-4ba2-87ec-aaa01b5e2abf";
  const get=await fetch("https://api.easy-orders.net/api/v1/external-apps/categories/"+id,{headers:{"Api-Key":key},cache:"no-store"});
  const current=await get.json().catch(()=>null);
  const body={
    name:current?.name||"ساعات",
    slug:current?.slug||"watches",
    show_in_header:false,
    hidden:true,
    position:current?.position??0,
    parent_id:current?.parent_id??null
  };
  const response=await fetch("https://api.easy-orders.net/api/v1/external-apps/categories/"+id,{
    method:"PATCH",
    headers:{"Api-Key":key,"Content-Type":"application/json"},
    body:JSON.stringify(body),
    cache:"no-store"
  });
  const out=await response.text();
  console.log("[easyorders-category-sync]",response.status,response.ok,out.slice(0,700));
  if(!response.ok) process.exit(1);
})().catch(e=>{console.error("[easyorders-category-sync] fatal",e instanceof Error?e.message:String(e));process.exit(1)});
