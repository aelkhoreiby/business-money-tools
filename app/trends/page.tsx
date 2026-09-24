"use client";

import { useEffect, useState } from "react";

type Trend = { title:string; traffic:string; published:string; link:string; geo:string; rank:number };

export default function TrendsPage() {
  const [geo,setGeo] = useState("US");
  const [data,setData] = useState<{generatedAt:string;count:number;trends:Trend[]}|null>(null);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState("");

  async function load() {
    setLoading(true); setError("");
    try {
      const r = await fetch(`/api/trends?geo=${geo}`, {cache:"no-store"});
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Trend feed failed");
      setData(j);
    } catch(e) { setError(String(e instanceof Error ? e.message : e)); }
    finally { setLoading(false); }
  }

  useEffect(()=>{ load(); },[geo]);

  return (
    <main style={{maxWidth:1100,margin:"0 auto",padding:"48px 20px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"end",gap:20,marginBottom:30}}>
        <div>
          <p style={{fontSize:13,opacity:.65,letterSpacing:1.5}}>MACHINE-FIRST DATA</p>
          <h1 style={{fontSize:42,margin:"8px 0"}}>Trend Intelligence API</h1>
          <p style={{opacity:.72}}>Live trend signals formatted for AI agents and automation.</p>
        </div>
        <div style={{display:"flex",gap:10}}>
          <select value={geo} onChange={e=>setGeo(e.target.value)} style={{padding:"10px 12px",borderRadius:10}}>
            <option>US</option><option>GB</option><option>CA</option><option>AU</option><option>DE</option><option>FR</option><option>IN</option><option>AE</option><option>EG</option>
          </select>
          <button onClick={load} style={{padding:"10px 14px",borderRadius:10}}>Refresh</button>
        </div>
      </div>
      <div style={{fontFamily:"monospace",fontSize:12,opacity:.65,marginBottom:18}}>
        GET /api/trends?geo={geo} · {data ? `${data.count} signals · ${new Date(data.generatedAt).toLocaleTimeString()}` : "loading"}
      </div>
      {loading && <p>Fetching live signals…</p>}
      {error && <p style={{color:"crimson"}}>{error}</p>}
      <div style={{display:"grid",gap:12}}>
        {data?.trends.map(t=>
          <a key={t.rank+t.title} href={t.link} target="_blank" rel="noreferrer" style={{display:"block",padding:18,border:"1px solid #ddd",borderRadius:14,textDecoration:"none",color:"inherit"}}>
            <div style={{display:"flex",justifyContent:"space-between",gap:15}}>
              <strong>{t.rank}. {t.title}</strong>
              <span style={{opacity:.6}}>{t.traffic || "—"}</span>
            </div>
            <div style={{fontSize:12,opacity:.6,marginTop:8}}>{t.published}</div>
          </a>
        )}
      </div>
    </main>
  );
}
