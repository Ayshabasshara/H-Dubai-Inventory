import { useState, useMemo, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────
const BASE_ITEMS_STU  = { "Bathroom Telephone":1,"TV":1,"WiFi":1,"IP Phone":1,"Writing Desk":1,"GRMS":1 };
const BASE_ITEMS_1BR  = { "Bathroom Telephone":1,"TV (Bedroom)":1,"TV (Living Room)":1,"IP Phone (Bedroom)":1,"IP Phone (Living Room)":0,"Writing Desk":1,"WiFi (Bedroom)":1,"WiFi (Living Room)":1,"GRMS":1 };
const BASE_ITEMS_2BR  = { "Bathroom Telephone":2,"TV (BR1)":1,"TV (BR2)":1,"TV (Living Room)":1,"IP Phone (Bedrooms 1&2)":2,"IP Phone (Living Room)":0,"Writing Desk":1,"WiFi (BR1)":1,"WiFi (BR2)":1,"WiFi (Living Room)":1,"GRMS":1 };
const BASE_ITEMS_3BR  = { "Bathroom Telephone":3,"TV (BR1+BR2+BR3)":3,"TV (Living Room)":1,"IP Phone (Bedrooms)":3,"IP Phone (Office)":1,"Writing Desk":1,"WiFi (BR1+BR2+BR3)":3,"WiFi (Living Room)":1,"GRMS":1 };
const BASE_ITEMS_STD  = { "Bathroom Telephone":1,"TV":1,"WiFi":1,"IP Phone":1,"Writing Desk":1,"GRMS":1 };
const BASE_ITEMS_1BR2 = { "Bathroom Telephone":1,"TV (Bedroom)":1,"TV (Living Room)":1,"IP Phone (Bedroom)":1,"IP Phone (Living Room)":1,"Writing Desk":1,"WiFi (Bedroom)":1,"WiFi (Living Room)":1,"GRMS":1 };

const SEED = [
  ...[504,604,704,804,902,1002,1102,1202,1302].map(r=>({room:r,type:"STU",typeName:"Junior Suite",category:"Apartments",floor:Math.floor(r/100),items:{...BASE_ITEMS_STU}})),
  ...[501,502,503,505,601,602,603,605,701,702,703,705,801,802,803,805,903,1003,1103,1203,1303].map(r=>({room:r,type:"1BR",typeName:"1 Bedroom",category:"Apartments",floor:Math.floor(r/100),items:{...BASE_ITEMS_1BR}})),
  ...[506,507,606,607,706,707,806,807,904,905,1004,1005,1104,1105,1204,1205,1304,1305].map(r=>({room:r,type:"2BR",typeName:"2 Bedroom Suite",category:"Apartments",floor:Math.floor(r/100),items:{...BASE_ITEMS_2BR}})),
  ...[901,1001,1101,1201,1301].map(r=>({room:r,type:"3BR",typeName:"3 Bedroom Suite",category:"Apartments",floor:Math.floor(r/100),items:{...BASE_ITEMS_3BR}})),
  ...[1407,1807,2207,2307,2407,3012].map(r=>({room:r,type:"GPTZ",typeName:"GPTZ Room",category:"Rooms",floor:Math.floor(r/100),items:{...BASE_ITEMS_STD}})),
  ...[1408,1409,1410,1411,1412,1507,1508,1509,1510,1607,1608,1609,1610,1707,1708,1709,1710,1808,1809,1810,1907,1908,1909,1910,2007,2008,2009,2010,2107,2108,2109,2110,2208,2209,2210,2308,2309,2310,2408,2507,2508,2607,2608,2707,2708,2807,2808,2907,2908,2911,2912,3007,3008,3011,3107,3108].map(r=>({room:r,type:"GPKZ",typeName:"GPKZ Room",category:"Rooms",floor:Math.floor(r/100),items:{...BASE_ITEMS_STD}})),
  ...[1501,1503,1504,1505,1601,1603,1604,1605,1701,1703,1704,1705,1801,1803,1804,1805,1901,1903,1904,1905,2001,2003,2004,2005,2101,2103,2104,2105,2201,2203,2204,2205,2301,2303,2304,2305,2401,2403,2404,2405,2501,2503,2504,2601,2603,2604,2605,2701,2703,2704,2705,2801,2803,2804,2805,2901,2903,2904,2905,3001,3004,3005,3105].map(r=>({room:r,type:"GDKJ",typeName:"GDKJ Room",category:"Rooms",floor:Math.floor(r/100),items:{...BASE_ITEMS_STD}})),
  ...[1502,1602,1702,1802,1902,2002,2102,2202,2302,2402,2502,2505,2602,2702,2802,2902].map(r=>({room:r,type:"GDTJ",typeName:"GDTJ Room",category:"Rooms",floor:Math.floor(r/100),items:{...BASE_ITEMS_STD}})),
  ...[1506,1606,1706,1806,1906,2006,2106,2206,2306,2406,2506,2606,2706,2806,2906,3006].map(r=>({room:r,type:"EJSC",typeName:"EJSC Suite",category:"Rooms",floor:Math.floor(r/100),items:{...BASE_ITEMS_1BR2}})),
  ...[1512,1612,1712,1812,1912,2012,2112,2212,2312,2410,2412,2510,2512,2610,2612,2710,2712,2810,2812,2910,3002,3010].map(r=>({room:r,type:"EPSS",typeName:"EPSS Suite",category:"Rooms",floor:Math.floor(r/100),items:{...BASE_ITEMS_1BR2}})),
  {room:3013,type:"SKY",typeName:"Sky Suite",category:"VIP",floor:30,items:{"Bathroom Telephone":1,"TV (Bedroom)":1,"TV (Living Room)":2,"IP Phone (Bedroom)":1,"Writing Desk":1,"WiFi (Bedroom)":1,"WiFi (Living Room)":2,"GRMS":0}},
  {room:3101,type:"PRS",typeName:"Presidential Suite",category:"VIP",floor:31,items:{"Bathroom Telephone":2,"TV (BR1+BR2)":2,"TV (Living Room)":1,"IP Phone (Bedrooms)":2,"Writing Desk":1,"WiFi (BR1+BR2)":2,"WiFi (Living Room)":1,"GRMS":0}},
  {room:3112,type:"PRS",typeName:"Presidential Suite",category:"VIP",floor:31,items:{"Bathroom Telephone":2,"TV (BR1+BR2)":2,"TV (Living Room)":1,"IP Phone (Bedrooms)":2,"Writing Desk":1,"WiFi (BR1+BR2)":2,"WiFi (Living Room)":1,"GRMS":0}},
  {room:3201,type:"RYL",typeName:"Royal Suite",category:"VIP",floor:32,items:{"Bathroom Telephone":4,"TV (Bedrooms)":3,"TV (Living Room)":1,"IP Phone (Bedrooms)":3,"IP Phone (Office)":1,"Writing Desk":2,"WiFi (Bedrooms)":3,"WiFi (Living Room)":1,"GRMS":0}},
];

const STATUS_OPTIONS = ["Working","Faulty","Missing","Under Maintenance"];
const STATUS_COLOR   = {Working:"#16A34A",Faulty:"#DC2626","Missing":"#7C3AED","Under Maintenance":"#D97706"};
const STATUS_BG      = {Working:"#DCFCE7",Faulty:"#FEE2E2","Missing":"#EDE9FE","Under Maintenance":"#FEF3C7"};
const STATUS_ICON    = {Working:"✅",Faulty:"⚠️","Missing":"❌","Under Maintenance":"🔧"};

const CAT_CFG = {
  Apartments:{color:"#1D4ED8",bg:"#EFF6FF",pill:"#BFDBFE",dark:"#1E3A8A"},
  Rooms:     {color:"#047857",bg:"#ECFDF5",pill:"#A7F3D0",dark:"#065F46"},
  VIP:       {color:"#92400E",bg:"#FFFBEB",pill:"#FDE68A",dark:"#78350F"},
};
const TYPE_META = {
  STU:{label:"Junior Suite",icon:"🛏"},
  "1BR":{label:"1 Bedroom",icon:"🛋"},
  "2BR":{label:"2 Bedroom Suite",icon:"🏠"},
  "3BR":{label:"3 Bedroom Suite",icon:"🏡"},
  GPTZ:{label:"GPTZ Room",icon:"🏢"},
  GPKZ:{label:"GPKZ Room",icon:"🏢"},
  GDKJ:{label:"GDKJ Room",icon:"🏢"},
  GDTJ:{label:"GDTJ Room",icon:"🏢"},
  EJSC:{label:"EJSC Suite",icon:"🌟"},
  EPSS:{label:"EPSS Suite",icon:"🌟"},
  SKY: {label:"Sky Suite",icon:"☁️"},
  PRS: {label:"Presidential Suite",icon:"👑"},
  RYL: {label:"Royal Suite",icon:"💎"},
};

function itemIcon(name){
  const n=name.toLowerCase();
  if(n.includes("telephone")||n.includes("phone")) return "📞";
  if(n.includes("tv")) return "📺";
  if(n.includes("wifi")) return "📡";
  if(n.includes("writing")) return "🖊";
  if(n.includes("grms")) return "🔧";
  return "📦";
}

function initStatus(rooms){
  const s={};
  rooms.forEach(r=>{
    s[r.room]={};
    Object.keys(r.items).forEach(k=>{ s[r.room][k]="Working"; });
  });
  return s;
}

function initItems(rooms){
  const m={};
  rooms.forEach(r=>{ m[r.room]={...r.items}; });
  return m;
}

// ─────────────────────────────────────────────────────────────
// STORAGE HELPERS (in-memory, no localStorage)
// ─────────────────────────────────────────────────────────────
const useAppState = () => {
  const [rooms] = useState(SEED);
  const [statuses, setStatuses] = useState(()=>initStatus(SEED));
  const [quantities, setQuantities] = useState(()=>initItems(SEED));
  const [notes, setNotes] = useState({});

  const updateStatus = useCallback((roomNo, item, val)=>{
    setStatuses(s=>({...s,[roomNo]:{...s[roomNo],[item]:val}}));
  },[]);
  const updateQty = useCallback((roomNo, item, val)=>{
    setQuantities(q=>({...q,[roomNo]:{...q[roomNo],[item]:Math.max(0,val)}}));
  },[]);
  const updateNote = useCallback((roomNo, text)=>{
    setNotes(n=>({...n,[roomNo]:text}));
  },[]);

  return {rooms, statuses, quantities, notes, updateStatus, updateQty, updateNote};
};

// ─────────────────────────────────────────────────────────────
// UI PRIMITIVES
// ─────────────────────────────────────────────────────────────
function Badge({label,color,bg,size=12}){
  return <span style={{background:bg,color,padding:`2px ${size}px`,borderRadius:999,fontSize:size,fontWeight:700,letterSpacing:.4,whiteSpace:"nowrap"}}>{label}</span>;
}

function Tab({label,active,onClick,count}){
  return (
    <button onClick={onClick} style={{
      padding:"10px 18px",border:"none",borderBottom:`3px solid ${active?"#3B82F6":"transparent"}`,
      background:"transparent",color:active?"#1D4ED8":"#6B7280",fontWeight:active?800:600,
      fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:6,whiteSpace:"nowrap"
    }}>
      {label}
      {count!=null&&<span style={{background:active?"#BFDBFE":"#F3F4F6",color:active?"#1D4ED8":"#6B7280",
        borderRadius:999,padding:"1px 8px",fontSize:11,fontWeight:700}}>{count}</span>}
    </button>
  );
}

// ─────────────────────────────────────────────────────────────
// ROOM DETAIL MODAL
// ─────────────────────────────────────────────────────────────
function RoomModal({data,statuses,quantities,notes,updateStatus,updateQty,updateNote,onClose}){
  const [noteEdit,setNoteEdit]=useState("");
  const [tab,setTab]=useState("items");
  if(!data) return null;
  const cfg=CAT_CFG[data.category];
  const tm=TYPE_META[data.type]||{};
  const roomStatuses=statuses[data.room]||{};
  const roomQtys=quantities[data.room]||{};
  const roomNote=notes[data.room]||"";

  const totalQty=Object.values(roomQtys).reduce((a,b)=>a+b,0);
  const issues=Object.entries(roomStatuses).filter(([,v])=>v!=="Working");

  return (
    <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:200,
      display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#fff",borderRadius:20,width:"100%",
        maxWidth:560,boxShadow:"0 24px 60px rgba(0,0,0,.25)",overflow:"hidden",maxHeight:"90vh",display:"flex",flexDirection:"column"}}>

        {/* Header */}
        <div style={{background:cfg.dark,padding:"20px 24px",color:"#fff"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div>
              <div style={{fontSize:11,letterSpacing:2,opacity:.7,marginBottom:4}}>{data.category} · FLOOR {data.floor}</div>
              <div style={{fontSize:32,fontWeight:900,fontFamily:"monospace"}}>{tm.icon} Room {data.room}</div>
              <div style={{fontSize:13,opacity:.8,marginTop:2}}>{data.typeName}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <Badge label={data.type} color={cfg.dark} bg={cfg.pill} />
              {issues.length>0&&<div style={{marginTop:8,background:"#FEF3C7",color:"#92400E",padding:"4px 10px",borderRadius:8,fontSize:12,fontWeight:700}}>
                ⚠️ {issues.length} issue{issues.length>1?"s":""}
              </div>}
            </div>
          </div>
          {/* Stats row */}
          <div style={{display:"flex",gap:12,marginTop:14}}>
            {[["Total Points",totalQty],["Categories",Object.keys(roomQtys).length],["Issues",issues.length]].map(([l,v])=>(
              <div key={l} style={{background:"rgba(255,255,255,.15)",borderRadius:10,padding:"6px 14px",textAlign:"center"}}>
                <div style={{fontSize:20,fontWeight:900}}>{v}</div>
                <div style={{fontSize:9,opacity:.8,letterSpacing:.5}}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div style={{display:"flex",borderBottom:"1px solid #E5E7EB",padding:"0 20px",background:"#FAFAFA"}}>
          {[["items","Equipment"],["status","Status"],["notes","Notes"]].map(([k,l])=>(
            <Tab key={k} label={l} active={tab===k} onClick={()=>setTab(k)} />
          ))}
        </div>

        {/* Body */}
        <div style={{overflowY:"auto",flex:1,padding:"20px 24px"}}>

          {tab==="items"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,marginBottom:4}}>EQUIPMENT & QUANTITIES</div>
              {Object.entries(roomQtys).map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"10px 14px",borderRadius:10,border:"1px solid #E5E7EB",
                  background:v===0?"#F9FAFB":"#fff"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:18}}>{itemIcon(k)}</span>
                    <div>
                      <div style={{fontSize:14,fontWeight:600,color:v===0?"#9CA3AF":"#111827"}}>{k}</div>
                      <div style={{fontSize:11,color:STATUS_COLOR[roomStatuses[k]||"Working"]}}>{STATUS_ICON[roomStatuses[k]||"Working"]} {roomStatuses[k]||"Working"}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <button onClick={()=>updateQty(data.room,k,v-1)} style={{width:28,height:28,borderRadius:6,border:"1px solid #E5E7EB",background:"#F9FAFB",fontSize:16,cursor:"pointer",fontWeight:700,color:"#374151"}}>−</button>
                    <span style={{minWidth:28,textAlign:"center",fontSize:18,fontWeight:900,color:v===0?"#D1D5DB":cfg.color}}>{v}</span>
                    <button onClick={()=>updateQty(data.room,k,v+1)} style={{width:28,height:28,borderRadius:6,border:"1px solid #E5E7EB",background:"#F9FAFB",fontSize:16,cursor:"pointer",fontWeight:700,color:"#374151"}}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab==="status"&&(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <div style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,marginBottom:4}}>EQUIPMENT STATUS</div>
              {Object.entries(roomStatuses).map(([k,v])=>(
                <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  padding:"10px 14px",borderRadius:10,border:`1px solid ${STATUS_BG[v]}`,background:STATUS_BG[v]+"80"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:18}}>{itemIcon(k)}</span>
                    <span style={{fontSize:14,fontWeight:600,color:"#111827"}}>{k}</span>
                  </div>
                  <select value={v} onChange={e=>updateStatus(data.room,k,e.target.value)}
                    style={{padding:"5px 10px",borderRadius:8,border:`2px solid ${STATUS_COLOR[v]}`,
                      background:STATUS_BG[v],color:STATUS_COLOR[v],fontWeight:700,fontSize:12,cursor:"pointer"}}>
                    {STATUS_OPTIONS.map(s=><option key={s} value={s}>{STATUS_ICON[s]} {s}</option>)}
                  </select>
                </div>
              ))}
            </div>
          )}

          {tab==="notes"&&(
            <div>
              <div style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,marginBottom:10}}>ROOM NOTES</div>
              <textarea value={noteEdit} onChange={e=>setNoteEdit(e.target.value)}
                placeholder="Add maintenance notes, special instructions, or observations for this room…"
                style={{width:"100%",minHeight:180,padding:14,borderRadius:12,border:"1.5px solid #E5E7EB",
                  fontSize:14,lineHeight:1.6,resize:"vertical",boxSizing:"border-box",outline:"none",fontFamily:"inherit"}} />
              <button onClick={()=>updateNote(data.room,noteEdit)}
                style={{marginTop:10,background:cfg.dark,color:"#fff",border:"none",borderRadius:10,
                  padding:"10px 24px",fontWeight:700,fontSize:14,cursor:"pointer",width:"100%"}}>
                💾 Save Notes
              </button>
            </div>
          )}
        </div>

        <div style={{padding:"12px 24px",borderTop:"1px solid #F3F4F6",display:"flex",justifyContent:"flex-end"}}>
          <button onClick={onClose} style={{background:"#F1F5F9",color:"#374151",border:"none",borderRadius:10,
            padding:"10px 24px",fontWeight:700,fontSize:14,cursor:"pointer"}}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// OVERVIEW
