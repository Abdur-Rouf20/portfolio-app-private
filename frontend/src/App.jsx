import { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowUpRight, Github, Linkedin, Mail, Menu, X, ShieldCheck, Code2, Layers3,
  Send, LogOut, Plus, Trash2, Pencil, LayoutDashboard, Award, UserRound, RefreshCw
} from 'lucide-react';
import api from './api';

function safeExternalUrl(value) {
  if (!value || typeof value !== 'string') return '';
  try { const parsed = new URL(value); return ['http:', 'https:'].includes(parsed.protocol) ? parsed.href : ''; }
  catch { return ''; }
}

function usePortfolio() {
  const [profile, setProfile] = useState({});
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [profileResult, itemsResult] = await Promise.all([
        api.get('/public/profile'), api.get('/public/items')
      ]);
      setProfile(profileResult.data || {});
      setItems(Array.isArray(itemsResult.data) ? itemsResult.data : []);
    } catch (err) {
      setError(err.response?.data?.message || 'Portfolio content could not be loaded. Check that the API server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);
  return { profile, items, loading, error, reload };
}

function Header({ profile }) {
  const [open, setOpen] = useState(false);
  const links = [
    ['Home', '/'], ['About', '/about'], ['Projects', '/projects'],
    ['Experience', '/experience'], ['Certifications', '/certifications'], ['Contact', '/contact']
  ];
  return <header className="header"><div className="container nav-wrap">
    <Link className="brand" to="/"><span className="brand-mark">R</span><span>{profile.name || 'Portfolio'}<small>ENGINEERING PORTFOLIO</small></span></Link>
    <button className="menu-toggle" onClick={() => setOpen(value => !value)} aria-label="Toggle navigation" aria-expanded={open}>{open ? <X/> : <Menu/>}</button>
    <nav className={open ? 'nav open' : 'nav'}>
      {links.map(([label, path]) => <NavLink onClick={() => setOpen(false)} end={path === '/'} key={path} to={path}>{label}</NavLink>)}
      <Link className="nav-admin" onClick={() => setOpen(false)} to="/admin/login">Admin <ArrowUpRight size={14}/></Link>
    </nav>
  </div></header>;
}

function Footer({ profile }) {
  return <footer className="footer"><div className="container footer-inner">
    <span>© {new Date().getFullYear()} {profile.name || 'Your Name'}. Built with purpose.</span>
    <div className="socials">
      {profile.socialLinks?.github && safeExternalUrl(profile.socialLinks.github) && <a href={safeExternalUrl(profile.socialLinks.github)} target="_blank" rel="noreferrer" aria-label="GitHub"><Github/></a>}
      {profile.socialLinks?.linkedin && safeExternalUrl(profile.socialLinks.linkedin) && <a href={safeExternalUrl(profile.socialLinks.linkedin)} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin/></a>}
      {profile.socialLinks?.website && safeExternalUrl(profile.socialLinks.website) && <a href={safeExternalUrl(profile.socialLinks.website)} target="_blank" rel="noopener noreferrer" aria-label="Personal website"><ArrowUpRight/></a>}
      {profile.email && <a href={`mailto:${profile.email}`} aria-label="Email"><Mail/></a>}
    </div>
  </div></footer>;
}

function SectionTitle({ eyebrow, title, text }) {
  return <div className="section-title"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{text && <p>{text}</p>}</div>;
}

function ProjectCard({ item }) {
  return <article className="project-card">
    {safeExternalUrl(item.imageUrl) && <img className="project-image" src={safeExternalUrl(item.imageUrl)} alt={`${item.title} preview`} loading="lazy" onError={event => { event.currentTarget.style.display = 'none'; }}/>}
    <div className="project-top"><span className="project-icon"><Code2/></span><span className="project-type">{item.category || 'PROJECT'}</span></div>
    <h3>{item.title}</h3><p className="muted">{item.subtitle}</p><p>{item.description}</p>
    <div className="tags">{(item.technologies || []).map(technology => <span key={technology}>{technology}</span>)}</div>
    {safeExternalUrl(item.link) && <a className="text-link" href={safeExternalUrl(item.link)} target="_blank" rel="noopener noreferrer">Explore project <ArrowUpRight size={16}/></a>}
  </article>;
}

function Home({ profile, items }) {
  const projects = items.filter(item => item.type === 'project').slice(0, 3);
  const skills = items.filter(item => item.type === 'skill').slice(0, 8);
  const certifications = items.filter(item => item.type === 'certification').slice(0, 3);
  return <main>
    <section className="hero"><div className="container hero-grid"><div>
      <span className="status"><i/> OPEN TO OPPORTUNITIES</span><p className="eyebrow">HELLO, I'M</p>
      <h1>{profile.name || 'Your Name'}<br/><span>{profile.headline || 'Software Quality & Full-Stack Engineer'}</span></h1>
      <p className="hero-copy">{profile.summary || 'I create dependable digital products by combining software quality engineering, automation and full-stack development.'}</p>
      <div className="hero-actions"><Link className="btn btn-primary" to="/projects">Explore my work <ArrowUpRight size={17}/></Link><Link className="btn btn-secondary" to="/contact">Let's connect <Mail size={17}/></Link></div>
      <div className="hero-social">{profile.socialLinks?.github && safeExternalUrl(profile.socialLinks.github) && <a href={safeExternalUrl(profile.socialLinks.github)} target="_blank" rel="noreferrer"><Github/> GitHub</a>}{profile.socialLinks?.linkedin && <a href={safeExternalUrl(profile.socialLinks.linkedin)} target="_blank" rel="noreferrer"><Linkedin/> LinkedIn</a>}</div>
    </div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="hero-core"><ShieldCheck size={54}/><span>QUALITY<br/>BY DESIGN</span></div><div className="float-card float-one"><Code2/><span>Full-Stack<br/><b>Development</b></span></div><div className="float-card float-two"><Layers3/><span>Software<br/><b>Quality</b></span></div><div className="float-card float-three"><ShieldCheck/><span>Reliable<br/><b>Engineering</b></span></div></div></div></section>
    <section className="section"><div className="container"><SectionTitle eyebrow="WHAT I DO" title="Engineering with quality at the core" text="Bringing together development, testing and problem-solving to deliver software people can rely on."/><div className="feature-grid"><div className="feature"><ShieldCheck/><h3>Quality Engineering</h3><p>Test strategy, functional validation, automation thinking and reliable release practices.</p></div><div className="feature"><Code2/><h3>Full-Stack Development</h3><p>Building responsive interfaces, backend services, APIs and data-driven applications.</p></div><div className="feature"><Layers3/><h3>Engineering Practices</h3><p>Clean architecture, maintainability, documentation and continuous improvement.</p></div></div></div></section>
    <section className="section section-alt"><div className="container"><SectionTitle eyebrow="SELECTED WORK" title="Projects that demonstrate how I think" text="A selection of practical work, experiments and engineering solutions."/><div className="project-grid">{projects.length ? projects.map(project => <ProjectCard key={project._id} item={project}/>) : <p className="muted">Project entries will appear here when published from the admin dashboard.</p>}</div><Link className="text-link section-link" to="/projects">View all projects <ArrowUpRight size={16}/></Link></div></section>
    <section className="section"><div className="container"><SectionTitle eyebrow="TOOLKIT" title="Technologies & skills"/><div className="skill-cloud">{skills.length ? skills.map(skill => <span key={skill._id}>{skill.title}</span>) : ['JavaScript','React','Node.js','Express','MongoDB','Python','Software Testing','REST APIs'].map(skill => <span key={skill}>{skill}</span>)}</div></div></section>
    {certifications.length > 0 && <section className="section section-alt"><div className="container"><SectionTitle eyebrow="CREDENTIALS" title="Certifications & learning"/><div className="feature-grid">{certifications.map(cert => <article className="feature" key={cert._id}><Award/><h3>{cert.title}</h3><p>{cert.subtitle}</p>{cert.description && <p>{cert.description}</p>}{cert.link && <a className="text-link" href={cert.link} target="_blank" rel="noreferrer">View credential <ArrowUpRight size={16}/></a>}</article>)}</div><Link className="text-link section-link" to="/certifications">View all certifications <ArrowUpRight size={16}/></Link></div></section>}
    <section className="cta-section"><div className="container cta"><div><span className="eyebrow">HAVE A PROJECT IN MIND?</span><h2>Let's build something<br/>meaningful together.</h2></div><Link className="btn btn-primary" to="/contact">Get in touch <ArrowUpRight/></Link></div></section>
  </main>;
}

function About({ profile }) {
  return <main className="page-main"><div className="container narrow"><SectionTitle eyebrow="ABOUT ME" title="Curious by nature. Quality-driven by practice."/><p className="lead">{profile.about || 'Add your professional story from the admin dashboard. Explain what motivates you, what you have learned, and the kind of engineering problems you enjoy solving.'}</p><div className="about-panel"><h3>My approach</h3><p>I believe quality is not a final checkpoint. It is part of every engineering decision—from understanding a requirement to designing, building, validating and improving a product.</p>{safeExternalUrl(profile.resumeUrl) && <a className="text-link" href={safeExternalUrl(profile.resumeUrl)} target="_blank" rel="noreferrer">View résumé <ArrowUpRight size={16}/></a>}</div></div></main>;
}

function ListingPage({ type, title, eyebrow, items }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const list = items.filter(item => item.type === type);
  const categories = [...new Set(list.map(item => item.category).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  const normalizedSearch = search.trim().toLowerCase();
  const filtered = list.filter(item => {
    const searchable = [item.title, item.subtitle, item.description, item.category, ...(item.technologies || [])].filter(Boolean).join(' ').toLowerCase();
    return (!normalizedSearch || searchable.includes(normalizedSearch)) && (category === 'all' || item.category === category);
  });
  return <main className="page-main"><div className="container"><SectionTitle eyebrow={eyebrow} title={title}/>
    <div className="listing-toolbar">
      <label className="search-field"><span className="sr-only">Search {title.toLowerCase()}</span><input type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder={`Search ${type === 'project' ? 'projects' : title.toLowerCase()}…`} /></label>
      {type === 'project' && categories.length > 0 && <label className="filter-field"><span className="sr-only">Filter projects by category</span><select value={category} onChange={event => setCategory(event.target.value)}><option value="all">All categories</option>{categories.map(value => <option key={value} value={value}>{value}</option>)}</select></label>}
      <span className="result-count">{filtered.length} {filtered.length === 1 ? 'result' : 'results'}</span>
    </div>
    <div className={type === 'project' ? 'project-grid' : 'timeline'}>
      {filtered.map(item => type === 'project' ? <ProjectCard key={item._id} item={item}/> : <article className="timeline-item" key={item._id}><span className="timeline-dot"/><div><span className="eyebrow">{[item.startDate, item.endDate].filter(Boolean).join(' — ')}</span><h3>{item.title}</h3><p className="muted">{item.subtitle}</p><p>{item.description}</p>{safeExternalUrl(item.link) && <a className="text-link" href={safeExternalUrl(item.link)} target="_blank" rel="noopener noreferrer">View details <ArrowUpRight size={15}/></a>}</div></article>)}
    </div>
    {!filtered.length && <div className="empty-state"><h3>{list.length ? 'No matching entries' : 'Nothing published here yet'}</h3><p className="muted">{list.length ? 'Try another search term or category.' : 'Published content added through the admin dashboard will appear here.'}</p>{(search || category !== 'all') && <button className="btn btn-secondary" onClick={() => { setSearch(''); setCategory('all'); }}>Clear filters</button>}</div>}
  </div></main>;
}

function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [state, setState] = useState({ busy: false, message: '', error: false });
  const change = event => setForm(current => ({ ...current, [event.target.name]: event.target.value }));
  async function submit(event) {
    event.preventDefault();
    setState({ busy: true, message: '', error: false });
    try {
      const response = await api.post('/public/messages', form);
      setState({ busy: false, message: response.data.message, error: false });
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setState({ busy: false, message: err.response?.data?.message || 'Unable to send your message right now.', error: true });
    }
  }
  return <main className="page-main"><div className="container contact-layout"><div><SectionTitle eyebrow="CONTACT" title="Let's start a conversation." text="Have an opportunity, collaboration idea or question? Send a message."/><p className="contact-note"><Mail/> Your message will be saved to the portfolio inbox.</p></div>
    <form className="form-card" onSubmit={submit}>
      {['name','email','subject'].map(field => <label key={field}>{field[0].toUpperCase()+field.slice(1)}{field !== 'subject' && ' *'}<input name={field} type={field === 'email' ? 'email' : 'text'} value={form[field]} onChange={change} required={field !== 'subject'} maxLength={field === 'name' ? 100 : 160}/></label>)}
      <label>Message *<textarea name="message" value={form.message} onChange={change} required rows="5" maxLength="5000"/></label>
      <button className="btn btn-primary" disabled={state.busy}>{state.busy ? 'Sending…' : 'Send message'} <Send size={16}/></button>
      {state.message && <p role="status" className={state.error ? 'form-error' : 'form-success'}>{state.message}</p>}
    </form>
  </div></main>;
}

function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [itemSearch, setItemSearch] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState('all');
  const [messageSearch, setMessageSearch] = useState('');
  const [messageStatusFilter, setMessageStatusFilter] = useState('all');
  const navigate = useNavigate();
  async function submit(event) {
    event.preventDefault(); setError(''); setBusy(true);
    try { await api.post('/auth/login', form); navigate('/admin'); }
    catch (err) { setError(err.response?.data?.message || 'Login failed'); }
    finally { setBusy(false); }
  }
  return <main className="admin-login"><form className="form-card login-card" onSubmit={submit}><span className="eyebrow">ADMINISTRATOR</span><h2>Sign in to manage your portfolio</h2>
    <label>Email<input type="email" required autoComplete="username" value={form.email} onChange={event => setForm(current => ({...current,email:event.target.value}))}/></label>
    <label>Password<input type="password" required autoComplete="current-password" value={form.password} onChange={event => setForm(current => ({...current,password:event.target.value}))}/></label>
    <button className="btn btn-primary" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <ArrowUpRight size={16}/></button>
    {error && <p className="form-error" role="alert">{error}</p>}<Link className="text-link" to="/">← Back to website</Link>
  </form></main>;
}

function ProfileEditor({ profile, onSave, busy }) {
  async function submit(event) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = Object.fromEntries(form.entries());
    data.socialLinks = { github: data.github, linkedin: data.linkedin, website: data.website };
    delete data.github; delete data.linkedin; delete data.website;
    await onSave(data);
  }
  return <form className="form-card editor-form" onSubmit={submit} key={profile.updatedAt || profile.name || 'profile'}>
    <h3><UserRound size={18}/> Public profile information</h3>
    <div className="editor-grid">
      <label>Name<input name="name" required maxLength="120" defaultValue={profile.name || ''}/></label>
      <label>Professional headline<input name="headline" maxLength="180" defaultValue={profile.headline || ''}/></label>
      <label>Email<input name="email" type="email" defaultValue={profile.email || ''}/></label>
      <label>Location<input name="location" defaultValue={profile.location || ''}/></label>
      <label>GitHub URL<input name="github" type="url" defaultValue={profile.socialLinks?.github || ''}/></label>
      <label>LinkedIn URL<input name="linkedin" type="url" defaultValue={profile.socialLinks?.linkedin || ''}/></label>
      <label>Personal website<input name="website" type="url" defaultValue={profile.socialLinks?.website || ''}/></label>
      <label>Profile image URL<input name="avatarUrl" type="url" defaultValue={profile.avatarUrl || ''}/></label>
      <label className="full-field">Résumé URL<input name="resumeUrl" type="url" defaultValue={profile.resumeUrl || ''}/></label>
      <label className="full-field">Short introduction<textarea name="summary" rows="3" defaultValue={profile.summary || ''}/></label>
      <label className="full-field">About me<textarea name="about" rows="6" defaultValue={profile.about || ''}/></label>
    </div>
    <div className="form-actions"><button className="btn btn-primary" disabled={busy}>{busy ? 'Saving…' : 'Save profile'}</button></div>
  </form>;
}

