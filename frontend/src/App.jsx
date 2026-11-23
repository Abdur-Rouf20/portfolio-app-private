import { useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { ArrowUpRight, Github, Linkedin, Mail, Menu, X, ShieldCheck, Code2, Layers3, Send, LogOut, Plus, Trash2, Pencil, LayoutDashboard } from 'lucide-react';
import api from './api';

function usePortfolio() {
  const [profile, setProfile] = useState({});
  const [items, setItems] = useState([]);
  useEffect(() => {
    Promise.all([api.get('/public/profile'), api.get('/public/items')])
      .then(([p, i]) => { setProfile(p.data || {}); setItems(i.data || []); })
      .catch(() => {});
  }, []);
  return { profile, items };
}

function Header({ profile }) {
  const [open, setOpen] = useState(false);
  const links = [['Home', '/'], ['About', '/about'], ['Projects', '/projects'], ['Experience', '/experience'], ['Contact', '/contact']];
  return <header className="header"><div className="container nav-wrap">
    <Link className="brand" to="/"><span className="brand-mark">R</span><span>{profile.name || 'Portfolio'}<small>ENGINEERING PORTFOLIO</small></span></Link>
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X/> : <Menu/>}</button>
    <nav className={open ? 'nav open' : 'nav'}>{links.map(([label, path]) => <NavLink onClick={() => setOpen(false)} end={path === '/'} key={path} to={path}>{label}</NavLink>)}<Link className="nav-admin" to="/admin/login">Admin <ArrowUpRight size={14}/></Link></nav>
  </div></header>;
}

function Footer({ profile }) {
  return <footer className="footer"><div className="container footer-inner"><span>© {new Date().getFullYear()} {profile.name || 'Your Name'}. Built with purpose.</span><div className="socials">{profile.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank" rel="noreferrer"><Github/></a>}{profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer"><Linkedin/></a>}<a href={`mailto:${profile.email || ''}`}><Mail/></a></div></div></footer>;
}

