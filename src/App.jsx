import { useEffect, useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import './App.css'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const GridIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
);
const ListIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
    <line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1.5" fill="currentColor"/>
    <circle cx="3" cy="12" r="1.5" fill="currentColor"/><circle cx="3" cy="18" r="1.5" fill="currentColor"/>
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── Modal ────────────────────────────────────────────────────────────────────
function MemberModal({ membre, onClose }) {
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}><CloseIcon /></button>
        <div className="modal-img-wrap">
          <img
            src={membre.lien_image}
            alt={membre.nom}
            className="modal-img"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(membre.nom)}&background=2563eb&color=ffffff&bold=true&size=400`;
            }}
          />
        </div>
        <div className="modal-body">
          <span className="modal-badge">{membre.post}</span>
          <h2 className="modal-name">{membre.pseudo}</h2>
          <p className="modal-fullname">{membre.nom}</p>
          {membre.bio && <p className="modal-bio">{membre.bio}</p>}
          <div className="modal-meta">
            {membre.email && (
              <a href={`mailto:${membre.email}`} className="modal-link">
                📧 {membre.email}
              </a>
            )}
            {membre.linkedin && (
              <a href={membre.linkedin} target="_blank" rel="noopener noreferrer" className="modal-link">
                🔗 LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Card ─────────────────────────────────────────────────────────────────────
function MemberCard({ membre, index, view, onClick }) {
  if (view === "list") {
    return (
      <article
        className="list-item appear"
        style={{ animationDelay: `${index * 50}ms` }}
        onClick={() => onClick(membre)}
      >
        <div className="list-avatar-wrap">
          <img
            src={membre.lien_image}
            alt={membre.nom}
            className="list-avatar"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(membre.nom)}&background=2563eb&color=ffffff&bold=true&size=80`;
            }}
          />
        </div>
        <div className="list-info">
          <span className="list-pseudo">{membre.pseudo}</span>
          <span className="list-nom">{">> "+membre.nom}</span>
        </div>
        <span className="badge-sm">{membre.post}</span>
        <span className="list-arrow">→</span>
      </article>
    );
  }

  return (
    <article
      className="card appear"
      style={{ animationDelay: `${index * 70}ms` }}
      onClick={() => onClick(membre)}
    >
      <div className="card-img-wrap">
        <img
          src={membre.lien_image}
          alt={membre.nom}
          className="card-img"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(membre.nom)}&background=2563eb&color=ffffff&bold=true&size=300`;
          }}
        />
        <div className="card-overlay">
          <span className="card-cta">Voir le profil →</span>
        </div>
      </div>
      <div className="card-body">
        <div className="card-top">
          <span className="badge-sm">{membre.post}</span>
          <span className="card-id">#{String(membre.id).padStart(2, "0")}</span>
        </div>
        <h2 className="card-pseudo">{membre.pseudo}</h2>
        <p className="card-nom">{membre.nom}</p>
      </div>
    </article>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activePost, setActivePost] = useState("Tous");
  const [view, setView] = useState("list");
  const [sort, setSort] = useState("id");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchMembres();
  }, []);

  async function fetchMembres() {
    const { data, error } = await supabase
      .from("membreEmitech")
      .select("*")
      .order("id", { ascending: true });
    if (!error) setMembres(data || []);
    setLoading(false);
  }

  const posts = useMemo(() => {
    const unique = [...new Set(membres.map((m) => m.post).filter(Boolean))];
    return ["Tous", ...unique];
  }, [membres]);

  const filtered = useMemo(() => {
    let list = membres.filter((m) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        m.pseudo?.toLowerCase().includes(q) ||
        m.nom?.toLowerCase().includes(q) ||
        m.post?.toLowerCase().includes(q);
      const matchPost = activePost === "Tous" || m.post === activePost;
      return matchSearch && matchPost;
    });

    list = [...list].sort((a, b) => {
      if (sort === "nom") return (a.nom || "").localeCompare(b.nom || "");
      if (sort === "post") return (a.post || "").localeCompare(b.post || "");
      return a.id - b.id;
    });

    return list;
  }, [membres, search, activePost, sort]);

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader-ring" />
        <p className="loader-text">Chargement de l'équipe…</p>
      </div>
    );
  }

  return (
    <>
      <style>{`

      `}</style>

      <header className="site-header">
        <p className="header-eyebrow">Notre Équipe</p>
        <div className="flex justify-center">
          <img className="w-[300px] lg:w-[500px]" src="/img/Logo_Emitech.png" alt="" />
        </div>
        <div className="header-divider" />
        <p className="header-sub">Des talents exceptionnels au service de l'innovation</p>
        <div className="header-count">{membres.length} membre{membres.length !== 1 ? "s" : ""}</div>
      </header>

      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon"><SearchIcon /></span>
          <input
            className="search-input"
            type="text"
            placeholder="Rechercher un membre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="id">Trier par défaut</option>
          <option value="nom">Trier par nom</option>
          <option value="post">Trier par poste</option>
        </select>

        <div className="view-btns">
          <button className={`view-btn ${view === "grid" ? "active" : ""}`} onClick={() => setView("grid")} title="Vue grille">
            <GridIcon />
          </button>
          <button className={`view-btn ${view === "list" ? "active" : ""}`} onClick={() => setView("list")} title="Vue liste">
            <ListIcon />
          </button>
        </div>
      </div>


      <main className="main">
        <p className="results-label">
          {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
          {search && ` pour "${search}"`}
          {activePost !== "Tous" && ` · ${activePost}`}
        </p>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">👥</div>
            <p className="empty-title">Aucun membre trouvé</p>
            <p className="empty-sub">Essayez de modifier votre recherche ou vos filtres</p>
          </div>
        ) : view === "grid" ? (
          <div className="cards-grid">
            {filtered.map((membre, i) => (
              <MemberCard key={membre.id} membre={membre} index={i} view="grid" onClick={setSelected} />
            ))}
          </div>
        ) : (
          <div className="list-view">
            {filtered.map((membre, i) => (
              <MemberCard key={membre.id} membre={membre} index={i} view="list" onClick={setSelected} />
            ))}
          </div>
        )}
      </main>

      <footer className="site-footer">
        <div className="flex justify-center mb-[10px]">
          <img className="w-[100px]" src="/img/Logo_Emitech.png" alt="" />
        </div>
        <p className="footer-copy">© 2026 — Tous droits réservés</p>
      </footer>

      {selected && <MemberModal membre={selected} onClose={() => setSelected(null)} />}
    </>
  );
}