/* Screen renderers for Blade Report's browser-only operational foundation. */
(() => {
"use strict";
const B=window.BR;
const S=()=>B.state(),F=()=>B.selected();
const e=B.esc,fmt=B.fmt,money=B.pounds,btn=B.btn,card=B.card,head=B.header,metric=B.metrics,tag=B.badge,row=B.row,date=B.date;
const nonClosed=t=>!["Completed","Cancelled"].includes(t.status);
const select=(options,current="",attrs="")=>'<select '+attrs+'>'+options.map(x=>'<option value="'+e(x)+'" '+(x===current?"selected":"")+'>'+e(x)+'</option>').join("")+'</select>';
const act=(action,id,label,cls="secondary")=>btn(label,action,id?'data-id="'+e(id)+'"':"",cls);
const filters=(arr,keys=[])=>arr.filter(x=>(F().site==="All sites"||x.site===F().site)&&(!F().search||keys.some(k=>String(x[k]||"").toLowerCase().includes(F().search.toLowerCase())))&&(F().status==="All statuses"||x.status===F().status));
const filterBar=(opts={})=>'<div class="filters">'+select(["All sites",...S().sites.map(x=>x.name)],F().site,'data-filter="site" aria-label="Filter by site"')+'<input data-search="true" placeholder="Search '+(opts.search||"records")+'..." value="'+e(F().search)+'" aria-label="Search">'+(opts.status?select(["All statuses",...opts.status],F().status,'data-filter="status" aria-label="Filter by status"'):"")+'</div>';
const table=(heads,rows)=>'<div class="table-wrap"><table><thead><tr>'+heads.map(x=>'<th>'+x+'</th>').join("")+'</tr></thead><tbody>'+(rows.length?rows.map(r=>'<tr>'+r.map(x=>'<td>'+x+'</td>').join("")+'</tr>').join(""):'<tr><td colspan="'+heads.length+'" class="empty">No matching records found.</td></tr>')+'</tbody></table></div>';
const mini=(title,p,route)=>'<button class="tile" data-page="'+route+'"><span class="tile-icon">↗</span><strong>'+title+'</strong><p>'+p+'</p></button>';
const jobHours=r=>r.stages.reduce((n,x)=>n+Number(x.hours||0),0);
const downtimeHours=d=>d.end?B.hours(d.start,d.end):B.hours(d.start,B.NOW());
const personHours=d=>downtimeHours(d)*d.people;
const approved=c=>new Date(c.expires)>=new Date(Date.now()+180*86400000)?"Valid":new Date(c.expires)>=new Date()?"Expiring":"Expired";
const activity=()=>S().activity.length?S().activity.slice(0,6).map(a=>'<div class="activity"><span class="bullet"></span><div><strong>'+e(a.text)+'</strong><p>'+e(a.action)+' · '+date(a.date)+'</p></div></div>').join(""):'<div class="empty">Actions will appear here once you make changes.</div>';
function dashboard(){
const s=S(),active=s.repairs.filter(r=>r.status!=="Completed").length,waiting=s.tasks.filter(nonClosed),crew=s.people.filter(p=>p.role==="Technician").length,openDown=s.downtime.filter(d=>!d.end).length;
const attention=s.tasks.filter(t=>nonClosed(t)).slice(0,4);
return head("Operations overview","One calm view of repair progress, actions and what needs attention.",act("new-repair",null,"+ New repair",""))+
metric([["Active repairs",active,"Across all sites"],["Tasks requiring action",waiting.length,"Prioritised queue"],["Field technicians",crew,"Recorded profiles"],["Active downtime",openDown,"Currently running events"]])+
'<div class="split"><div>'+card("Active repair progress",s.repairs.filter(x=>x.status!=="Completed").map(r=>row(r.id+" · "+r.type,r.site+" · "+B.bladeName(r.blade)+" · "+r.stages.length+" stages",r.status,act("open-repair",r.id,"View"))).join("")||'<div class="empty">No active repairs.</div>')+
card("Recent activity",activity())+'</div><div>'+card("Needs attention",attention.map(t=>row(t.title,t.assignee+" · "+t.site,t.status,act("open-task",t.id,"Open"))).join("")+'<div style="margin-top:12px">'+act("open-section","tasks","All tasks →")+'</div>')+
card("Simple actions",'<div class="stack">'+act("new-downtime",null,"+ Start downtime")+act("new-request",null,"+ Request materials")+act("fleet-check",null,"+ Daily vehicle check")+act("outlook-copy",null,"Copy client outlook")+'</div>')+'</div></div>'+
card("Explore Blade Report",'<div class="grid3">'+mini("Repair reports","Stages, laminate, core and evidence","repairs")+mini("Blade Tasks","Assignments, delegation and reminders","tasks")+mini("Blade Outlook","Clear management and client summaries","outlook")+mini("Performance","Complexity, quality and downtime","performance")+mini("Fleet & vehicles","Vehicle checks and seasonal tyres","fleet")+mini("Blade Monitor","Inspections and lifetime follow-ups","inspections")+'</div>');
}
function repairs(){
const s=S(),list=filters(s.repairs,["id","type","assigned","description"]);
return head("Repair reports","Every repair stays linked to the correct blade, project, team, stages and material history.",act("new-repair",null,"+ Create repair",""))+
metric([["Repair records",list.length,"Current filters"],["Open repairs",list.filter(x=>x.status!=="Completed").length,"Awaiting completion"],["Recorded labour",fmt(list.reduce((n,x)=>n+jobHours(x),0))+"h","Direct person-hours"],["Stage records",list.reduce((n,x)=>n+x.stages.length,0),"Capturable measurements"]])+
filterBar({search:"repairs",status:["In progress","Completed","On hold"]})+
card("Repair register",table(["Repair","Blade / site","Assigned","Labour","Status",""],list.map(r=>['<strong>'+e(r.id)+'</strong><div class="tiny muted">'+e(r.type)+'</div>',e(B.bladeName(r.blade))+'<div class="tiny muted">'+e(r.site)+'</div>',e(r.assigned),fmt(jobHours(r))+"h",select(["In progress","On hold","Completed"],r.status,'data-repair-status="'+e(r.id)+'" aria-label="Change repair status"'),act("open-repair",r.id,"Open")])))+
card("Step-by-step field reporting",'<div class="grid3">'+[["Damage & location","Site, radius, PS/SS, LE/TE and original photos"],["Grinding & preparation","Measurements, removed layers and core"],["Materials & lamination","Ply specifications, area, resin, batch and stage repeats"],["Curing & environment","Ambient/surface temperatures, humidity and dew point"],["Inspection & completion","QC outcomes, approvals and repair history"],["Evidence integrity","Production: file hashes, EXIF, audit trail and offline sync"]].map(x=>'<div class="tile"><strong>'+x[0]+'</strong><p>'+x[1]+'</p></div>').join("")+'</div><div class="section-note">You can add stages and measurements now. Production-grade photo storage, sign-offs, approved OEM procedure enforcement and offline syncing require the private backend.</div>');
}
function passport(){
const s=S(),list=s.blades.filter(x=>(F().site==="All sites"||x.site===F().site)&&(!F().search||(x.serial+x.turbine+x.model).toLowerCase().includes(F().search.toLowerCase())));
return head("Blade Passport","Searchable blade histories connecting serial numbers, repairs and progressive monitoring.",act("new-blade",null,"+ Add blade",""))+
filterBar({search:"serial or turbine"})+card("Blade register",table(["Blade","Site","Model","Repair history","Monitoring",""],list.map(b=>[e(b.turbine)+" · Blade "+e(b.position)+'<div class="tiny muted">'+e(b.serial)+'</div>',e(b.site),e(b.model),S().repairs.filter(r=>r.blade===b.id).length,S().inspections.filter(i=>i.blade===b.id).length,act("open-blade",b.id,"History")]))+
'<div class="section-note">Production passports will support location on pressure/suction side, leading/trailing edge, root/tip radius, chord and internal webs, with project-specific blade templates.</div>');
}
function inspections(){
const s=S(),list=s.inspections.filter(x=>F().site==="All sites"||s.blades.find(b=>b.id===x.blade)?.site===F().site);
return head("Blade Monitor","Baseline inspections and follow-up observations linked to the lifetime of a blade.",act("new-inspection",null,"+ Record inspection",""))+filterBar()+
card("Monitoring records",table(["Inspection","Blade","Date","Finding","Outcome","Next due"],list.map(i=>[e(i.kind),e(B.bladeName(i.blade)),date(i.date),e(i.finding),tag(i.outcome),date(i.next)])))+
card("Monitoring workflow",'<div class="grid3">'+mini("Baseline observation","Initial finding, measurements and location","passport")+mini("Follow-up visits","Compare new records with the previous history","inspections")+mini("Engineering review","Flag propagation or unclear outcomes","tasks")+'</div>');
}
function technician(){
const s=S(),open=s.tasks.filter(x=>x.assignee==="Alex Morgan"&&nonClosed(x)),r=s.repairs[0],active=s.timesheets.some(x=>x.person===B.who()&&x.kind==="Shift"&&!x.end);
return head("Technician mobile experience","Simple controls for real work in the field; office complexity stays in the office.")+
'<div class="grid2"><div class="phone"><div class="eyebrow">FIELD APP / PREVIEW</div><h3>Good morning, Alex</h3><p class="sub">Hajsberget · '+date(B.TODAY())+'</p>'+
card("Current repair",'<strong>'+e(r.id)+' · '+e(r.type)+'</strong><p class="sub">'+e(B.bladeName(r.blade))+'</p><div style="margin-top:12px">'+act("open-repair",r.id,"Continue repair","")+'</div>')+
card("Needs your attention",open.length?open.map(t=>row(t.title,"Due "+date(t.due),t.status)).join(""):'<p class="sub">No immediate actions.</p>')+
card("Quick actions",'<div class="stack">'+act(active?"check-out":"check-in",null,active?"End shift":"Start shift","")+act("new-request",null,"Request material")+act("new-weather",null,"Weather check")+act("fleet-check",null,"Vehicle check")+'</div>')+
'</div><div>'+card("Field-first principles",'<p class="sub">Technicians only need repair stages, timestamps, evidence, weather readings, requests and a focused personal task list.</p><div class="section-note">This preview simulates the technician role. Production login and organisation-level permissions will be enforced by the backend, not by this dropdown.</div>')+
card("Field features planned",'<div class="stack">'+["Offline encrypted work queue and resumable sync","Original images with hashes and camera metadata checks","Repeatable stages and conditional OEM/client templates","Equipment check-in and LOTO event recording","Digital sign-off and qualified QC approval"].map(x=>'<div class="check-line">○ '+x+'</div>').join("")+'</div>')+'</div></div>';
}
function tasks(){
const s=S(),list=filters(s.tasks,["id","title","assignee","requester","kind"]),open=list.filter(nonClosed);
const my=s.tasks.filter(t=>t.assignee===B.who()&&nonClosed(t)).length;
return head("Blade Tasks","A focused, accountable action queue. Delegation keeps ownership and project oversight intact.",act("new-task",null,"+ New task",""))+
metric([["Open tasks",open.length,"Within selected filters"],["My actions",my,B.who()],["Overdue",open.filter(x=>x.due<B.TODAY()).length,"Needs review"],["Completed",list.filter(t=>t.status==="Completed").length,"Archived from active queue"]])+
filterBar({search:"tasks",status:["New","In progress","Waiting","Blocked","Completed","Cancelled"]})+
card("Task centre",table(["Task","Owner / assignee","Due","Priority","Status",""],list.map(t=>['<strong>'+e(t.title)+'</strong><div class="tiny muted">'+e(t.kind)+" · "+e(t.site)+" · "+e(t.id)+'</div>',e(t.assignee)+'<div class="tiny muted">Owner: '+e(t.owner)+'</div>',date(t.due),tag(t.priority),select(["New","In progress","Waiting","Blocked","Completed","Cancelled"],t.status,'data-task-status="'+e(t.id)+'" aria-label="Task status"'),act("open-task",t.id,"Details")])))+
'<div class="grid2">'+card("Office workload balancing",'<p class="sub">We can identify apparent imbalances, but AI suggestions should account for effort, role, site and availability. Reassignments remain manager-approved.</p><div style="margin-top:15px">'+act("assign-suggest",null,"Review task distribution")+'</div>')+
card("Reducing notification overload",'<p class="sub">Only actionable items appear as priorities. Waiting tasks remain linked without continuously notifying technicians. Updates can be grouped by request.</p>')+'</div>';
}
function requests(){
const s=S(),list=filters(s.requests,["item","type","requestedBy","notes"]);
return head("Requests & procurement","Technician requests automatically create a task for the responsible store manager.",act("new-request",null,"+ New request",""))+
metric([["Requests",list.length,"Linked to tasks"],["Pending",list.filter(r=>r.status!=="Completed").length,"Open requests"],["Types",new Set(list.map(r=>r.type)).size,"Materials, fleet, equipment"],["Awaiting receipt",list.filter(r=>r.status==="Dispatched").length,"Confirmation needed"]])+
filterBar({search:"requests"})+
card("Request register",table(["Request","Quantity","Site","Requester","Status","Linked task"],list.map(r=>['<strong>'+e(r.item)+'</strong><div class="tiny muted">'+e(r.type)+" · "+e(r.id)+'</div>',fmt(r.qty)+" "+e(r.unit),e(r.site),e(r.requestedBy),select(["Requested","Approved","Ordering","Partially fulfilled","Dispatched","Completed","Cancelled"],r.status,'data-request-status="'+e(r.id)+'" aria-label="Request status"'),r.taskId?act("open-task",r.taskId,"View task"):"—"])))+
'<div class="section-note">Production will distinguish requested, purchased, delivered, issued and consumed quantities, with optional receipt confirmation and approval routing.</div>';
}
function materials(){
const s=S(),list=s.materials.filter(m=>!F().search||m.name.toLowerCase().includes(F().search.toLowerCase()));
return head("Materials & stock","Track laminate, resin, core, quantities, costs and repair-specific consumption.",act("new-material",null,"+ Add material","")+act("material-issue",null,"Record usage"))+
metric([["Catalogue materials",s.materials.length,"Editable demo catalogue"],["Inventory value",money(s.materials.reduce((n,m)=>n+m.stock*m.cost,0)),"Cost-based estimate"],["Recorded usage",s.repairs.reduce((n,r)=>n+(r.issues||[]).length,0),"Linked to repair records"],["Requested items",s.requests.filter(r=>r.type==="Material").length,"Procurement queue"]])+
'<div class="filters"><input data-search="true" value="'+e(F().search)+'" placeholder="Search materials..." aria-label="Search materials"></div>'+
card("Materials catalogue",table(["Material","Stock","Unit cost","Approval reference",""],list.map(m=>['<strong>'+e(m.name)+'</strong><div class="tiny muted">'+e(m.id)+'</div>',fmt(m.stock)+" "+e(m.unit),money(m.cost),e(m.approved),act("material-issue",m.id,"Record usage")])))+
'<div class="section-note">Cataloguing a product does not mean it is approved for a repair. Production will support OEM/document revisions, batch/expiry records, approved resin-hardener combinations, Sika and other product variants, plus GBP/EUR/USD/SEK/NOK conversion.</div>';
}
function time(){
const s=S(),list=s.timesheets.filter(x=>F().site==="All sites"||x.site===F().site),live=s.timesheets.find(x=>x.person===B.who()&&x.kind==="Shift"&&!x.end);
return head("Timesheets & working days","Personal attendance, travel and reporting hours linked to projects and operations.",act(live?"check-out":"check-in",null,live?"End shift":"Start shift","")+act("time-entry",null,"+ Manual time"))+
metric([["Recorded entries",list.length,"Shift and manual records"],["Logged labour",fmt(list.reduce((n,t)=>n+Number(t.hours||0),0))+"h","Excludes running shifts"],["Working days",new Set(list.map(x=>x.person+"|"+x.date)).size,"Person-days recorded"],["Pending review",list.filter(x=>x.status==="Draft").length,"Approval queue"]])+
filterBar()+
card("Time records",table(["Person","Date / site","Activity","Hours","Status",""],list.map(x=>[e(x.person),date(x.date)+'<div class="tiny muted">'+e(x.site)+'</div>',e(x.kind),x.end||x.kind!=="Shift"?fmt(x.hours)+"h":tag("Running"),tag(x.status||"Draft"),x.status==="Draft"?act("approve-time",x.id,"Review"):"—"])))+
'<div class="section-note">Production will reconcile team events, operational downtime, individual working hours, regular time, travel and standby without double-counting.</div>';
}
function downtime(){
const s=S(),list=filters(s.downtime,["reason","note","recordedBy"]),total=list.reduce((n,d)=>n+downtimeHours(d),0),people=list.reduce((n,d)=>n+personHours(d),0);
return head("Operational downtime","Record why work stopped, who was affected, and the labour and schedule impact.",act("new-downtime",null,"+ Start downtime",""))+
metric([["Events",list.length,"Filtered records"],["Elapsed downtime",fmt(total)+"h","Sum of event durations"],["Affected person-hours",fmt(people)+"h","Duration × affected crew"],["Ongoing",list.filter(x=>!x.end).length,"Timers in progress"]])+
filterBar({search:"downtime events"})+
card("Downtime log",table(["Cause","Site / repair","Affected","Duration","Status",""],list.map(d=>['<strong>'+e(d.reason)+'</strong><div class="tiny muted">'+e(d.note)+'</div>',e(d.site)+" · "+e(d.repair),d.people+" people",fmt(downtimeHours(d))+" h",tag(d.end?"Ended":"Running"),d.end?"—":act("finish-down",d.id,"End downtime") ])))+
'<div class="section-note">Weather, client delays and supply problems are tracked separately from direct labour. Elapsed downtime and affected person-hours are distinct measures, not automatically billable hours.</div>';
}
function fleet(){
const s=S();
return head("Fleet & vehicle checks","Daily checks, seasonal winter tyre readiness, maintenance issues and manager routing.",act("fleet-check",null,"+ Daily check","")+act("vehicle-issue",null,"Report defect"))+
metric([["Vehicles",s.fleet.length,"Company fleet"],["Needs review",s.fleet.filter(x=>x.status!=="Checked").length,"Staff attention"],["Checks recorded",s.fleetChecks.length,"Local demonstration"],["Fleet tasks",s.tasks.filter(x=>x.kind==="Fleet"&&nonClosed(x)).length,"Owned by stores"]])+
card("Vehicle register",table(["Vehicle","Site / type","Tyres","Latest check","Status",""],s.fleet.map(v=>['<strong>'+e(v.registration)+'</strong>',e(v.site)+" · "+e(v.type),e(v.tyres),date(v.checked),tag(v.status),'<div class="row-gap">'+act("fleet-check",v.id,"Check")+act("vehicle-issue",v.id,"Issue")+'</div>'])))+
card("Latest checks",s.fleetChecks.length?s.fleetChecks.slice(0,7).map(c=>row(c.vehicle,c.by+" · "+date(c.date)+" · Tyres "+c.tyres+" · Brakes "+c.brakes,c.note||"Recorded")).join(""):'<div class="empty">Complete a vehicle check to populate this list.</div>')+
'<div class="section-note alert">Tyre and vehicle requirements depend on the location, season and vehicle classification. The live system will require region-specific compliance rules and authorised clearance after safety-related defects.</div>';
}
function weather(){
const s=S(),list=s.weather.filter(x=>F().site==="All sites"||x.site===F().site);
return head("Weather & environmental checks","Recorded wind, humidity, rain and temperature evidence, with a small optional forecast widget.",act("new-weather",null,"+ Record conditions",""))+
metric([["Recorded checks",list.length,"Manual entries"],["Latest wind",list.length?fmt(list[0].wind)+" m/s":"—","Measured/site-reported"],["Latest RH",list.length?fmt(list[0].rh)+"%":"—","Relative humidity"],["Latest surface temp",list.length?fmt(list[0].surface)+"°C":"—","Blade surface"]])+
filterBar()+card("Site weather history",table(["Site","Date","Wind","RH","Ambient","Surface","Rain"],list.map(w=>[e(w.site),date(w.date),fmt(w.wind)+" m/s",fmt(w.rh)+"%",fmt(w.ambient)+"°C",fmt(w.surface)+"°C",e(w.rain)])))+
card("Forecast card (future integration)",'<p class="sub">A compact hourly forecast could display predicted wind, gusts, precipitation and temperature from an approved forecast provider. Provider and forecast issue times must be visible.</p><div class="section-note alert">No live forecast is connected. Forecast values are not evidence of actual repair conditions and cannot authorise safety-critical work.</div>');
}
function people(){
const s=S(),list=s.people.filter(x=>F().site==="All sites"||x.site===F().site);
return head("People & competencies","Technician experience, verified records and renewal reminders without unnecessary complexity.",act("new-person",null,"+ Add employee","")+act("new-competency",null,"+ Competency"))+
metric([["People",list.length,"Recorded team profiles"],["Competency records",s.competencies.length,"Verification required"],["Expiring ≤6 months",s.competencies.filter(c=>approved(c)==="Expiring").length,"Renewal workflow"],["Expired",s.competencies.filter(c=>approved(c)==="Expired").length,"Requires review"]])+
filterBar()+card("Profiles",table(["Name","Role","Site","Competencies","Status"],list.map(p=>[e(p.name),e(p.role),e(p.site),e(s.competencies.filter(c=>c.person===p.name).map(c=>c.name).join(", ")||"Not recorded"),tag(p.status)])))+
card("Competency register",table(["Employee","Qualification","Expiry","Verification","Status"],s.competencies.map(c=>[e(c.person),e(c.name),date(c.expires),c.verified?tag("Recorded verified"):tag("Unverified"),tag(approved(c))])))+
'<div class="section-note">In production, certificates, review history and issuer evidence need secure document storage. Expiry notices at 6/3/1 months will be routed through the notification service.</div>';
}
function performance(){
const s=S(),all=s.repairs.filter(r=>F().site==="All sites"||r.site===F().site),downs=s.downtime.filter(d=>F().site==="All sites"||d.site===F().site),aggs={};
all.forEach(r=>{let k=F().compare==="Sites"?r.site:F().compare==="Repairs"?r.type:r.assigned;if(!aggs[k])aggs[k]={name:k,jobs:0,hours:0,glass:0,core:0,accepted:0,reviewed:0};let a=aggs[k];a.jobs++;r.stages.forEach(st=>{a.hours+=Number(st.hours||0);a.glass+=Number(st.glass||0);a.core+=Number(st.core||0);if(st.qc!=="Pending"){a.reviewed++;if(st.qc==="Accepted")a.accepted++}})});
return head("Performance Intelligence","Compare work volume, repair complexity and quality without unfair individual rankings.",act("export-csv","repairs","Export records"))+
'<div class="filters">'+select(["Teams","Sites","Repairs"],F().compare,'data-filter="compare" aria-label="Compare by"')+select(["All sites",...s.sites.map(x=>x.name)],F().site,'data-filter="site" aria-label="Site filter"')+'</div>'+
metric([["Repairs compared",all.length,"Available sample"],["Direct labour",fmt(all.reduce((n,r)=>n+jobHours(r),0))+"h","Reported person-hours"],["Fibreglass ply area",fmt(all.reduce((n,r)=>n+r.stages.reduce((a,x)=>a+x.glass,0),0))+" m²","Not repair footprint"],["Logged downtime",fmt(downs.reduce((n,d)=>n+personHours(d),0))+" person-h","Separate from direct work"]])+
card("Complexity-aware comparison",table([F().compare==="Sites"?"Site":F().compare==="Repairs"?"Repair type":"Assigned lead","Repairs","Direct hours","Glass ply area","Core area","Reviewed stages accepted"],Object.values(aggs).map(a=>['<strong>'+e(a.name)+'</strong>',a.jobs,fmt(a.hours)+"h",fmt(a.glass)+" m²",fmt(a.core)+" m²",a.reviewed?fmt(100*a.accepted/a.reviewed)+"% ("+a.reviewed+" stages)":"Insufficient data"])))+
card("Example interpretation",'<p class="sub">More material, deeper repairs, more plies, more core replacement, access difficulty and mandatory curing can explain longer repair times. The correct comparator is a sufficiently large group of similar repairs, with each stage and downtime source validated.</p><div class="section-note alert">Do not use these small, fictional samples to evaluate individual employment, remuneration or contract renewal. Real workforce analytics require fair-comparison methods, validated records and human oversight.</div>');
}
function outlook(){
const s=S(),p=s.savedReport,repair=s.repairs.filter(x=>p.site==="All sites"||x.site===p.site),done=repair.filter(x=>x.status==="Completed").length;
return head("Blade Outlook","Create client-ready notes from recorded operations, with a clear choice of technical detail.",act("outlook-notes",null,"Save settings","")+act("outlook-copy",null,"Copy draft")+act("outlook-print",null,"Print / PDF","secondary"))+
'<div class="grid2"><div>'+card("Report configuration",
'<div class="form-grid">'+B.field("report-period","Period","select",{value:p.period,choices:["Day","Week","Month","Custom"]}) .replace('name="report-period"','id="report-period" name="report-period"')+
B.field("report-site","Site","select",{value:p.site,choices:B.siteChoices()}).replace('name="report-site"','id="report-site" name="report-site"')+
B.field("report-audience","Audience","select",{value:p.audience,choices:["Client","Management","Technical"]}).replace('name="report-audience"','id="report-audience" name="report-audience"')+
B.field("report-detail","Detail","select",{value:p.detail,choices:["Simple","Standard","Technical"]}).replace('name="report-detail"','id="report-detail" name="report-detail"')+
B.field("report-notes","Management notes","textarea",{value:p.notes,full:true}).replace('name="report-notes"','id="report-notes" name="report-notes"')+
'</div><div class="section-note">Select Save settings to refresh the preview and store your notes locally.</div>')+'</div><div>'+card("Client report preview",
'<div class="eyebrow">'+e(p.period)+" · "+e(p.audience)+'</div><h3>'+e(p.site==="All sites"?"Project-wide overview":p.site)+'</h3><p class="sub">This example summarises '+repair.length+' repair record(s), '+done+' completed, with outstanding actions and downtime reported separately.</p><h4>Progress</h4><p class="sub">'+done+' of '+repair.length+' recorded repairs are marked complete. Remaining work requires supervisor verification.</p><h4>Risks and delays</h4><p class="sub">'+s.downtime.filter(x=>p.site==="All sites"||x.site===p.site).length+' downtime event(s) are logged. Review causes and affected person-hours in Daily Operations.</p><h4>Upcoming work</h4><p class="sub">'+s.tasks.filter(t=>nonClosed(t)&&(p.site==="All sites"||t.site===p.site)).length+' outstanding tasks require the assigned teams’ attention.</p><h4>Management notes</h4><p class="sub">'+e(p.notes||"No additional comments.")+'</p><div class="section-note alert">DRAFT — illustrative sample data, not suitable for sending to clients.</div>')+'</div></div>';
}
function finance(){
const s=S(),records=s.repairs.map(r=>({r,materials:(r.issues||[]).reduce((n,x)=>n+x.cost,0),labour:jobHours(r)*35})),total=records.reduce((n,x)=>n+x.materials+x.labour,0);
return head("Costs & finance","Connect logged material consumption and labour estimates to project costing.",act("export-csv","repairs","Export repair data"))+
metric([["Indicative job costs",money(total),"Sample labour rate £35/h"],["Materials issued",money(records.reduce((n,x)=>n+x.materials,0)),"Linked usage"],["Labour value",money(records.reduce((n,x)=>n+x.labour,0)),"Illustrative cost"],["Costed repair records",records.length,"No VAT or overheads included"]])+
card("Indicative cost ledger",table(["Repair","Site","Material usage","Labour estimate","Subtotal"],records.map(({r,materials,labour})=>[e(r.id),e(r.site),money(materials),money(labour),money(materials+labour)])))+
'<div class="section-note alert">Demo costs are not quotations or invoices. In production, financial data needs separate permissions, currency conversion snapshots, configurable markups, payroll and contractual rules.</div>';
}
function forms(){
const s=S();return head("Templates & settings","Configure organisations, workflows and structured data before automating approvals.",act("new-site",null,"+ New site","")+act("new-blade",null,"+ Add blade"))+
'<div class="grid2"><div>'+card("Available report templates",'<div class="grid2">'+[["External laminate","Assessment → preparation → laminating → curing → QC"],["Internal laminate + core","Core removal → replacement → plies → QC"],["Progressive monitoring","Baseline → comparison → engineering follow-up"],["Daily vehicle check","Tyres → lights → brakes → defects"],["Downtime event","Cause → crew impact → start/end"],["Competency review","Evidence → verification → reminders"]].map(x=>'<div class="tile"><strong>'+x[0]+'</strong><p>'+x[1]+'</p></div>').join("")+'</div><div class="section-note">Production templates will be versioned, with per-client configuration and controlled approval. This prototype uses predefined stage types.</div>')+
card("Organisation settings",row("Company",s.company)+row("Sites",s.sites.length+" configured")+row("Roles","Technician, Team Lead, Store Manager, Project Manager, Admin"))+'</div><div>'+
card("Local demo management",'<p class="sub">Export a JSON backup of your sample records. The browser keeps changes locally; clearing browser data will remove them.</p><div class="stack" style="margin-top:15px">'+act("export",null,"Export demo JSON")+act("export-csv","tasks","Export tasks CSV")+'<label class="btn secondary" style="text-align:center">Import demo backup <input id="import-file" type="file" accept="application/json" hidden></label>'+act("reset",null,"Reset demo","danger")+'</div>')+
card("Production architecture — next phase",'<p class="sub">Private application repository, PostgreSQL, tenant separation, encrypted object storage, mobile offline queue, server-side permissions, audit trails, and event-driven AI services.</p><div class="section-note alert">This public GitHub Pages site must not be used to hold genuine records, credentials, payroll information or proprietary OEM documentation.</div>')+'</div></div>';
}
B.views={dashboard,repairs,passport,inspections,technician,tasks,requests,materials,time,downtime,fleet,weather,people,performance,outlook,finance,forms};
})();