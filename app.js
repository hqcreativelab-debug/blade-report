/* Blade Report operational prototype. Public demo only — never use for real customer, workforce or safety records. */
(() => {
"use strict";
const KEY="blade-report-preview-v2";
const TODAY=()=>new Date().toISOString().slice(0,10);
const NOW=()=>new Date().toISOString();
const uid=(prefix)=>prefix+"-"+Math.random().toString(36).slice(2,7).toUpperCase();
const blank=v=>String(v??"");
const esc=s=>blank(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=n=>Number(n||0).toLocaleString("en-GB",{maximumFractionDigits:2});
const pounds=n=>"£"+Number(n||0).toLocaleString("en-GB",{minimumFractionDigits:2,maximumFractionDigits:2});
const date=s=>s?new Date(s).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"}):"Not set";
const hours=(start,end)=>Math.max(0,(new Date(end)-new Date(start))/3600000);
const seed=()=>({
  schema:2, company:"Northstar Blade Services (Demo)",activity:[],people:[
    {id:"P1",name:"Alex Morgan",role:"Technician",site:"Hajsberget",status:"Active",competencies:["GWO Blade Repair","IRATA L2"]},
    {id:"P2",name:"Jordan Reed",role:"Team Lead",site:"Hajsberget",status:"Active",competencies:["GWO Blade Repair","IRATA L3"]},
    {id:"P3",name:"Sarah Evans",role:"Stores Assistant",site:"Hajsberget",status:"Active",competencies:["Inventory Control"]},
    {id:"P4",name:"James Carter",role:"Store Manager",site:"Hajsberget",status:"Active",competencies:["Inventory Control"]},
    {id:"P5",name:"Sam Taylor",role:"Project Manager",site:"Hajsberget",status:"Active",competencies:["Project Management"]},
    {id:"P6",name:"Morgan Price",role:"Technician",site:"North Ridge",status:"Active",competencies:["GWO Blade Repair","IRATA L1"]}
  ],sites:[{id:"S1",name:"Hajsberget",country:"Sweden"},{id:"S2",name:"North Ridge",country:"United Kingdom"}],
  blades:[{id:"B1",serial:"SN-09812",turbine:"T-014",position:"B",model:"LM 69.3",site:"Hajsberget"},{id:"B2",serial:"SN-10220",turbine:"T-021",position:"A",model:"SGRE D3",site:"North Ridge"}],
  repairs:[
    {id:"R-1042",site:"Hajsberget",blade:"B1",type:"External laminate + core",assigned:"Jordan Reed",status:"In progress",description:"PS laminate and balsa replacement at 38.5 m radius",created:"2026-10-14",stages:[
      {id:"ST1",name:"Damage assessment",hours:6,glass:0,core:0,resin:0,notes:"Documented with photographs",qc:"Accepted"},
      {id:"ST2",name:"Grinding & preparation",hours:12,glass:0,core:1.1,resin:0,notes:"Removed affected core",qc:"Accepted"},
      {id:"ST3",name:"Lamination",hours:18,glass:38,core:1.1,resin:8.5,notes:"14 plies recorded. BX661 as specified in project materials list",qc:"Pending"}
    ]},
    {id:"R-1041",site:"North Ridge",blade:"B2",type:"External laminate",assigned:"Morgan Price",status:"Completed",description:"External laminate damage",created:"2026-10-11",stages:[
      {id:"ST4",name:"Damage assessment",hours:5,glass:0,core:0,resin:0,notes:"Damage identified",qc:"Accepted"},
      {id:"ST5",name:"Lamination",hours:31,glass:14,core:0.4,resin:5.2,notes:"8 plies installed",qc:"Accepted"}
    ]}
  ],
  tasks:[
    {id:"TASK-101",title:"Arrange winter tyres for BR-VAN-014",kind:"Fleet",site:"Hajsberget",owner:"James Carter",assignee:"Sarah Evans",requester:"Alex Morgan",status:"In progress",priority:"High",due:"2026-11-06",notes:"Confirm suitable tyres for location and vehicle type.",created:NOW()},
    {id:"TASK-102",title:"Supply BX661 fibreglass · 10 m²",kind:"Materials",site:"Hajsberget",owner:"James Carter",assignee:"James Carter",requester:"Alex Morgan",status:"New",priority:"High",due:"2026-11-04",notes:"Linked to R-1042. Verify approved material and batch.",created:NOW()},
    {id:"TASK-103",title:"Review curing photographs",kind:"Quality",site:"Hajsberget",owner:"Jordan Reed",assignee:"Jordan Reed",requester:"Jordan Reed",status:"Waiting",priority:"Normal",due:"2026-11-07",notes:"Stage evidence review",created:NOW()}
  ],
  requests:[{id:"REQ-101",type:"Material",item:"BX661 fibreglass",qty:10,unit:"m²",site:"Hajsberget",requestedBy:"Alex Morgan",status:"Requested",taskId:"TASK-102",notes:"For R-1042"}],
  downtime:[{id:"DOWN-101",site:"Hajsberget",repair:"R-1042",reason:"Power outage",note:"Platform power interruption",people:3,start:"2026-10-16T10:00:00.000Z",end:"2026-10-16T12:00:00.000Z",recordedBy:"Jordan Reed"}],
  fleet:[{id:"VEH-014",registration:"BR-VAN-014",type:"Site van",site:"Hajsberget",tyres:"Winter friction",checked:"2026-10-16",status:"Review required",issue:"Seasonal tyre verification requested"},{id:"VEH-009",registration:"BR-VAN-009",type:"Support van",site:"North Ridge",tyres:"All-season",checked:"2026-10-15",status:"Checked",issue:""}],
  fleetChecks:[],timesheets:[],materials:[{id:"MAT-01",name:"BX661 fibreglass",unit:"m²",stock:46,cost:17.5,approved:"Project-specific validation required"},{id:"MAT-02",name:"Ampreg 31 Resin",unit:"kg",stock:28,cost:24,approved:"Project-specific validation required"},{id:"MAT-03",name:"Balsa core 20 mm",unit:"m²",stock:12,cost:42,approved:"Project-specific validation required"}],
  competencies:[{id:"COMP-1",person:"Alex Morgan",name:"GWO Blade Repair",expires:"2027-06-01",verified:true},{id:"COMP-2",person:"Jordan Reed",name:"IRATA L3",expires:"2027-03-15",verified:true},{id:"COMP-3",person:"Morgan Price",name:"GWO Blade Repair",expires:"2026-12-01",verified:true}],
  inspections:[{id:"INS-101",blade:"B1",date:"2026-10-12",kind:"Baseline monitoring",finding:"LE observation 38 m from root",outcome:"Follow-up scheduled",next:"2026-11-15"}],
  weather:[{id:"WEA-1",site:"Hajsberget",date:"2026-10-16",wind:7.2,rh:68,ambient:9,surface:8,rain:"No",notes:"Manual example"}],
  savedReport:{period:"Week",site:"All sites",audience:"Client",detail:"Simple",notes:""},
  settings:{role:"Project Manager",site:"All sites"},notices:[]
});
let state;try{state=JSON.parse(localStorage.getItem(KEY)||"null");if(!state||state.schema!==2)state=seed()}catch(e){state=seed()}
const sections=[
 ["FIELD",[["dashboard","▦","Dashboard"],["repairs","▣","Repairs"],["passport","◈","Blade Passport"],["inspections","◎","Blade Monitor"],["technician","▤","Field App Preview"]]],
 ["OPERATIONS",[["tasks","☷","Blade Tasks"],["requests","▧","Requests & Procurement"],["materials","◫","Materials & Stock"],["time","◷","Timesheets"],["downtime","◴","Downtime"],["fleet","▰","Fleet & Vehicles"],["weather","☁","Weather"]]],
 ["MANAGEMENT",[["people","♙","People & Competencies"],["performance","▥","Performance Intelligence"],["outlook","▤","Blade Outlook"],["finance","◉","Costs & Finance"],["forms","☑","Templates & Settings"]]]
];
const titles=Object.fromEntries(sections.flatMap(s=>s[1].map(x=>[x[0],x[2]])));
let page=(location.hash||"#dashboard").slice(1);
if(!titles[page])page="dashboard";
let selected={site:"All sites",search:"",status:"All statuses",compare:"Teams"};
function persist(){try{localStorage.setItem(KEY,JSON.stringify(state))}catch(e){toast("Browser storage unavailable. Changes may not persist.")}}
function log(action,text){state.activity.unshift({date:NOW(),action,text});state.activity=state.activity.slice(0,120)}
function save(message){persist();render();if(message)toast(message)}
function toast(text){const el=document.createElement("div");el.className="toast";el.textContent=text;document.getElementById("toast-root").replaceChildren(el);setTimeout(()=>{if(el.isConnected)el.remove()},4200)}
function goto(p){if(!titles[p])return;page=p;location.hash=p;selected={site:"All sites",search:"",status:"All statuses",compare:"Teams"};closeModal();render();window.scrollTo(0,0);document.getElementById("sidebar").classList.remove("open")}
function nav(){document.getElementById("navigation").innerHTML=sections.map(([label,pages])=>'<div class="nav-label">'+label+'</div>'+pages.map(([id,icon,name])=>'<button class="nav-link '+(id===page?"active":"")+'" data-page="'+id+'"><span class="nav-ico">'+icon+'</span>'+name+'</button>').join("")).join("")}
function header(title,subtitle,buttons=""){return '<div class="page-head"><div><div class="eyebrow">BLADE REPORT / '+esc(state.settings.role)+'</div><h1>'+esc(title)+'</h1><p class="sub">'+subtitle+'</p></div><div class="actions">'+buttons+'</div></div>'}
function btn(label,act,extra="",cls=""){return '<button type="button" class="btn '+cls+'" data-action="'+act+'" '+extra+'>'+label+'</button>'}
function stat(name,n,tip){return '<div class="metric"><div class="label">'+esc(name)+'</div><div class="num">'+esc(n)+'</div><div class="hint">'+esc(tip)+'</div></div>'}
function badge(v){let s=blank(v).toLowerCase(),cl=/complete|checked|accept|approved|valid|resolved|active|available|pass/.test(s)?"good":/overdue|blocked|unsafe|expired|fail|rejected/.test(s)?"bad":/review|pending|due|new|progress|requested|waiting|low|risk/.test(s)?"warn":"gray";return '<span class="badge '+cl+'">'+esc(v)+'</span>'}
function row(title,desc,status,actions=""){return '<div class="line"><div><strong>'+esc(title)+'</strong><small>'+esc(desc)+'</small></div><div class="line-actions">'+(status?badge(status):"")+actions+'</div></div>'}
function card(title,content){return '<section class="card">'+(title?'<h3>'+title+'</h3>':"")+content+'</section>'}
function metrics(a){return '<div class="grid4">'+a.map(x=>stat(...x)).join("")+'</div>'}
function field(name,label,type="text",opt={}){let val=opt.value??"",attrs='name="'+name+'" '+(opt.required?"required ":"")+(opt.min!==undefined?'min="'+opt.min+'" ':"")+(opt.step?'step="'+opt.step+'" ':"");let inner;if(type==="select")inner='<select '+attrs+'>'+opt.choices.map(x=>'<option value="'+esc(x)+'" '+(x===val?"selected":"")+'>'+esc(x)+'</option>').join("")+'</select>';else if(type==="textarea")inner='<textarea '+attrs+' placeholder="'+esc(opt.placeholder||"")+'">'+esc(val)+'</textarea>';else inner='<input '+attrs+' type="'+type+'" value="'+esc(val)+'" placeholder="'+esc(opt.placeholder||"")+'">';return '<div class="field '+(opt.full?"full":"")+'"><label>'+esc(label)+'</label>'+inner+'</div>'}
function formModal(title,formId,body,submit="Save",notice=""){modal(title,'<form id="active-form" data-form="'+formId+'">'+(notice?'<div class="section-note">'+notice+'</div>':"")+'<div class="form-grid">'+body+'</div><footer><button class="btn secondary" type="button" data-action="close">Cancel</button><button class="btn" type="submit">'+submit+'</button></footer></form>')}
function modal(title,body){document.getElementById("modal-root").innerHTML='<div class="modal-backdrop" data-backdrop="true"><div class="modal" role="dialog" aria-modal="true" aria-label="'+esc(title)+'"><button class="modal-close" data-action="close" aria-label="Close dialog">×</button><h2>'+esc(title)+'</h2>'+body+'</div></div>'}
function closeModal(){document.getElementById("modal-root").replaceChildren()}
function who(){return state.settings.role==="Technician"?"Alex Morgan":state.settings.role==="Team Lead"?"Jordan Reed":state.settings.role==="Store Manager"?"James Carter":"Sam Taylor"}
function siteChoices(){return ["All sites",...state.sites.map(x=>x.name)]}
function peopleChoices(){return state.people.map(x=>x.name)}
function repairChoices(){return state.repairs.map(x=>x.id)}
function bladeName(id){const b=state.blades.find(x=>x.id===id);return b?b.turbine+" · Blade "+b.position+" · "+b.serial:id}
function taskForms(type,id){const t=state.tasks.find(x=>x.id===id),r=state.repairs.find(x=>x.id===id),v=state.fleet.find(x=>x.id===id);
switch(type){
case "task": formModal(t?"Update task":"Create task","task",
field("id","Task reference","hidden",{value:id||""})+
field("title","Task description","text",{value:t?.title,required:true,full:true})+
field("kind","Category","select",{value:t?.kind||"Office",choices:["Office","Materials","Fleet","Repair","Quality","Maintenance","Competencies","Project"]})+
field("site","Site","select",{value:t?.site||state.sites[0].name,choices:state.sites.map(x=>x.name)})+
field("assignee","Assigned to","select",{value:t?.assignee||who(),choices:peopleChoices()})+
field("owner","Responsible manager","select",{value:t?.owner||who(),choices:peopleChoices()})+
field("priority","Priority","select",{value:t?.priority||"Normal",choices:["Low","Normal","High","Critical"]})+
field("due","Due date","date",{value:t?.due||TODAY()})+
field("status","Status","select",{value:t?.status||"New",choices:["New","In progress","Waiting","Blocked","Completed","Cancelled"]})+
field("notes","Comments / context","textarea",{value:t?.notes,full:true}));break;
case "repair":formModal("Create repair","repair",
field("site","Site","select",{choices:state.sites.map(x=>x.name)})+
field("blade","Blade","select",{choices:state.blades.map(x=>x.id)})+
field("type","Repair type","select",{choices:["External laminate","Internal laminate","Core replacement","External laminate + core","Leading edge","Trailing edge","Coating","Other"]})+
field("assigned","Team Lead","select",{choices:peopleChoices()})+
field("description","Damage and repair location","textarea",{required:true,full:true}),"Create repair","This creates a demonstration repair. No OEM-authorised procedures or safety approvals are implied.");break;
case "stage":formModal("Add repair stage · "+id,"stage",
field("repairId","Repair ID","hidden",{value:id})+
field("name","Stage","select",{choices:["Damage assessment","Grinding & preparation","Core removal","Core installation","Resin mixing","Lamination","Curing","Coating & finish","Environmental checks","Quality inspection","Other"]})+
field("hours","Direct labour person-hours","number",{min:0,step:"0.25",value:0,required:true})+
field("glass","Total fibreglass ply area (m²)","number",{min:0,step:"0.01",value:0})+
field("core","Core area inserted/removed (m²)","number",{min:0,step:"0.01",value:0})+
field("resin","Resin used (kg)","number",{min:0,step:"0.01",value:0})+
field("qc","Review status","select",{choices:["Pending","Accepted","Review required"]})+
field("notes","Ply count, laminate specification, core details and notes","textarea",{full:true}),"Record stage","Measurement values are for demo calculations only. Use the actual authorised repair procedure in production.");break;
case "request":formModal("Request materials or equipment","request",
field("type","Request type","select",{choices:["Material","Vehicle","Equipment","Tools","Other"]})+
field("item","Item / description","text",{required:true,full:true})+
field("qty","Quantity","number",{min:0.01,step:"0.01",value:1})+
field("unit","Unit","select",{choices:["m²","kg","pcs","litres","sets","other"]})+
field("site","Site","select",{choices:state.sites.map(x=>x.name)})+
field("notes","Repair number, urgency or specifications","textarea",{full:true}),"Send request","Automatically creates a trackable store-manager task in this local demo.");break;
case "downtime":formModal("Record downtime","downtime",
field("site","Site","select",{choices:state.sites.map(x=>x.name)})+
field("repair","Related repair","select",{choices:["Unassigned",...repairChoices()]})+
field("reason","Reason","select",{choices:["Weather","Equipment failure","Power outage","Inspection due","Waiting for technicians","Materials delayed","Access unavailable","Client approval","Other"]})+
field("people","Number of affected technicians","number",{min:1,step:1,value:3,required:true})+
field("note","Description / cause","textarea",{full:true}),"Start downtime","Starts a timestamped event; select End downtime when it is resolved.");break;
case "fleet-check":formModal("Vehicle daily check","fleet-check",
field("vehicle","Vehicle","select",{value:id||state.fleet[0].id,choices:state.fleet.map(x=>x.id)})+
field("tyres","Tyre condition / seasonal suitability","select",{choices:["Pass","Needs review","Defect"]})+
field("lights","Lights and indicators","select",{choices:["Pass","Needs review","Defect"]})+
field("brakes","Brakes and dashboard warnings","select",{choices:["Pass","Needs review","Defect"]})+
field("fluids","Fluids, leaks and wipers","select",{choices:["Pass","Needs review","Defect"]})+
field("note","Comments","textarea",{full:true}),"Record inspection","A digital checklist is not a vehicle roadworthiness certification.");break;
case "vehicle-issue":formModal("Report vehicle defect","vehicle-issue",
field("vehicle","Vehicle","select",{value:id||state.fleet[0].id,choices:state.fleet.map(x=>x.id)})+
field("severity","Severity","select",{choices:["Minor","Review required","Potentially unsafe"]})+
field("description","Describe the issue","textarea",{required:true,full:true}),"Report defect","Potentially unsafe vehicles are flagged for authorised review and should not be used until cleared.");break;
case "material":formModal("Add catalogue material","material",
field("name","Material name / supplier reference","text",{required:true,full:true})+
field("unit","Unit","select",{choices:["m²","kg","pcs","litres","sets"]})+
field("stock","Starting stock","number",{min:0,step:"0.01",value:0})+
field("cost","Unit price GBP","number",{min:0,step:"0.01",value:0})+
field("approved","Approval status","select",{choices:["Unverified","Project-specific validation required","Verified for specified procedure"]}),"Add material");break;
case "material-issue":formModal("Record material consumption","material-issue",
field("material","Material","select",{value:id||state.materials[0].id,choices:state.materials.map(x=>x.id)})+
field("repair","Repair","select",{choices:repairChoices()})+
field("qty","Quantity consumed","number",{min:0.01,step:"0.01",required:true}),"Record consumption","Adjusts local demonstration stock and links usage to the repair. Approval must be verified externally.");break;
case "person":formModal("Add team member","person",field("name","Full name","text",{required:true})+field("role","Role","select",{choices:["Technician","Team Lead","Store Manager","Stores Assistant","Project Manager","Back Office"]})+field("site","Assigned site","select",{choices:state.sites.map(x=>x.name)}),"Add person");break;
case "competency":formModal("Record competency","competency",
field("person","Person","select",{choices:peopleChoices()})+
field("name","Competency","text",{required:true})+
field("expires","Expiry date","date",{required:true})+
field("verified","Verified","select",{choices:["No","Yes"]}),"Save competency","Demo only: a check box does not constitute an authoritative competency verification.");break;
case "inspection":formModal("New blade inspection / monitoring","inspection",
field("blade","Blade","select",{choices:state.blades.map(x=>x.id)})+
field("kind","Type","select",{choices:["Baseline monitoring","Follow-up inspection","Blade inspection","Post-repair inspection"]})+
field("finding","Finding / location","textarea",{full:true,required:true})+
field("outcome","Outcome","select",{choices:["Follow-up scheduled","Unchanged","Propagation observed","Engineering review required","Closed"]})+
field("next","Next inspection due","date",{value:TODAY()}),"Record inspection");break;
case "weather":formModal("Record site conditions","weather",
field("site","Site","select",{choices:state.sites.map(x=>x.name)})+
field("wind","Wind m/s","number",{min:0,step:"0.1",required:true})+
field("rh","Relative humidity %","number",{min:0,step:"0.1",required:true})+
field("ambient","Ambient temperature °C","number",{step:"0.1",required:true})+
field("surface","Blade surface temperature °C","number",{step:"0.1",required:true})+
field("rain","Rain","select",{choices:["No","Yes","Unknown"]})+
field("notes","Evidence source / notes","textarea",{full:true}),"Record conditions","Forecasts and manually entered readings do not authorise repair conditions.");break;
case "time-entry":formModal("Manual work or travel time","time-entry",
field("person","Technician","select",{value:who(),choices:peopleChoices()})+
field("site","Site","select",{choices:state.sites.map(x=>x.name)})+
field("date","Work date","date",{value:TODAY()})+
field("hours","Hours","number",{min:0.25,step:"0.25",required:true})+
field("kind","Activity","select",{choices:["Direct repair","Travel","Reporting","Standby","Other"]})+
field("notes","Notes","textarea",{full:true}),"Record time");break;
case "site":formModal("Add site","site",field("name","Site name","text",{required:true})+field("country","Country","text",{required:true}),"Add site");break;
case "blade":formModal("Add blade to passport","blade",field("serial","Serial number","text",{required:true})+field("turbine","Turbine number","text",{required:true})+field("position","Blade position","select",{choices:["A","B","C"]})+field("model","Blade model","text",{required:true})+field("site","Site","select",{choices:state.sites.map(x=>x.name)}),"Add blade");break;
}}
function val(fd,k){return blank(fd.get(k)).trim()}function num(fd,k){return Number(fd.get(k)||0)}
function submitForm(type,fd){const v=k=>val(fd,k),n=k=>num(fd,k);let msg="Saved to this browser";
switch(type){
case "task":{let old=state.tasks.find(x=>x.id===v("id"));let t={id:old?.id||uid("TASK"),title:v("title"),kind:v("kind"),site:v("site"),owner:v("owner"),assignee:v("assignee"),requester:old?.requester||who(),priority:v("priority"),due:v("due"),status:v("status"),notes:v("notes"),created:old?.created||NOW()};if(old)Object.assign(old,t);else state.tasks.unshift(t);log("Task",t.title+" → "+t.status+" · "+t.assignee);break}
case "repair":{let t={id:uid("R"),site:v("site"),blade:v("blade"),type:v("type"),assigned:v("assigned"),description:v("description"),status:"In progress",created:TODAY(),stages:[]};state.repairs.unshift(t);log("Repair","Created "+t.id);msg="Repair created";break}
case "stage":{let t=state.repairs.find(x=>x.id===v("repairId"));if(!t)throw Error("Repair not found");t.stages.push({id:uid("ST"),name:v("name"),hours:n("hours"),glass:n("glass"),core:n("core"),resin:n("resin"),qc:v("qc"),notes:v("notes")});log("Repair stage",t.id+": "+v("name"));break}
case "request":{let t={id:uid("REQ"),type:v("type"),item:v("item"),qty:n("qty"),unit:v("unit"),site:v("site"),requestedBy:who(),notes:v("notes"),status:"Requested"};let task={id:uid("TASK"),title:"Supply "+t.item+" · "+t.qty+" "+t.unit,kind:t.type,site:t.site,owner:"James Carter",assignee:"James Carter",requester:t.requestedBy,status:"New",priority:"Normal",due:TODAY(),notes:t.notes,created:NOW()};t.taskId=task.id;state.requests.unshift(t);state.tasks.unshift(task);log("Request","Created "+t.id+" and "+task.id);msg="Request and manager task created";break}
case "downtime":state.downtime.unshift({id:uid("DOWN"),site:v("site"),repair:v("repair"),reason:v("reason"),people:n("people"),note:v("note"),start:NOW(),end:null,recordedBy:who()});log("Downtime","Started "+v("reason"));break;
case "fleet-check":{let x={id:uid("CHECK"),vehicle:v("vehicle"),date:TODAY(),by:who(),tyres:v("tyres"),lights:v("lights"),brakes:v("brakes"),fluids:v("fluids"),note:v("note")};state.fleetChecks.unshift(x);let veh=state.fleet.find(y=>y.id===x.vehicle);if(veh){veh.checked=TODAY();veh.status=[x.tyres,x.lights,x.brakes,x.fluids].every(s=>s==="Pass")?"Checked":"Review required"}log("Vehicle check",x.vehicle+" "+veh?.status);break}
case "vehicle-issue":{let veh=state.fleet.find(y=>y.id===v("vehicle"));veh.issue=v("description");veh.status=v("severity")==="Potentially unsafe"?"Potentially unsafe":"Review required";state.tasks.unshift({id:uid("TASK"),title:"Vehicle "+veh.registration+": "+v("description"),kind:"Fleet",site:veh.site,owner:"James Carter",assignee:"James Carter",requester:who(),priority:veh.status==="Potentially unsafe"?"Critical":"High",status:"New",due:TODAY(),notes:"Fleet defect requires authorised resolution. "+v("severity"),created:NOW()});log("Vehicle defect",veh.registration+": "+v("description"));msg="Fleet task created";break}
case "material":state.materials.unshift({id:uid("MAT"),name:v("name"),unit:v("unit"),stock:n("stock"),cost:n("cost"),approved:v("approved")});log("Material",v("name")+" added");break;
case "material-issue":{const mat=state.materials.find(x=>x.id===v("material"));if(!mat)throw Error("Material not found");if(n("qty")>mat.stock)throw Error("Not enough demonstration stock");mat.stock=+(mat.stock-n("qty")).toFixed(2);const job=state.repairs.find(x=>x.id===v("repair"));job.issues=job.issues||[];job.issues.push({material:mat.name,qty:n("qty"),unit:mat.unit,cost:+(n("qty")*mat.cost).toFixed(2),date:TODAY()});log("Material issued",mat.name+" · "+n("qty")+" "+mat.unit+" for "+job.id);break}
case "person":state.people.push({id:uid("P"),name:v("name"),role:v("role"),site:v("site"),status:"Active",competencies:[]});log("Team",v("name")+" added");break;
case "competency":state.competencies.unshift({id:uid("COMP"),person:v("person"),name:v("name"),expires:v("expires"),verified:v("verified")==="Yes"});log("Competency",v("name")+" for "+v("person"));break;
case "inspection":state.inspections.unshift({id:uid("INS"),blade:v("blade"),date:TODAY(),kind:v("kind"),finding:v("finding"),outcome:v("outcome"),next:v("next")});log("Blade monitor",v("kind")+" recorded");break;
case "weather":state.weather.unshift({id:uid("WEA"),site:v("site"),date:TODAY(),wind:n("wind"),rh:n("rh"),ambient:n("ambient"),surface:n("surface"),rain:v("rain"),notes:v("notes")});log("Weather","Site conditions "+v("site"));break;
case "time-entry":state.timesheets.unshift({id:uid("TIME"),person:v("person"),site:v("site"),date:v("date"),hours:n("hours"),kind:v("kind"),notes:v("notes"),status:"Draft"});log("Timesheet",v("person")+" "+n("hours")+"h");break;
case "site":state.sites.push({id:uid("S"),name:v("name"),country:v("country")});log("Site",v("name")+" added");break;
case "blade":state.blades.push({id:uid("B"),serial:v("serial"),turbine:v("turbine"),position:v("position"),model:v("model"),site:v("site")});log("Blade",v("serial")+" added");break;
default:throw Error("Unknown form: "+type)
}closeModal();save(msg)}
function act(action,id,el){switch(action){
case "close":closeModal();return;
case "new-task":return taskForms("task");
case "edit-task":return taskForms("task",id);
case "new-repair":return taskForms("repair");
case "add-stage":return taskForms("stage",id);
case "new-request":return taskForms("request");
case "new-downtime":return taskForms("downtime");
case "fleet-check":return taskForms("fleet-check",id);
case "vehicle-issue":return taskForms("vehicle-issue",id);
case "new-material":return taskForms("material");
case "material-issue":return taskForms("material-issue",id);
case "new-person":return taskForms("person");
case "new-competency":return taskForms("competency");
case "new-inspection":return taskForms("inspection");
case "new-weather":return taskForms("weather");
case "time-entry":return taskForms("time-entry");
case "new-blade":return taskForms("blade");
case "new-site":return taskForms("site");
case "open-repair":return showRepair(id);
case "open-blade":return showBlade(id);
case "open-task":return showTask(id);
case "finish-down":{let d=state.downtime.find(x=>x.id===id);if(!d||d.end)return;d.end=NOW();log("Downtime","Ended "+d.id);save("Downtime ended");return}
case "repair-complete":{let r=state.repairs.find(x=>x.id===id);if(!r)return;r.status="Completed";log("Repair","Marked "+id+" complete (demo only)");save("Repair marked complete in demo");return}
case "check-in":{let x=state.timesheets.find(t=>t.person===who()&&t.date===TODAY()&&t.kind==="Shift"&&!t.end);if(x)return toast("Already checked in");state.timesheets.unshift({id:uid("TIME"),person:who(),site:state.sites[0].name,date:TODAY(),kind:"Shift",start:NOW(),end:null,hours:0,status:"Draft"});log("Shift",who()+" checked in");save("Checked in — local demo");return}
case "check-out":{let x=state.timesheets.find(t=>t.person===who()&&t.kind==="Shift"&&!t.end);if(!x)return toast("No active shift");x.end=NOW();x.hours=+hours(x.start,x.end).toFixed(2);log("Shift",who()+" checked out");save("Shift ended — local demo");return}
case "approve-time":{let x=state.timesheets.find(t=>t.id===id);if(x){x.status="Reviewed";log("Timesheet","Reviewed "+id);save("Time entry reviewed (demo only)")}return}
case "new-template":return toast("Template builder requires server-backed versioning. Specification is in project docs.");
case "reset":{if(!confirm("Reset all local demo changes to fictional sample data?"))return;state=seed();persist();render();toast("Demo reset");return}
case "export":return exportJSON();
case "export-csv":return exportCSV(id||"tasks");
case "outlook-print":return window.print();
case "outlook-copy":return copyOutlook();
case "outlook-notes":return saveOutlook(el);
case "notifications":return showNotifications();
case "assign-suggest":return showSuggestion();
case "mark-complete":{let t=state.tasks.find(x=>x.id===id);if(t){t.status="Completed";log("Task",id+" completed by "+who());save("Task completed")}return}
case "open-section":return goto(id);
case "import":return document.getElementById("import-file")?.click();
default:return toast("This module is planned for the production backend.");
}}
function showTask(id){const t=state.tasks.find(x=>x.id===id);if(!t)return;modal(t.title,'<p>Task '+esc(t.id)+' · '+esc(t.site)+' · '+esc(t.kind)+'</p>'+card("Ownership",row("Responsible",t.owner)+row("Assigned",t.assignee)+row("Requested by",t.requester)+row("Due",date(t.due),t.status))+'<p>'+esc(t.notes)+'</p><footer>'+btn("Edit / delegate","edit-task",'data-id="'+esc(id)+'"')+btn("Mark completed","mark-complete",'data-id="'+esc(id)+'"',"secondary")+'</footer>')}
function showRepair(id){const r=state.repairs.find(x=>x.id===id);if(!r)return;let steps=r.stages.map(x=>row(x.name,fmt(x.hours)+" labour hours · "+fmt(x.glass)+" m² fibreglass · "+fmt(x.core)+" m² core · "+fmt(x.resin)+" kg resin · "+x.notes,x.qc)).join("");modal(r.id+" · "+r.type,'<p>'+esc(r.site)+" · "+esc(bladeName(r.blade))+' · '+esc(r.description)+'</p>'+card("Stages",steps||'<p>No stages yet.</p>')+card("Material issues",(r.issues||[]).map(x=>row(x.material,fmt(x.qty)+" "+x.unit+" · "+pounds(x.cost),"Recorded")).join("")||'<p>No linked usage records yet.</p>')+'<footer>'+btn("+ Stage","add-stage",'data-id="'+esc(id)+'"')+btn("Mark complete","repair-complete",'data-id="'+esc(id)+'"',"secondary")+'</footer>')}
function showBlade(id){const b=state.blades.find(x=>x.id===id);if(!b)return;modal("Blade "+b.serial,'<p>'+esc(b.site)+" · "+esc(b.turbine)+" · "+esc(b.position)+" · "+esc(b.model)+'</p>'+card("Repair history",state.repairs.filter(r=>r.blade===id).map(r=>row(r.id,r.type+" · "+date(r.created),r.status)).join("")||'<p>No repairs.</p>')+card("Monitoring",state.inspections.filter(i=>i.blade===id).map(i=>row(i.kind,i.finding,i.outcome)).join("")||'<p>No inspections.</p>'))}
function showNotifications(){let pending=state.tasks.filter(t=>t.status!=="Completed"&&t.status!=="Cancelled"),exp=state.competencies.filter(x=>new Date(x.expires)<new Date(Date.now()+180*86400000));modal("Task notifications",'<p>Notifications are derived from local task records, not pushed to other people.</p>'+pending.slice(0,10).map(t=>row(t.title,t.assignee+" · "+t.site,t.status)).join("")+exp.map(c=>row("Competency renewal",c.person+" · "+c.name,date(c.expires))).join(""))}
function showSuggestion(){let counts=Object.fromEntries(state.people.map(p=>[p.name,state.tasks.filter(t=>t.assignee===p.name&&!["Completed","Cancelled"].includes(t.status)).length]));let rows=Object.entries(counts).sort((a,b)=>b[1]-a[1]);modal("Workload recommendation",'<p>Based only on open task counts, not work hours or eligibility. Actual reassignment requires approval.</p>'+rows.map(x=>row(x[0],state.people.find(p=>p.name===x[0])?.role||"",x[1]+" open")).join("")+'<div class="section-note">Only suggest moving routine work to people with verified permissions, matching office, available capacity and manager approval. No automated reassignment in this demo.</div>')}
function exportJSON(){const a=document.createElement("a"),url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:"application/json"}));a.href=url;a.download="blade-report-demo-backup.json";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast("Local demo JSON exported")}
function exportCSV(type){let data=state[type]||[];if(!data.length)return toast("Nothing to export");let keys=Object.keys(data[0]).filter(x=>typeof data[0][x]!=="object");let csv=[keys.join(","),...data.map(x=>keys.map(k=>'"'+blank(x[k]).replace(/"/g,'""')+'"').join(","))].join("\r\n");let url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"})),a=document.createElement("a");a.href=url;a.download="blade-report-"+type+".csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast("CSV exported")}
function outlookText(){let p=state.savedReport,ss=p.site,repairs=state.repairs.filter(x=>ss==="All sites"||x.site===ss),downs=state.downtime.filter(x=>ss==="All sites"||x.site===ss),open=state.tasks.filter(x=>(ss==="All sites"||x.site===ss)&&!["Completed","Cancelled"].includes(x.status));return "BLADE OUTLOOK — "+p.period.toUpperCase()+" REPORT\nAudience: "+p.audience+" | Detail: "+p.detail+" | Site: "+ss+"\n\nRepair summary: "+repairs.length+" recorded repairs, "+repairs.filter(x=>x.status==="Completed").length+" completed.\nDowntime events: "+downs.length+"; recorded affected person-hours "+fmt(downs.reduce((n,d)=>n+(d.end?hours(d.start,d.end)*d.people:0),0))+".\nOutstanding actions: "+open.length+".\n\nManagement notes: "+(p.notes||"No additional notes")+".\n\nDEMONSTRATION REPORT ONLY. These data are fictional and not verified as client evidence."}
async function copyOutlook(){try{await navigator.clipboard.writeText(outlookText());toast("Example report copied")}catch(e){modal("Copy report",'<pre>'+esc(outlookText())+'</pre>')}}
function saveOutlook(el){state.savedReport={period:document.getElementById("report-period")?.value||"Week",site:document.getElementById("report-site")?.value||"All sites",audience:document.getElementById("report-audience")?.value||"Client",detail:document.getElementById("report-detail")?.value||"Simple",notes:document.getElementById("report-notes")?.value||""};save("Outlook preferences saved locally")}
function render(){nav();document.getElementById("role-switch").value=state.settings.role;document.getElementById("breadcrumb-page").textContent=titles[page];document.getElementById("notifications-count").textContent=state.tasks.filter(x=>x.status==="New").length;let result=window.BR.views?.[page]?.();document.getElementById("app").innerHTML=result||header("Loading","Preparing your module...")}
document.addEventListener("click",e=>{if(e.target.matches("[data-backdrop]")){closeModal();return}const p=e.target.closest("[data-page]");if(p){goto(p.dataset.page);return}const a=e.target.closest("[data-action]");if(a)act(a.dataset.action,a.dataset.id,a)});
document.addEventListener("submit",e=>{const f=e.target.closest("[data-form]");if(!f)return;e.preventDefault();try{submitForm(f.dataset.form,new FormData(f))}catch(error){toast(error.message||"Could not save")}});
document.addEventListener("change",e=>{const n=e.target;if(n.id==="role-switch"){state.settings.role=n.value;save("Role preview changed — not a real access control")}if(n.dataset.taskStatus){let t=state.tasks.find(x=>x.id===n.dataset.taskStatus);if(t){t.status=n.value;log("Task",t.id+" → "+n.value);save("Task updated")}}if(n.dataset.requestStatus){let r=state.requests.find(x=>x.id===n.dataset.requestStatus);if(r){r.status=n.value;log("Request",r.id+" → "+n.value);save("Request updated")}}if(n.dataset.filter){selected[n.dataset.filter]=n.value;render()}if(n.dataset.repairStatus){let r=state.repairs.find(x=>x.id===n.dataset.repairStatus);if(r){r.status=n.value;save("Repair status updated (demo)")}}if(n.id==="import-file"){const file=n.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{try{let s=JSON.parse(reader.result);if(s.schema!==2||!Array.isArray(s.repairs)||!Array.isArray(s.tasks)||!Array.isArray(s.people))throw Error("Invalid demo backup");if(!confirm("Replace your local demo with imported data?"))return;state=s;persist();render();toast("Demo backup imported")}catch(err){toast(err.message)}};reader.readAsText(file)}});
document.addEventListener("input",e=>{let n=e.target;if(n.dataset.search){selected.search=n.value;const pos=n.selectionStart;render();let next=document.querySelector("[data-search]");next?.focus();next?.setSelectionRange(pos,pos)}});
document.getElementById("menu-button").onclick=()=>document.getElementById("sidebar").classList.toggle("open");
document.getElementById("reset-demo").onclick=()=>act("reset");
document.getElementById("notifications-button").onclick=()=>act("notifications");
window.addEventListener("hashchange",()=>{const p=location.hash.slice(1);if(titles[p]&&p!==page){page=p;render()}});
window.BR={state:()=>state,selected:()=>selected,sections,titles,esc,fmt,pounds,date,hours,uid,TODAY,NOW,header,btn,stat,badge,row,card,metrics,field,modal,closeModal,showRepair,showTask,showBlade,outlookText,goto,act,save,log,who,bladeName,siteChoices,peopleChoices,views:{}};
document.addEventListener("DOMContentLoaded",render);
})();