// ─────────────────────────────────────────────────────────────
function Overview({rooms,statuses,quantities}){
  const catCounts={Apartments:0,Rooms:0,VIP:0};
  rooms.forEach(r=>catCounts[r.category]++);

  const totalIssues = rooms.reduce((acc,r)=>{
    const s=statuses[r.room]||{};
    return acc+Object.values(s).filter(v=>v!=="Working").length;
  },0);

  const totalPoints = rooms.reduce((acc,r)=>{
    const q=quantities[r.room]||{};
    return acc+Object.values(q).reduce((a,b)=>a+b,0);
  },0);

  // By type summary
  const byType={};
  rooms.forEach(r=>{
    if(!byType[r.type]) byType[r.type]={...TYPE_META[r.type],category:r.category,count:0,totals:{}};
    byType[r.type].count++;
    const q=quantities[r.room]||{};
    Object.entries(q).forEach(([k,v])=>{ byType[r.type].totals[k]=(byType[r.type].totals[k]||0)+v; });
  });

  return (
    <div>
      {/* KPI Row */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14,marginBottom:28}}>
        {[
          {label:"Total Rooms",val:rooms.length,color:"#0F172A",bg:"#F1F5F9",icon:"🏨"},
          {label:"Apartments",val:catCounts.Apartments,color:"#1D4ED8",bg:"#EFF6FF",icon:"🏠"},
          {label:"Hotel Rooms",val:catCounts.Rooms,color:"#047857",bg:"#ECFDF5",icon:"🏢"},
          {label:"VIP Suites",val:catCounts.VIP,color:"#92400E",bg:"#FFFBEB",icon:"💎"},
          {label:"Total Data Points",val:totalPoints,color:"#6D28D9",bg:"#EDE9FE",icon:"📊"},
          {label:"Active Issues",val:totalIssues,color:totalIssues>0?"#DC2626":"#16A34A",bg:totalIssues>0?"#FEE2E2":"#DCFCE7",icon:totalIssues>0?"⚠️":"✅"},
        ].map(k=>(
          <div key={k.label} style={{background:k.bg,borderRadius:16,padding:"18px 20px",border:`1.5px solid ${k.color}22`}}>
            <div style={{fontSize:24}}>{k.icon}</div>
            <div style={{fontSize:32,fontWeight:900,color:k.color,lineHeight:1.1,marginTop:4}}>{k.val.toLocaleString()}</div>
            <div style={{fontSize:12,color:"#6B7280",marginTop:4,fontWeight:600}}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* By Category */}
      {["Apartments","Rooms","VIP"].map(cat=>{
        const entries=Object.entries(byType).filter(([,d])=>d.category===cat);
        if(!entries.length) return null;
        const cfg=CAT_CFG[cat];
        return (
          <div key={cat} style={{marginBottom:32}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
              <div style={{height:4,width:32,background:cfg.color,borderRadius:2}}/>
              <h2 style={{margin:0,fontSize:17,fontWeight:900,color:"#0F172A"}}>{cat}</h2>
              <Badge label={`${entries.reduce((a,[,d])=>a+d.count,0)} rooms`} color={cfg.color} bg={cfg.pill}/>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:12}}>
              {entries.map(([k,d])=>(
                <div key={k} style={{background:cfg.bg,border:`2px solid ${cfg.pill}`,borderRadius:14,padding:"14px 16px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                    <div style={{fontSize:14,fontWeight:800,color:cfg.color}}>{d.icon} {d.label}</div>
                    <div style={{background:cfg.pill,borderRadius:10,padding:"4px 12px",textAlign:"center"}}>
                      <span style={{fontSize:20,fontWeight:900,color:cfg.color}}>{d.count}</span>
                      <span style={{fontSize:10,color:cfg.color,marginLeft:4}}>rooms</span>
                    </div>
                  </div>
                  {Object.entries(d.totals).map(([item,qty])=>(
                    <div key={item} style={{display:"flex",justifyContent:"space-between",fontSize:12,
                      color:qty===0?"#D1D5DB":"#374151",padding:"2px 0",borderBottom:"1px solid #00000008"}}>
                      <span>{itemIcon(item)} {item}</span>
                      <span style={{fontWeight:700,color:qty===0?"#D1D5DB":cfg.color}}>{qty}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// BROWSE ROOMS
// ─────────────────────────────────────────────────────────────
function BrowseRooms({rooms,statuses,quantities,notes,onSelect}){
  const [cat,setCat]=useState("All");
  const [type,setType]=useState("All");
  const [search,setSearch]=useState("");
  const [sort,setSort]=useState("room");

  const filtered=useMemo(()=>{
    let r=rooms;
    if(cat!=="All") r=r.filter(d=>d.category===cat);
    if(type!=="All") r=r.filter(d=>d.type===type);
    if(search) r=r.filter(d=>String(d.room).includes(search)||d.typeName.toLowerCase().includes(search.toLowerCase()));
    return [...r].sort((a,b)=>sort==="room"?a.room-b.room:a.floor-b.floor);
  },[rooms,cat,type,search,sort]);

  const cats=["All","Apartments","Rooms","VIP"];
  const types=["All",...new Set(rooms.map(d=>d.type))];

  return (
    <div>
      {/* Filters */}
      <div style={{background:"#fff",borderRadius:14,padding:"14px 18px",marginBottom:18,
        border:"1px solid #E2E8F0",display:"flex",flexWrap:"wrap",gap:10,alignItems:"center"}}>
        <div style={{position:"relative",flex:"1 1 160px"}}>
          <span style={{position:"absolute",left:10,top:"50%",transform:"translateY(-50%)",fontSize:16}}>🔍</span>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Room number or type…"
            style={{width:"100%",padding:"8px 12px 8px 34px",borderRadius:8,border:"1.5px solid #E2E8F0",
              fontSize:14,outline:"none",boxSizing:"border-box"}}/>
        </div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {cats.map(c=>{
            const cfg=c!=="All"?CAT_CFG[c]:null;
            const active=cat===c;
            return <button key={c} onClick={()=>{setCat(c);setType("All");}}
              style={{padding:"6px 14px",borderRadius:999,fontSize:13,fontWeight:700,cursor:"pointer",
                border:`1.5px solid ${active?(cfg?.color||"#0F172A"):"#E2E8F0"}`,
                background:active?(cfg?.bg||"#F8FAFC"):"#fff",
                color:active?(cfg?.color||"#0F172A"):"#6B7280"}}>{c}</button>;
          })}
        </div>
        <select value={type} onChange={e=>setType(e.target.value)}
          style={{padding:"7px 12px",borderRadius:8,border:"1.5px solid #E2E8F0",fontSize:14,background:"#fff",cursor:"pointer"}}>
          {types.filter(t=>t==="All"||cat==="All"||rooms.some(r=>r.type===t&&r.category===cat)).map(t=>(
            <option key={t} value={t}>{t==="All"?"All Types":`${TYPE_META[t]?.label||t} (${t})`}</option>
          ))}
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)}
          style={{padding:"7px 12px",borderRadius:8,border:"1.5px solid #E2E8F0",fontSize:14,background:"#fff",cursor:"pointer"}}>
          <option value="room">Sort: Room No.</option>
          <option value="floor">Sort: Floor</option>
        </select>
      </div>

      <div style={{fontSize:13,color:"#6B7280",marginBottom:12,fontWeight:600}}>{filtered.length} room{filtered.length!==1?"s":""} found</div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12}}>
        {filtered.map(d=>{
          const cfg=CAT_CFG[d.category];
          const tm=TYPE_META[d.type]||{};
          const q=quantities[d.room]||{};
          const s=statuses[d.room]||{};
          const issues=Object.values(s).filter(v=>v!=="Working").length;
          const total=Object.values(q).reduce((a,b)=>a+b,0);
          const hasNote=!!(notes[d.room]);
          return (
            <div key={`${d.room}-${d.type}`} onClick={()=>onSelect(d)}
              style={{background:"#fff",border:`2px solid ${issues>0?"#FCA5A5":cfg.pill}`,borderRadius:14,
                padding:"14px 16px",cursor:"pointer",transition:"all .15s",boxShadow:"0 1px 4px rgba(0,0,0,.05)"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 8px 20px rgba(0,0,0,.12)";}}
              onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,.05)";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontSize:20,fontWeight:900,color:"#111827",fontFamily:"monospace"}}>{tm.icon} {d.room}</div>
                  <div style={{fontSize:11,color:"#6B7280"}}>Floor {d.floor}</div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                  <Badge label={d.type} color={cfg.color} bg={cfg.pill}/>
                  {issues>0&&<span style={{fontSize:10,background:"#FEE2E2",color:"#DC2626",padding:"2px 6px",borderRadius:999,fontWeight:700}}>⚠️ {issues} issue{issues>1?"s":""}</span>}
                  {hasNote&&<span style={{fontSize:10,background:"#FEF3C7",color:"#92400E",padding:"2px 6px",borderRadius:999}}>📝 note</span>}
                </div>
              </div>
              <div style={{fontSize:11,color:"#6B7280",marginBottom:8}}>{d.typeName}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {Object.entries(q).filter(([,v])=>v>0).map(([k,v])=>(
                  <span key={k} style={{fontSize:10,background:cfg.bg,color:cfg.color,padding:"2px 7px",borderRadius:999,fontWeight:600}}>
                    {itemIcon(k)}×{v}
                  </span>
                ))}
              </div>
              <div style={{marginTop:8,fontSize:11,color:"#9CA3AF",textAlign:"right"}}>{total} pts · tap for details</div>
            </div>
          );
        })}
        {filtered.length===0&&(
          <div style={{gridColumn:"1/-1",textAlign:"center",padding:"60px 20px",color:"#9CA3AF"}}>
            <div style={{fontSize:48}}>🔍</div>
            <div style={{fontSize:18,fontWeight:700,marginTop:12}}>No rooms found</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FLOOR PLAN
// ─────────────────────────────────────────────────────────────
function FloorPlan({rooms,statuses,quantities,onSelect}){
  const floors=useMemo(()=>[...new Set(rooms.map(r=>r.floor))].sort((a,b)=>a-b),[rooms]);
  const [selFloor,setSelFloor]=useState(floors[0]);
  const floorRooms=useMemo(()=>rooms.filter(r=>r.floor===selFloor).sort((a,b)=>a.room-b.room),[rooms,selFloor]);

  return (
    <div>
      <div style={{marginBottom:18}}>
        <div style={{fontSize:12,fontWeight:700,color:"#9CA3AF",letterSpacing:1,marginBottom:8}}>SELECT FLOOR</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
          {floors.map(f=>{
            const fr=rooms.filter(r=>r.floor===f);
            const issues=fr.reduce((acc,r)=>acc+Object.values(statuses[r.room]||{}).filter(v=>v!=="Working").length,0);
            return (
              <button key={f} onClick={()=>setSelFloor(f)}
                style={{padding:"6px 14px",borderRadius:8,border:`2px solid ${selFloor===f?"#3B82F6":issues>0?"#FCA5A5":"#E2E8F0"}`,
                  background:selFloor===f?"#EFF6FF":"#fff",color:selFloor===f?"#1D4ED8":issues>0?"#DC2626":"#374151",
                  fontWeight:700,fontSize:13,cursor:"pointer",position:"relative"}}>
                {f}
                {issues>0&&<span style={{position:"absolute",top:-5,right:-5,background:"#DC2626",color:"#fff",
                  borderRadius:999,width:16,height:16,fontSize:9,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>{issues}</span>}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{background:"#F8FAFC",borderRadius:16,padding:20,border:"1.5px solid #E2E8F0",marginBottom:16}}>
        <div style={{fontSize:14,fontWeight:800,color:"#0F172A",marginBottom:4}}>Floor {selFloor}</div>
        <div style={{fontSize:12,color:"#6B7280",marginBottom:16}}>{floorRooms.length} room{floorRooms.length!==1?"s":""} on this floor</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
          {floorRooms.map(d=>{
            const cfg=CAT_CFG[d.category];
            const s=statuses[d.room]||{};
            const issues=Object.values(s).filter(v=>v!=="Working").length;
            const q=quantities[d.room]||{};
            const total=Object.values(q).reduce((a,b)=>a+b,0);
            const tm=TYPE_META[d.type]||{};
            return (
              <div key={d.room} onClick={()=>onSelect(d)}
                style={{width:110,background:"#fff",border:`2.5px solid ${issues>0?"#EF4444":cfg.color}`,
                  borderRadius:12,padding:"10px 12px",cursor:"pointer",transition:"all .15s",textAlign:"center"}}
                onMouseEnter={e=>{e.currentTarget.style.transform="scale(1.06)";e.currentTarget.style.boxShadow="0 6px 16px rgba(0,0,0,.14)";}}
                onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="";}}>
                <div style={{fontSize:20}}>{issues>0?"⚠️":tm.icon}</div>
                <div style={{fontSize:15,fontWeight:900,color:cfg.color,fontFamily:"monospace",marginTop:2}}>{d.room}</div>
                <div style={{fontSize:9,color:"#9CA3AF",marginTop:1}}>{d.type}</div>
                <div style={{fontSize:10,background:cfg.bg,color:cfg.color,borderRadius:6,padding:"2px 6px",marginTop:4,fontWeight:700}}>{total} pts</div>
                {issues>0&&<div style={{fontSize:9,color:"#DC2626",fontWeight:700,marginTop:2}}>⚠️ {issues} issue{issues>1?"s":""}</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
        {Object.entries(CAT_CFG).map(([cat,cfg])=>(
          <div key={cat} style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#6B7280"}}>
            <div style={{width:12,height:12,borderRadius:3,background:cfg.color}}/>
            {cat}
          </div>
        ))}
        <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#DC2626"}}>
          <div style={{width:12,height:12,borderRadius:3,background:"#EF4444"}}/>
          Has Issues
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// EQUIPMENT SEARCH (search by item)
// ─────────────────────────────────────────────────────────────
function EquipmentSearch({rooms,statuses,quantities,onSelect}){
  const allItems=useMemo(()=>{
    const s=new Set();
    rooms.forEach(r=>Object.keys(r.items).forEach(k=>s.add(k)));
    return [...s].sort();
  },[rooms]);

  const [selItem,setSelItem]=useState(allItems[0]||"");
  const [filterStatus,setFilterStatus]=useState("All");

  const results=useMemo(()=>{
    return rooms
      .filter(r=>{
        const q=quantities[r.room]||{};
        const s=statuses[r.room]||{};
        const hasItem=Object.keys(q).some(k=>k===selItem&&q[k]>0)||Object.keys(r.items).includes(selItem);
        if(!hasItem) return false;
        if(filterStatus!=="All"&&s[selItem]!==filterStatus) return false;
        return true;
      })
      .sort((a,b)=>a.room-b.room);
  },[rooms,selItem,filterStatus,quantities,statuses]);

  const total=results.reduce((acc,r)=>{
    const q=quantities[r.room]||{};
    return acc+(q[selItem]||0);
  },0);

  return (
    <div>
      <div style={{background:"#fff",borderRadius:14,padding:"16px 20px",marginBottom:18,border:"1px solid #E2E8F0",
        display:"flex",flexWrap:"wrap",gap:12,alignItems:"center"}}>
        <div style={{flex:"1 1 200px"}}>
          <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:6}}>EQUIPMENT TYPE</label>
          <select value={selItem} onChange={e=>setSelItem(e.target.value)}
            style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1.5px solid #E2E8F0",fontSize:14,background:"#fff",cursor:"pointer"}}>
            {allItems.map(i=><option key={i} value={i}>{itemIcon(i)} {i}</option>)}
          </select>
        </div>
        <div style={{flex:"1 1 160px"}}>
          <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:6}}>FILTER BY STATUS</label>
          <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)}
            style={{width:"100%",padding:"9px 12px",borderRadius:8,border:"1.5px solid #E2E8F0",fontSize:14,background:"#fff",cursor:"pointer"}}>
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map(s=><option key={s} value={s}>{STATUS_ICON[s]} {s}</option>)}
          </select>
        </div>
      </div>

      {/* Summary */}
      <div style={{display:"flex",gap:14,marginBottom:18,flexWrap:"wrap"}}>
        {[
          {label:"Rooms with this item",val:results.length,color:"#1D4ED8",bg:"#EFF6FF"},
          {label:"Total quantity",val:total,color:"#047857",bg:"#ECFDF5"},
          {label:"Working",val:results.filter(r=>(statuses[r.room]||{})[selItem]==="Working"||!(statuses[r.room]||{})[selItem]).length,color:"#16A34A",bg:"#DCFCE7"},
          {label:"Issues",val:results.filter(r=>{const v=(statuses[r.room]||{})[selItem];return v&&v!=="Working";}).length,color:"#DC2626",bg:"#FEE2E2"},
        ].map(k=>(
          <div key={k.label} style={{background:k.bg,borderRadius:12,padding:"12px 18px",flex:"1 1 120px"}}>
            <div style={{fontSize:24,fontWeight:900,color:k.color}}>{k.val}</div>
            <div style={{fontSize:11,color:"#6B7280",fontWeight:600,marginTop:2}}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{fontSize:13,color:"#6B7280",marginBottom:12,fontWeight:600}}>
        {itemIcon(selItem)} "{selItem}" found in {results.length} room{results.length!==1?"s":""}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
        {results.map(d=>{
          const cfg=CAT_CFG[d.category];
          const q=quantities[d.room]||{};
          const s=statuses[d.room]||{};
          const itemStatus=s[selItem]||"Working";
          const qty=q[selItem]||0;
          return (
            <div key={d.room} onClick={()=>onSelect(d)}
              style={{background:"#fff",border:`2px solid ${STATUS_BG[itemStatus]}`,borderRadius:12,
                padding:"12px 14px",cursor:"pointer",transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 6px 16px rgba(0,0,0,.12)";e.currentTarget.style.transform="translateY(-2px)";}}
              onMouseLeave={e=>{e.currentTarget.style.boxShadow="";e.currentTarget.style.transform="";}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                <div>
                  <div style={{fontSize:17,fontWeight:900,color:"#111827",fontFamily:"monospace"}}>{d.room}</div>
                  <div style={{fontSize:10,color:"#6B7280"}}>Floor {d.floor} · {d.type}</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{fontSize:22,fontWeight:900,color:cfg.color}}>{qty}</div>
                  <div style={{fontSize:9,color:"#9CA3AF"}}>qty</div>
                </div>
              </div>
              <div style={{marginTop:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <Badge label={d.category} color={cfg.color} bg={cfg.pill} size={10}/>
                <span style={{fontSize:11,background:STATUS_BG[itemStatus],color:STATUS_COLOR[itemStatus],
                  padding:"2px 8px",borderRadius:999,fontWeight:700}}>
                  {STATUS_ICON[itemStatus]} {itemStatus}
                </span>
              </div>
            </div>
          );
        })}
        {results.length===0&&(
          <div style={{gridColumn:"1/-1",textAlign:"center",padding:"50px",color:"#9CA3AF"}}>
            <div style={{fontSize:40}}>📦</div>
            <div style={{fontSize:16,fontWeight:700,marginTop:10}}>No rooms found with this equipment</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ISSUES / MAINTENANCE
// ─────────────────────────────────────────────────────────────
function Issues({rooms,statuses,notes,onSelect}){
  const issues=useMemo(()=>{
    const list=[];
    rooms.forEach(r=>{
      const s=statuses[r.room]||{};
      Object.entries(s).forEach(([item,status])=>{
        if(status!=="Working") list.push({room:r,item,status});
      });
    });
    return list.sort((a,b)=>a.room.room-b.room.room);
  },[rooms,statuses]);

  const byStatus={};
  issues.forEach(i=>{ byStatus[i.status]=(byStatus[i.status]||0)+1; });

  return (
    <div>
      {/* Status summary */}
      <div style={{display:"flex",gap:12,marginBottom:20,flexWrap:"wrap"}}>
        {STATUS_OPTIONS.filter(s=>s!=="Working").map(s=>(
          <div key={s} style={{background:STATUS_BG[s],borderRadius:12,padding:"12px 18px",flex:"1 1 120px",border:`1.5px solid ${STATUS_COLOR[s]}44`}}>
            <div style={{fontSize:24,fontWeight:900,color:STATUS_COLOR[s]}}>{byStatus[s]||0}</div>
            <div style={{fontSize:11,color:STATUS_COLOR[s],fontWeight:700,marginTop:2}}>{STATUS_ICON[s]} {s}</div>
          </div>
        ))}
        <div style={{background:"#F1F5F9",borderRadius:12,padding:"12px 18px",flex:"1 1 120px"}}>
          <div style={{fontSize:24,fontWeight:900,color:"#0F172A"}}>{issues.length}</div>
          <div style={{fontSize:11,color:"#6B7280",fontWeight:700,marginTop:2}}>Total Issues</div>
        </div>
      </div>

      {issues.length===0?(
        <div style={{textAlign:"center",padding:"60px 20px",color:"#6B7280",background:"#F0FDF4",borderRadius:16,border:"2px solid #BBF7D0"}}>
          <div style={{fontSize:48}}>✅</div>
          <div style={{fontSize:20,fontWeight:800,color:"#16A34A",marginTop:12}}>All equipment working!</div>
          <div style={{fontSize:14,marginTop:6}}>No issues reported across all rooms</div>
        </div>
      ):(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <div style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,marginBottom:4}}>ALL ACTIVE ISSUES</div>
          {issues.map(({room:d,item,status},i)=>{
            const cfg=CAT_CFG[d.category];
            return (
              <div key={i} onClick={()=>onSelect(d)}
                style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  background:"#fff",border:`1.5px solid ${STATUS_BG[status]}`,borderRadius:12,
                  padding:"12px 16px",cursor:"pointer",transition:"all .15s"}}
                onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 4px 12px rgba(0,0,0,.1)";}}
                onMouseLeave={e=>{e.currentTarget.style.boxShadow="";}}>
                <div style={{display:"flex",alignItems:"center",gap:12}}>
                  <div style={{background:STATUS_BG[status],borderRadius:10,padding:"8px 12px",textAlign:"center",minWidth:52}}>
                    <div style={{fontSize:16}}>{STATUS_ICON[status]}</div>
                  </div>
                  <div>
                    <div style={{fontWeight:800,color:"#111827",fontSize:15}}>Room {d.room}
                      <span style={{fontWeight:400,fontSize:12,color:"#9CA3AF",marginLeft:8}}>Floor {d.floor}</span>
                    </div>
                    <div style={{fontSize:13,color:"#6B7280",marginTop:1}}>{itemIcon(item)} {item}</div>
                  </div>
                </div>
                <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                  <span style={{fontSize:12,background:STATUS_BG[status],color:STATUS_COLOR[status],
                    padding:"3px 10px",borderRadius:999,fontWeight:700}}>{status}</span>
                  <Badge label={d.type} color={cfg.color} bg={cfg.pill} size={10}/>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// EXPORT / REPORT
// ─────────────────────────────────────────────────────────────
function Reports({rooms,statuses,quantities,notes}){
  const [exportCat,setExportCat]=useState("All");
  const [copied,setCopied]=useState(false);

  const filtered=exportCat==="All"?rooms:rooms.filter(r=>r.category===exportCat);

  const csvContent=useMemo(()=>{
    const rows=[["Room No","Floor","Type","Type Name","Category","Item","Quantity","Status"]];
    filtered.forEach(r=>{
      const q=quantities[r.room]||{};
      const s=statuses[r.room]||{};
      Object.entries(q).forEach(([item,qty])=>{
        rows.push([r.room,r.floor,r.type,r.typeName,r.category,item,qty,s[item]||"Working"]);
      });
    });
    return rows.map(r=>r.join(",")).join("\n");
  },[filtered,quantities,statuses]);

  const summary=useMemo(()=>{
    const byType={};
    filtered.forEach(r=>{
      if(!byType[r.type]) byType[r.type]={typeName:r.typeName,count:0,totals:{}};
      byType[r.type].count++;
      const q=quantities[r.room]||{};
      Object.entries(q).forEach(([k,v])=>{ byType[r.type].totals[k]=(byType[r.type].totals[k]||0)+v; });
    });
    return byType;
  },[filtered,quantities]);

  const totalPoints=filtered.reduce((acc,r)=>acc+Object.values(quantities[r.room]||{}).reduce((a,b)=>a+b,0),0);
  const totalIssues=filtered.reduce((acc,r)=>acc+Object.values(statuses[r.room]||{}).filter(v=>v!=="Working").length,0);

  const handleCopy=()=>{
    navigator.clipboard.writeText(csvContent).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);});
  };

  const handleDownload=()=>{
    const blob=new Blob([csvContent],{type:"text/csv"});
    const url=URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url; a.download=`apartment_inventory_${exportCat.toLowerCase()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {/* Controls */}
      <div style={{background:"#fff",borderRadius:14,padding:"16px 20px",marginBottom:20,
        border:"1px solid #E2E8F0",display:"flex",flexWrap:"wrap",gap:12,alignItems:"flex-end"}}>
        <div>
          <label style={{fontSize:11,fontWeight:700,color:"#9CA3AF",letterSpacing:1,display:"block",marginBottom:6}}>FILTER BY CATEGORY</label>
          <select value={exportCat} onChange={e=>setExportCat(e.target.value)}
            style={{padding:"9px 12px",borderRadius:8,border:"1.5px solid #E2E8F0",fontSize:14,background:"#fff",cursor:"pointer"}}>
            {["All","Apartments","Rooms","VIP"].map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button onClick={handleCopy} style={{padding:"10px 20px",borderRadius:10,border:"1.5px solid #E2E8F0",
          background:"#fff",fontWeight:700,fontSize:14,cursor:"pointer",color:"#374151"}}>
          {copied?"✅ Copied!":"📋 Copy CSV"}
        </button>
        <button onClick={handleDownload} style={{padding:"10px 20px",borderRadius:10,border:"none",
          background:"#1D4ED8",color:"#fff",fontWeight:700,fontSize:14,cursor:"pointer"}}>
          ⬇️ Download CSV
        </button>
      </div>

      {/* KPIs */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:24}}>
        {[
          {l:"Rooms in Report",v:filtered.length,c:"#1D4ED8",bg:"#EFF6FF"},
          {l:"Total Data Points",v:totalPoints,c:"#047857",bg:"#ECFDF5"},
          {l:"Active Issues",v:totalIssues,c:totalIssues>0?"#DC2626":"#16A34A",bg:totalIssues>0?"#FEE2E2":"#DCFCE7"},
          {l:"Room Types",v:Object.keys(summary).length,c:"#6D28D9",bg:"#EDE9FE"},
        ].map(k=>(
          <div key={k.l} style={{background:k.bg,borderRadius:12,padding:"14px 16px",border:`1.5px solid ${k.c}22`}}>
            <div style={{fontSize:26,fontWeight:900,color:k.c}}>{k.v.toLocaleString()}</div>
            <div style={{fontSize:11,color:"#6B7280",fontWeight:600,marginTop:2}}>{k.l}</div>
          </div>
        ))}
      </div>

      {/* Summary table */}
      <div style={{fontSize:12,fontWeight:700,color:"#9CA3AF",letterSpacing:1,marginBottom:10}}>SUMMARY BY ROOM TYPE</div>
      <div style={{background:"#fff",borderRadius:14,border:"1px solid #E2E8F0",overflow:"hidden"}}>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{background:"#F8FAFC",borderBottom:"2px solid #E2E8F0"}}>
                {["Room Type","Count","Bathroom Phone","TV","WiFi","IP Phone","Writing Desk","GRMS","Total Points"].map(h=>(
                  <th key={h} style={{padding:"10px 14px",textAlign:"left",fontWeight:700,color:"#374151",whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(summary).map(([type,d],i)=>{
                const q=d.totals;
                const phone=Object.entries(q).filter(([k])=>k.toLowerCase().includes("telephone")).reduce((a,[,v])=>a+v,0);
                const tv=Object.entries(q).filter(([k])=>k.toLowerCase().includes("tv")).reduce((a,[,v])=>a+v,0);
                const wifi=Object.entries(q).filter(([k])=>k.toLowerCase().includes("wifi")).reduce((a,[,v])=>a+v,0);
                const ip=Object.entries(q).filter(([k])=>k.toLowerCase().includes("ip")).reduce((a,[,v])=>a+v,0);
                const desk=q["Writing Desk"]||0;
                const grms=q["GRMS"]||0;
                const tot=Object.values(q).reduce((a,b)=>a+b,0);
                return (
                  <tr key={type} style={{borderBottom:"1px solid #F3F4F6",background:i%2===0?"#fff":"#FAFAFA"}}>
                    <td style={{padding:"10px 14px",fontWeight:700,color:"#111827"}}>{TYPE_META[type]?.icon} {d.typeName}</td>
                    <td style={{padding:"10px 14px",color:"#6B7280"}}>{d.count}</td>
                    <td style={{padding:"10px 14px"}}>{phone}</td>
                    <td style={{padding:"10px 14px"}}>{tv}</td>
                    <td style={{padding:"10px 14px"}}>{wifi}</td>
                    <td style={{padding:"10px 14px"}}>{ip}</td>
                    <td style={{padding:"10px 14px"}}>{desk}</td>
                    <td style={{padding:"10px 14px"}}>{grms}</td>
                    <td style={{padding:"10px 14px",fontWeight:800,color:"#1D4ED8"}}>{tot}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────
const TABS=[
  {id:"overview",label:"📊 Overview"},
  {id:"browse",label:"🔍 Browse Rooms"},
  {id:"floorplan",label:"🏢 Floor Plan"},
  {id:"equipment",label:"📦 Equipment Search"},
  {id:"issues",label:"⚠️ Issues"},
  {id:"reports",label:"📄 Reports"},
];

export default function App(){
  const {rooms,statuses,quantities,notes,updateStatus,updateQty,updateNote}=useAppState();
  const [activeTab,setActiveTab]=useState("overview");
  const [modal,setModal]=useState(null);

  const totalIssues=useMemo(()=>rooms.reduce((acc,r)=>
    acc+Object.values(statuses[r.room]||{}).filter(v=>v!=="Working").length,0),[rooms,statuses]);

  return (
    <div style={{minHeight:"100vh",background:"#F1F5F9",fontFamily:"system-ui,-apple-system,sans-serif"}}>
      {/* Top bar */}
      <div style={{background:"#0F172A",color:"#fff",padding:"16px 24px",
        display:"flex",justifyContent:"space-between",alignItems:"center",
        borderBottom:"3px solid #3B82F6"}}>
        <div>
          <div style={{fontSize:11,color:"#94A3B8",letterSpacing:2,marginBottom:2}}>H DUBAI</div>
          <div style={{fontSize:20,fontWeight:900,letterSpacing:-0.5}}>🏨 Apartment Data Inventory</div>
          <div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>
            {rooms.length} rooms · {Object.keys(TYPE_META).length} types · {totalIssues>0?`⚠️ ${totalIssues} issues`:"✅ All clear"}
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <div style={{background:"#1E293B",borderRadius:10,padding:"8px 14px",textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:900,color:"#3B82F6"}}>{rooms.length}</div>
            <div style={{fontSize:9,color:"#64748B",letterSpacing:.5}}>TOTAL ROOMS</div>
          </div>
          <div style={{background:"#1E293B",borderRadius:10,padding:"8px 14px",textAlign:"center"}}>
            <div style={{fontSize:18,fontWeight:900,color:totalIssues>0?"#EF4444":"#22C55E"}}>{totalIssues}</div>
            <div style={{fontSize:9,color:"#64748B",letterSpacing:.5}}>ISSUES</div>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div style={{background:"#fff",borderBottom:"1px solid #E2E8F0",overflowX:"auto"}}>
        <div style={{display:"flex",padding:"0 20px",minWidth:"max-content"}}>
          {TABS.map(t=>(
            <Tab key={t.id} label={t.label} active={activeTab===t.id} onClick={()=>setActiveTab(t.id)}
              count={t.id==="issues"&&totalIssues>0?totalIssues:null}/>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{maxWidth:1200,margin:"0 auto",padding:"24px 16px"}}>
        {activeTab==="overview"&&<Overview rooms={rooms} statuses={statuses} quantities={quantities}/>}
        {activeTab==="browse"&&<BrowseRooms rooms={rooms} statuses={statuses} quantities={quantities} notes={notes} onSelect={setModal}/>}
        {activeTab==="floorplan"&&<FloorPlan rooms={rooms} statuses={statuses} quantities={quantities} onSelect={setModal}/>}
        {activeTab==="equipment"&&<EquipmentSearch rooms={rooms} statuses={statuses} quantities={quantities} onSelect={setModal}/>}
        {activeTab==="issues"&&<Issues rooms={rooms} statuses={statuses} notes={notes} onSelect={setModal}/>}
        {activeTab==="reports"&&<Reports rooms={rooms} statuses={statuses} quantities={quantities} notes={notes}/>}
      </div>

      {/* Modal */}
      <RoomModal data={modal} statuses={statuses} quantities={quantities} notes={notes}
        updateStatus={updateStatus} updateQty={updateQty} updateNote={updateNote}
        onClose={()=>setModal(null)}/>
    </div>
  );
}