function SectionTitle({ eyebrow, title, text }) {
  return <div className="section-title"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

function ProjectCard({ item }) {
  return <article className="project-card"><div className="project-top"><span className="project-icon"><Code2/></span><span className="project-type">FEATURED PROJECT</span></div><h3>{item.title}</h3><p className="muted">{item.subtitle}</p><p>{item.description}</p><div className="tags">{(item.technologies || []).map(t => <span key={t}>{t}</span>)}</div>{item.link && <a className="text-link" href={item.link} target="_blank" rel="noreferrer">Explore project <ArrowUpRight size={16}/></a>}</article>;
}

function Home({ profile, items }) {
  const projects = items.filter(x => x.type === 'project').slice(0, 3);
  const skills = items.filter(x => x.type === 'skill').slice(0, 6);
  return <><main>
    <section className="hero"><div className="container hero-grid"><div><span className="status"><i/> OPEN TO OPPORTUNITIES</span><p className="eyebrow">HELLO, I'M</p><h1>{profile.name || 'Your Name'}<br/><span>{profile.headline || 'Software Quality & Full-Stack Engineer'}</span></h1><p className="hero-copy">{profile.summary || 'I create dependable digital products by combining software quality engineering, automation and full-stack development.'}</p><div className="hero-actions"><Link className="btn btn-primary" to="/projects">Explore my work <ArrowUpRight size={17}/></Link><Link className="btn btn-secondary" to="/contact">Let's connect <Mail size={17}/></Link></div><div className="hero-social">{profile.socialLinks?.github && <a href={profile.socialLinks.github} target="_blank" rel="noreferrer"><Github/> GitHub</a>}{profile.socialLinks?.linkedin && <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer"><Linkedin/> LinkedIn</a>}</div></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-core"><ShieldCheck size={54}/><span>QUALITY<br/>BY DESIGN</span></div><div className="float-card float-one"><Code2/><span>Full-Stack<br/><b>Development</b></span></div><div className="float-card float-two"><Layers3/><span>Software<br/><b>Quality</b></span></div><div className="float-card float-three"><ShieldCheck/><span>Reliable<br/><b>Engineering</b></span></div></div></div></section>
    <section className="section"><div className="container"><SectionTitle eyebrow="WHAT I DO" title="Engineering with quality at the core" text="Bringing together development, testing and problem-solving to deliver software people can rely on."/><div className="feature-grid"><div className="feature"><ShieldCheck/><h3>Quality Engineering</h3><p>Test strategy, functional validation, automation thinking and reliable release practices.</p></div><div className="feature"><Code2/><h3>Full-Stack Development</h3><p>Building responsive interfaces, backend services, APIs and data-driven applications.</p></div><div className="feature"><Layers3/><h3>Engineering Practices</h3><p>Clean architecture, maintainability, documentation and continuous improvement.</p></div></div></div></section>
    <section className="section section-alt"><div className="container"><SectionTitle eyebrow="SELECTED WORK" title="Projects that demonstrate how I think" text="A selection of practical work, experiments and engineering solutions."/><div className="project-grid">{projects.length ? projects.map(p => <ProjectCard key={p._id} item={p}/>) : <p className="muted">Project entries will appear here when published from the admin dashboard.</p>}</div><Link className="text-link section-link" to="/projects">View all projects <ArrowUpRight size={16}/></Link></div></section>
    <section className="section"><div className="container"><SectionTitle eyebrow="TOOLKIT" title="Technologies & skills"/><div className="skill-cloud">{skills.length ? skills.map(s => <span key={s._id}>{s.title}</span>) : ['JavaScript','React','Node.js','Express','MongoDB','Python','Software Testing','REST APIs'].map(s => <span key={s}>{s}</span>)}</div></div></section>
    <section className="cta-section"><div className="container cta"><div><span className="eyebrow">HAVE A PROJECT IN MIND?</span><h2>Let's build something<br/>meaningful together.</h2></div><Link className="btn btn-primary" to="/contact">Get in touch <ArrowUpRight/></Link></div></section>
  </main></>;
}

function About({ profile }) {
  return <main className="page-main"><div className="container narrow"><SectionTitle eyebrow="ABOUT ME" title="Curious by nature. Quality-driven by practice."/><p className="lead">{profile.about || 'Add your professional story from the admin dashboard. Explain what motivates you, what you have learned, and the kind of engineering problems you enjoy solving.'}</p><div className="about-panel"><h3>My approach</h3><p>I believe quality is not a final checkpoint. It is part of every engineering decision—from understanding a requirement to designing, building, validating and improving a product.</p></div></div></main>;
}

function ListingPage({ type, title, eyebrow, items }) {
  const list = items.filter(i => i.type === type);
  return <main className="page-main"><div className="container"><SectionTitle eyebrow={eyebrow} title={title}/><div className={type === 'project' ? 'project-grid' : 'timeline'}>{list.map(i => type === 'project' ? <ProjectCard key={i._id} item={i}/> : <article className="timeline-item" key={i._id}><span className="timeline-dot"/><div><span className="eyebrow">{i.startDate} {i.endDate && `— ${i.endDate}`}</span><h3>{i.title}</h3><p className="muted">{i.subtitle}</p><p>{i.description}</p></div></article>)}</div>{!list.length && <p className="muted">No published entries yet. Add content through the admin dashboard.</p>}</div></main>;
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [state, setState] = useState({ busy: false, message: '', error: false });
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  async function submit(e) {
    e.preventDefault(); setState({ busy: true, message: '', error: false });
    try { const r = await api.post('/public/messages', form); setState({ busy: false, message: r.data.message, error: false }); setForm({ name: '', email: '', subject: '', message: '' }); }
    catch (err) { setState({ busy: false, message: err.response?.data?.message || 'Unable to send your message right now.', error: true }); }
  }
  return <main className="page-main"><div className="container contact-layout"><div><SectionTitle eyebrow="CONTACT" title="Let's start a conversation." text="Have an opportunity, collaboration idea or question? Send a message."/><p className="contact-note"><Mail/> Your message will be delivered to the portfolio inbox.</p></div><form className="form-card" onSubmit={submit}>{['name','email','subject'].map(f => <label key={f}>{f[0].toUpperCase()+f.slice(1)}{f !== 'subject' && ' *'}<input name={f} type={f === 'email' ? 'email' : 'text'} value={form[f]} onChange={change} required={f !== 'subject'} maxLength="160"/></label>)}<label>Message *<textarea name="message" value={form.message} onChange={change} required rows="5" maxLength="5000"/></label><button className="btn btn-primary" disabled={state.busy}>{state.busy ? 'Sending…' : 'Send message'} <Send size={16}/></button>{state.message && <p className={state.error ? 'form-error' : 'form-success'}>{state.message}</p>}</form></div></main>;
}

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  async function submit(e) { e.preventDefault(); setError(''); try { await api.post('/auth/login', form); navigate('/admin'); } catch (err) { setError(err.response?.data?.message || 'Login failed'); } }
  return <main className="admin-login"><form className="form-card login-card" onSubmit={submit}><span className="eyebrow">ADMINISTRATOR</span><h2>Sign in to manage your portfolio</h2><label>Email<input type="email" required value={form.email} onChange={e => setForm({...form,email:e.target.value})}/></label><label>Password<input type="password" required value={form.password} onChange={e => setForm({...form,password:e.target.value})}/></label><button className="btn btn-primary">Sign in <ArrowUpRight size={16}/></button>{error && <p className="form-error">{error}</p>}<Link className="text-link" to="/">← Back to website</Link></form></main>;
}

function Admin() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [items, setItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');
  const navigate = useNavigate();
  async function load() {
    try {
      const [me, overview, allItems, allMessages] = await Promise.all([api.get('/auth/me'), api.get('/admin/overview'), api.get('/admin/items'), api.get('/admin/messages')]);
      setUser(me.data.user); setStats(overview.data); setItems(allItems.data); setMessages(allMessages.data);
    } catch { navigate('/admin/login'); }
  }
  useEffect(() => { load(); }, []);
  async function logout() { await api.post('/auth/logout'); navigate('/'); }
  async function remove(id) { if (!confirm('Delete this portfolio item?')) return; await api.delete(`/admin/items/${id}`); setNotice('Item deleted'); load(); }
  async function saveItem(e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    data.technologies = data.technologies ? data.technologies.split(',').map(x => x.trim()).filter(Boolean) : [];
    data.featured = data.featured === 'on'; data.published = data.published === 'on'; data.sortOrder = Number(data.sortOrder || 0);
    try { if (editing?._id) await api.put(`/admin/items/${editing._id}`, data); else await api.post('/admin/items', data); setEditing(null); setNotice('Changes saved'); load(); }
    catch (err) { setNotice(err.response?.data?.message || 'Unable to save item'); }
  }
  async function changeMessage(id, status) { await api.patch(`/admin/messages/${id}`, { status }); load(); }
  if (!user) return <main className="admin-loading">Loading admin workspace…</main>;
  return <main className="admin-shell"><aside className="admin-sidebar"><Link to="/" className="brand"><span className="brand-mark">R</span><span>Portfolio CMS<small>ADMIN WORKSPACE</small></span></Link><div className="admin-user">Signed in as<br/><b>{user.name}</b></div>{[['overview','Overview'],['items','Portfolio content'],['messages','Messages']].map(([id,label])=><button className={tab===id?'admin-nav active':'admin-nav'} key={id} onClick={()=>{setTab(id);setEditing(null)}}><LayoutDashboard size={17}/>{label}</button>)}<button className="admin-nav logout" onClick={logout}><LogOut size={17}/>Sign out</button></aside><section className="admin-content"><div className="admin-top"><div><span className="eyebrow">CONTENT MANAGEMENT</span><h1>{tab==='overview'?'Overview':tab==='items'?'Portfolio content':'Inbox'}</h1></div><Link className="btn btn-secondary" to="/">View website <ArrowUpRight size={16}/></Link></div>
    {notice && <p className="notice">{notice}</p>}
    {tab==='overview' && <><div className="stat-grid"><div className="stat-card"><span>Portfolio entries</span><b>{stats?.items ?? 0}</b></div><div className="stat-card"><span>Total messages</span><b>{stats?.messages ?? 0}</b></div><div className="stat-card"><span>New messages</span><b>{stats?.unreadMessages ?? 0}</b></div></div><div className="admin-panel"><h3>Welcome to your portfolio CMS</h3><p>Manage the content displayed on your public website. Keep project descriptions, experience and credentials accurate and up to date.</p></div></>}
    {tab==='items' && <><div className="admin-toolbar"><p>Manage projects, experience, skills and certifications.</p><button className="btn btn-primary" onClick={()=>setEditing({type:'project',title:'',subtitle:'',description:'',technologies:[],published:true})}><Plus size={16}/> Add entry</button></div>{editing && <form className="form-card editor-form" onSubmit={saveItem}><h3>{editing._id?'Edit entry':'New entry'}</h3><div className="editor-grid"><label>Type<select name="type" defaultValue={editing.type}><option value="project">Project</option><option value="experience">Experience</option><option value="skill">Skill</option><option value="certification">Certification</option></select></label><label>Title<input name="title" required defaultValue={editing.title}/></label><label>Subtitle<input name="subtitle" defaultValue={editing.subtitle}/></label><label>Category<input name="category" defaultValue={editing.category}/></label><label>Start date<input name="startDate" defaultValue={editing.startDate}/></label><label>End date<input name="endDate" defaultValue={editing.endDate}/></label><label>Technologies (comma separated)<input name="technologies" defaultValue={(editing.technologies||[]).join(', ')}/></label><label>External link<input name="link" defaultValue={editing.link}/></label><label className="full-field">Description<textarea name="description" rows="3" defaultValue={editing.description}/></label><label>Sort order<input name="sortOrder" type="number" defaultValue={editing.sortOrder||0}/></label><label className="check-label"><input name="featured" type="checkbox" defaultChecked={editing.featured}/> Featured</label><label className="check-label"><input name="published" type="checkbox" defaultChecked={editing.published!==false}/> Published</label></div><div className="form-actions"><button className="btn btn-primary">Save entry</button><button type="button" className="btn btn-secondary" onClick={()=>setEditing(null)}>Cancel</button></div></form>}<div className="admin-list">{items.map(item=><div className="admin-list-row" key={item._id}><div><span className="eyebrow">{item.type}</span><b>{item.title}</b><small>{item.subtitle}</small></div><div className="row-actions"><button title="Edit" onClick={()=>setEditing(item)}><Pencil size={17}/></button><button title="Delete" onClick={()=>remove(item._id)}><Trash2 size={17}/></button></div></div>)}</div></>}
    {tab==='messages' && <div className="admin-list">{messages.map(m=><article className="message-row" key={m._id}><div className="message-head"><b>{m.name}</b><span className={`message-status ${m.status}`}>{m.status}</span></div><small>{m.email} · {new Date(m.createdAt).toLocaleString()}</small><h4>{m.subject || 'No subject'}</h4><p>{m.message}</p><div className="row-actions"><button onClick={()=>changeMessage(m._id,'read')}>Mark read</button><button onClick={()=>changeMessage(m._id,'archived')}>Archive</button></div></article>)}{!messages.length && <p className="muted">No messages yet.</p>}</div>}
  </section></main>;
}

export default function App() {
  const { profile, items } = usePortfolio();
  return <><Header profile={profile}/><Routes>
    <Route path="/" element={<Home profile={profile} items={items}/>}/>
    <Route path="/about" element={<About profile={profile}/>}/>
    <Route path="/projects" element={<ListingPage type="project" title="Selected projects" eyebrow="MY WORK" items={items}/>}/>
    <Route path="/experience" element={<ListingPage type="experience" title="Experience & journey" eyebrow="MY JOURNEY" items={items}/>}/>
    <Route path="/contact" element={<Contact/>}/>
    <Route path="/admin/login" element={<AdminLogin/>}/>
    <Route path="/admin" element={<Admin/>}/>
    <Route path="*" element={<main className="page-main container"><h1>Page not found</h1><Link to="/">Return home</Link></main>}/>
  </Routes><Footer profile={profile}/></>;
}