function Admin() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [profile, setProfile] = useState({});
  const [items, setItems] = useState([]);
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState('overview');
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [itemSearch, setItemSearch] = useState('');
  const [itemTypeFilter, setItemTypeFilter] = useState('all');
  const [messageSearch, setMessageSearch] = useState('');
  const [messageStatusFilter, setMessageStatusFilter] = useState('all');
  const navigate = useNavigate();

  const load = useCallback(async () => {
    setError('');
    try {
      const [me, overview, allItems, allMessages, currentProfile] = await Promise.all([
        api.get('/auth/me'), api.get('/admin/overview'), api.get('/admin/items'),
        api.get('/admin/messages'), api.get('/admin/profile')
      ]);
      setUser(me.data.user); setStats(overview.data); setItems(allItems.data); setMessages(allMessages.data); setProfile(currentProfile.data || {});
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) navigate('/admin/login');
      else setError(err.response?.data?.message || 'Could not load the admin workspace.');
    }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  async function logout() {
    try { await api.post('/auth/logout'); } finally { navigate('/'); }
  }
  async function removeItem(id) {
    if (!window.confirm('Delete this portfolio item? This cannot be undone.')) return;
    try { await api.delete(`/admin/items/${id}`); setNotice('Portfolio entry deleted.'); await load(); }
    catch (err) { setNotice(err.response?.data?.message || 'Unable to delete this entry.'); }
  }
  async function saveItem(event) {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    data.technologies = data.technologies ? data.technologies.split(',').map(value => value.trim()).filter(Boolean) : [];
    data.featured = data.featured === 'on'; data.published = data.published === 'on'; data.sortOrder = Number(data.sortOrder || 0);
    setBusy(true);
    try {
      if (editing?._id) await api.put(`/admin/items/${editing._id}`, data);
      else await api.post('/admin/items', data);
      setEditing(null); setNotice('Portfolio entry saved.'); await load();
    } catch (err) { setNotice(err.response?.data?.message || 'Unable to save entry.'); }
    finally { setBusy(false); }
  }
  async function saveProfile(data) {
    setBusy(true);
    try { const response = await api.put('/admin/profile', data); setProfile(response.data); setNotice('Public profile updated.'); }
    catch (err) { setNotice(err.response?.data?.message || 'Unable to save profile.'); }
    finally { setBusy(false); }
  }
  async function changeMessage(id, status) {
    try { await api.patch(`/admin/messages/${id}`, { status }); setNotice(`Message marked ${status}.`); await load(); }
    catch (err) { setNotice(err.response?.data?.message || 'Unable to update message.'); }
  }
  async function deleteMessage(id) {
    if (!window.confirm('Permanently delete this message?')) return;
    try { await api.delete(`/admin/messages/${id}`); setNotice('Message deleted.'); await load(); }
    catch (err) { setNotice(err.response?.data?.message || 'Unable to delete message.'); }
  }

  if (!user && !error) return <main className="admin-loading">Loading admin workspace…</main>;
  if (!user && error) return <main className="admin-loading"><p className="form-error">{error}</p><button className="btn btn-secondary" onClick={load}><RefreshCw size={15}/> Try again</button></main>;

  const filteredItems = items.filter(item => {
    const query = itemSearch.trim().toLowerCase();
    const matchesQuery = !query || [item.title, item.subtitle, item.description, item.category].filter(Boolean).join(' ').toLowerCase().includes(query);
    return matchesQuery && (itemTypeFilter === 'all' || item.type === itemTypeFilter);
  });
  const filteredMessages = messages.filter(message => {
    const query = messageSearch.trim().toLowerCase();
    const matchesQuery = !query || [message.name, message.email, message.subject, message.message].filter(Boolean).join(' ').toLowerCase().includes(query);
    return matchesQuery && (messageStatusFilter === 'all' || message.status === messageStatusFilter);
  });
  const tabs = [['overview','Overview'],['profile','Profile'],['items','Portfolio content'],['messages','Messages']];
  return <main className="admin-shell"><aside className="admin-sidebar">
    <Link to="/" className="brand"><span className="brand-mark">R</span><span>Portfolio CMS<small>ADMIN WORKSPACE</small></span></Link>
    <div className="admin-user">Signed in as<br/><b>{user.name}</b></div>
    {tabs.map(([id,label]) => <button className={tab===id?'admin-nav active':'admin-nav'} key={id} onClick={()=>{setTab(id);setEditing(null);setNotice('');}}><LayoutDashboard size={17}/>{label}</button>)}
    <button className="admin-nav logout" onClick={logout}><LogOut size={17}/>Sign out</button>
  </aside><section className="admin-content">
    <div className="admin-top"><div><span className="eyebrow">CONTENT MANAGEMENT</span><h1>{tab==='overview'?'Overview':tab==='profile'?'Public profile':tab==='items'?'Portfolio content':'Inbox'}</h1></div><div className="form-actions"><button className="btn btn-secondary" onClick={load}><RefreshCw size={15}/> Refresh</button><Link className="btn btn-secondary" to="/">View website <ArrowUpRight size={16}/></Link></div></div>
    {notice && <p className="notice" role="status">{notice}</p>}{error && <p className="form-error" role="alert">{error}</p>}
    {tab==='overview' && <><div className="stat-grid"><div className="stat-card"><span>Portfolio entries</span><b>{stats?.items ?? 0}</b></div><div className="stat-card"><span>Total messages</span><b>{stats?.messages ?? 0}</b></div><div className="stat-card"><span>New messages</span><b>{stats?.unreadMessages ?? 0}</b></div></div><div className="admin-panel"><h3>Welcome to your portfolio CMS</h3><p>Update your public profile, manage projects, experience, skills and certifications, and review messages submitted through your contact form.</p></div></>}
    {tab==='profile' && <ProfileEditor profile={profile} onSave={saveProfile} busy={busy}/>}
    {tab==='items' && <><div className="admin-toolbar"><p>Manage projects, experience, skills and certifications.</p><button className="btn btn-primary" onClick={()=>setEditing({type:'project',title:'',subtitle:'',description:'',technologies:[],published:true})}><Plus size={16}/> Add entry</button></div>
      <div className="admin-filters"><input type="search" value={itemSearch} onChange={event => setItemSearch(event.target.value)} placeholder="Search portfolio entries…" aria-label="Search portfolio entries"/><select value={itemTypeFilter} onChange={event => setItemTypeFilter(event.target.value)} aria-label="Filter portfolio entries by type"><option value="all">All types</option><option value="project">Projects</option><option value="experience">Experience</option><option value="skill">Skills</option><option value="certification">Certifications</option></select><span className="result-count">{filteredItems.length} of {items.length} entries</span></div>
      {editing && <form className="form-card editor-form" onSubmit={saveItem}><h3>{editing._id?'Edit entry':'New entry'}</h3><div className="editor-grid">
        <label>Type<select name="type" defaultValue={editing.type}><option value="project">Project</option><option value="experience">Experience</option><option value="skill">Skill</option><option value="certification">Certification</option></select></label>
        <label>Title<input name="title" required maxLength="180" defaultValue={editing.title}/></label>
        <label>Subtitle / issuer / role<input name="subtitle" defaultValue={editing.subtitle}/></label><label>Category<input name="category" defaultValue={editing.category}/></label>
        <label>Start date<input name="startDate" defaultValue={editing.startDate}/></label><label>End date<input name="endDate" defaultValue={editing.endDate}/></label>
        <label>Technologies (comma separated)<input name="technologies" defaultValue={(editing.technologies||[]).join(', ')}/></label><label>External link / credential URL<input name="link" type="url" defaultValue={editing.link}/></label>
        <label>Image URL<input name="imageUrl" type="url" defaultValue={editing.imageUrl}/></label><label>Skill level<input name="level" defaultValue={editing.level}/></label>
        <label className="full-field">Description<textarea name="description" rows="3" defaultValue={editing.description}/></label>
        <label>Sort order<input name="sortOrder" type="number" defaultValue={editing.sortOrder||0}/></label>
        <label className="check-label"><input name="featured" type="checkbox" defaultChecked={editing.featured}/> Featured</label>
        <label className="check-label"><input name="published" type="checkbox" defaultChecked={editing.published!==false}/> Published</label>
      </div><div className="form-actions"><button className="btn btn-primary" disabled={busy}>{busy?'Saving…':'Save entry'}</button><button type="button" className="btn btn-secondary" onClick={()=>setEditing(null)}>Cancel</button></div></form>}
      <div className="admin-list">{filteredItems.map(item=><div className="admin-list-row" key={item._id}><div><span className="eyebrow">{item.type}{item.published===false?' · DRAFT':''}</span><b>{item.title}</b><small>{item.subtitle}</small></div><div className="row-actions"><button title="Edit" aria-label={`Edit ${item.title}`} onClick={()=>setEditing(item)}><Pencil size={17}/></button><button title="Delete" aria-label={`Delete ${item.title}`} onClick={()=>removeItem(item._id)}><Trash2 size={17}/></button></div></div>)}{!filteredItems.length && <p className="muted admin-empty">{items.length ? 'No entries match these filters.' : 'No entries yet. Add your first portfolio item.'}</p>}</div>
    </>}
    {tab==='messages' && <>
      <div className="admin-filters"><input type="search" value={messageSearch} onChange={event => setMessageSearch(event.target.value)} placeholder="Search name, email or message…" aria-label="Search messages"/><select value={messageStatusFilter} onChange={event => setMessageStatusFilter(event.target.value)} aria-label="Filter messages by status"><option value="all">All statuses</option><option value="new">New</option><option value="read">Read</option><option value="archived">Archived</option></select><span className="result-count">{filteredMessages.length} of {messages.length} messages</span></div>
      <div className="admin-list">{filteredMessages.map(message=><article className="message-row" key={message._id}><div className="message-head"><b>{message.name}</b><span className={`message-status ${message.status}`}>{message.status}</span></div><small>{message.email} · {new Date(message.createdAt).toLocaleString()}</small><h4>{message.subject || 'No subject'}</h4><p>{message.message}</p><div className="row-actions"><a className="reply-link" href={`mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent(`Re: ${message.subject || 'Your portfolio message'}`)}`}>Reply by email</a><button onClick={()=>changeMessage(message._id,'new')}>Mark new</button><button onClick={()=>changeMessage(message._id,'read')}>Mark read</button><button onClick={()=>changeMessage(message._id,'archived')}>Archive</button><button onClick={()=>deleteMessage(message._id)}>Delete</button></div></article>)}{!filteredMessages.length && <p className="muted admin-empty">{messages.length ? 'No messages match these filters.' : 'No messages received yet.'}</p>}</div>
    </>}
  </section></main>;
}

