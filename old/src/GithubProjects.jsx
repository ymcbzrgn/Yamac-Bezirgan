import React, { useEffect, useState } from 'react';

function RepoCard({ repo }){
  const [imgSrc, setImgSrc] = useState(null);
  useEffect(() => {
    const tryImg = (url) => {
      return new Promise((res) => {
        const img = new Image();
        img.onload = () => res(url);
        img.onerror = () => res(null);
        img.src = url;
      });
    };

    (async ()=>{
      // 1) Try repo-root file on GitHub: portfolioWebsiteImage{, .png, .jpg, .jpeg, .webp}
      const owner = repo.owner && repo.owner.login;
      const branch = repo.default_branch || 'main';
      const name = encodeURIComponent(repo.name);
      const exts = ['', '.png', '.jpg', '.jpeg', '.webp'];
      let found = null;
      if(owner){
        for(const ext of exts){
          const url = `https://raw.githubusercontent.com/${owner}/${name}/${branch}/portfolioWebsiteImage${ext}`;
          // try image load
          /* eslint-disable no-await-in-loop */
          const ok = await tryImg(url);
          if(ok){ found = ok; break }
        }
      }

      // 2) Try local public/projects/<repo> (png/jpg)
      if(!found){
        const localPng = `/projects/${repo.name}.png`;
        const localJpg = `/projects/${repo.name}.jpg`;
        found = await tryImg(localPng) || await tryImg(localJpg);
      }

      // 3) Final fallback to site logo
      if(!found){
        found = '/legacy/LOGO.png';
      }

      setImgSrc(found);
    })();
  },[repo]);

  return (
    <div className="project-card">
      {imgSrc ? <img className="project-media" src={imgSrc} alt={`${repo.name} preview`} onError={(e)=>{e.currentTarget.style.display='none'}} /> : <div className="project-media" aria-hidden></div>}
      <div className="project-body">
        <h4 className="mono">{repo.name}</h4>
        <p className="muted small">{repo.description}</p>
        <div className="project-actions">
          <a className="btn" href={repo.html_url} target="_blank" rel="noreferrer">Repo</a>
          {repo.homepage && <a className="btn" href={repo.homepage} target="_blank" rel="noreferrer">Demo</a>}
        </div>
      </div>
    </div>
  )
}

export default function GithubProjects({ username='ymcbzrgn', limit=3, preferred = [] }){
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    async function fetchRepos(){
      try{
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        if(!res.ok){
          const text = await res.text();
          throw new Error(`GitHub API error: ${res.status} ${res.statusText} ${text}`);
        }
        const data = await res.json();
        if(!mounted) return;
        if(Array.isArray(data)){
          const filtered = data.filter(r => !r.fork).sort((a,b)=>new Date(b.updated_at)-new Date(a.updated_at));

          // If user provided preferred repo names, try to surface them first in the requested order.
          if(Array.isArray(preferred) && preferred.length){
            const norm = (s='') => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
            const map = new Map(filtered.map(r=>[norm(r.name), r]));
            const used = new Set();
            const ordered = [];

            for(const p of preferred){
              const key = norm(p);
              const repo = map.get(key);
              if(repo){ ordered.push(repo); used.add(repo.id) }
            }

            // append remaining repos preserving original sort order
            for(const r of filtered){ if(!used.has(r.id)) ordered.push(r) }
            setRepos(ordered);
          } else {
            setRepos(filtered);
          }
        } else {
          setRepos([]);
        }
      }catch(e){
        console.error('Failed to fetch GitHub repos', e);
        setRepos([]);
        setError(e.message || 'Failed to fetch repositories');
      }finally{
        setLoading(false);
      }
    }
    fetchRepos();
    return ()=>{mounted=false}
  },[username]);

  if(loading) return <div className="card">Loading projects…</div>
  if(!repos.length) return <div className="card">{error ? `Error: ${error}` : 'No public projects found.'}</div>

  return (
    <div>
      <div className="projects-grid">
        {repos.slice(0, limit).map(r => <RepoCard key={r.id} repo={r} />)}
      </div>
      {repos.length > limit && (
        <div style={{marginTop:12}}>
          <a className="btn" href="/extra-projects.html">See all projects</a>
        </div>
      )}
    </div>
  )
}