export default function App() {
  const { profile, items, loading, error, reload } = usePortfolio();
  const location = useLocation();
  useEffect(() => {
    const pageTitles = {'/':'Home','/about':'About','/projects':'Projects','/experience':'Experience','/certifications':'Certifications','/contact':'Contact'};
    const pageName = pageTitles[location.pathname] || (location.pathname.startsWith('/admin') ? 'Admin' : 'Page not found');
    document.title = `${pageName} | ${profile.name || 'Engineering Portfolio'}`;
    const description = (profile.summary || 'Software quality engineering, automation and full-stack development portfolio.').slice(0, 300);
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.name = 'description'; document.head.appendChild(meta); }
    meta.content = description;
  }, [location.pathname, profile.name, profile.summary]);
  return <><Header profile={profile}/>
    {error && <div className="container"><p className="form-error" role="alert">{error} <button className="text-link" onClick={reload}>Retry</button></p></div>}
    <Routes>
      <Route path="/" element={<Home profile={profile} items={items}/>}/>
      <Route path="/about" element={<About profile={profile}/>}/>
      <Route path="/projects" element={<ListingPage type="project" title="Selected projects" eyebrow="MY WORK" items={items}/>}/>
      <Route path="/experience" element={<ListingPage type="experience" title="Experience & journey" eyebrow="MY JOURNEY" items={items}/>}/>
      <Route path="/certifications" element={<ListingPage type="certification" title="Certifications & credentials" eyebrow="CONTINUOUS LEARNING" items={items}/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/admin/login" element={<AdminLogin/>}/>
      <Route path="/admin" element={<Admin/>}/>
      <Route path="*" element={<main className="page-main container"><h1>Page not found</h1><Link to="/">Return home</Link></main>}/>
    </Routes>
    {loading && <span className="sr-only" aria-live="polite">Loading portfolio content</span>}
    <Footer profile={profile}/>
  </>;
}
