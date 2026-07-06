import { useEffect, useState, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import '../src/App'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ── Icons ────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    <line x1="8" y1="18" x2="21" y2="18"/>
    <circle cx="3" cy="6" r="1.5" fill="currentColor"/>
    <circle cx="3" cy="12" r="1.5" fill="currentColor"/>
    <circle cx="3" cy="18" r="1.5" fill="currentColor"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const CopyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

// ── Modal pour afficher l'image en grand ────────────────────────────────────
function ImageModal({ mpianatra, onClose }) {
  const [copied, setCopied] = useState(false);

  // URL de la page avec l'ID du membre
  const memberUrl = `${window.location.origin}${window.location.pathname}?pseudo=${encodeURIComponent(mpianatra.id_mpianatra)}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(memberUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Erreur copie:', err);
    }
  };

  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" style={{ maxWidth: "450px" }}>
        <button className="modal-close" onClick={onClose}><CloseIcon /></button>
        <div className="modal-img-wrap">
          <img
            src={mpianatra.lien}
            alt={mpianatra.name}
            className="modal-img"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mpianatra.name)}&background=2563eb&color=ffffff&bold=true&size=400`;
            }}
          />
        </div>
        <div className="modal-body" style={{ textAlign: "center" }}>
          <h2 className="modal-name">{mpianatra.name}</h2>
          <p className="modal-fullname" style={{ fontSize: "18px", fontFamily: "monospace", marginTop: "8px" }}>
            {mpianatra.matricule}
          </p>

          <button 
            onClick={copyToClipboard}
            style={{
              background: copied ? "#10b981" : "#2563eb",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: "600",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              justifyContent: "center",
              width: "100%",
              transition: "background 0.2s"
            }}
          >
            <CopyIcon />
            {copied ? "Copié !" : "Copier le lien"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Carte membre ────────────────────────────────────────────────────────────
function MpianatraCard({ mpianatra, index, view, onClick }) {
  if (view === "list") {
    return (
      <article
        className="list-item appear"
        style={{ animationDelay: `${index * 50}ms` }}
        onClick={() => onClick(mpianatra)}
      >
        <div className="list-avatar-wrap">
          <img
            src={mpianatra.lien}
            alt={mpianatra.name}
            className="list-avatar"
            onError={(e) => {
              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mpianatra.name)}&background=2563eb&color=ffffff&bold=true&size=80`;
            }}
          />
        </div>
        <div className="list-info">
          <span className="list-pseudo">{mpianatra.name}</span>
          <span className="list-nom" style={{ fontSize: "12px", fontFamily: "monospace" }}>{mpianatra.matricule}</span>
        </div>
        <span className="list-arrow">→</span>
      </article>
    );
  }

  return (
    <article
      className="card appear"
      style={{ animationDelay: `${index * 70}ms` }}
      onClick={() => onClick(mpianatra)}
    >
      <div className="card-img-wrap">
        <img
          src={mpianatra.lien}
          alt={mpianatra.name}
          className="card-img"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(mpianatra.name)}&background=2563eb&color=ffffff&bold=true&size=300`;
          }}
        />
        <div className="card-overlay">
          <span className="card-cta">Voir la photo →</span>
        </div>
      </div>
      <div className="card-body">
        <div className="card-top">
          <span className="card-id">#{mpianatra.id_mpianatra}</span>
        </div>
        <h2 className="card-pseudo">{mpianatra.name}</h2>
        <p className="card-nom" style={{ fontSize: "12px", fontFamily: "monospace" }}>{mpianatra.matricule}</p>
      </div>
    </article>
  );
}

// ── Composant principal ─────────────────────────────────────────────────────
export default function MpianatraList() {
  const [mpianatra, setMpianatra] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("list");
  const [sort, setSort] = useState("id");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchMpianatra();
  }, []);

  async function fetchMpianatra() {
    const { data, error } = await supabase
      .from("membre")
      .select("*")
      .order("id_mpianatra", { ascending: true });

    if (error) {
      console.error("Erreur:", error);
    } else {
      console.log("DONNÉES BRUTES:", data);
      console.log("PREMIER ÉLÉMENT:", data[0]);
    }

    if (!error) setMpianatra(data || []);
    setLoading(false);
  }

  // 🔍 Détection du paramètre 'pseudo' dans l'URL pour ouvrir automatiquement le modal
  useEffect(() => {
    if (mpianatra.length > 0) {
      const urlParams = new URLSearchParams(window.location.search);
      const pseudoFromUrl = urlParams.get('pseudo');

      if (pseudoFromUrl) {
        // Chercher le membre dont l'id_mpianatra correspond à la valeur
        const member = mpianatra.find(m => String(m.id_mpianatra) === pseudoFromUrl);
        if (member) {
          setSelected(member);
          // Nettoyer l'URL sans recharger la page
          const newUrl = window.location.pathname;
          window.history.replaceState({}, '', newUrl);
        }
      }
    }
  }, [mpianatra]); // Déclenché quand les données sont chargées

  const filtered = useMemo(() => {
    let list = mpianatra.filter((m) => {
      const q = search.toLowerCase();
      return !q || 
        m.name?.toLowerCase().includes(q) || 
        m.matricule?.toLowerCase().includes(q);
    });

    list = [...list].sort((a, b) => {
      if (sort === "name") return (a.name || "").localeCompare(b.name || "");
      if (sort === "matricule") return (a.matricule || "").localeCompare(b.matricule || "");
      return a.id_mpianatra - b.id_mpianatra;
    });

    return list;
  }, [mpianatra, search, sort]);

  if (loading) {
    return (
      <div className="loader-screen">
        <div className="loader-ring" />
        <p className="loader-text">Chargement des membres…</p>
      </div>
    );
  }

  return (
    <>
      <header className="site-header">
        <p className="header-eyebrow">Annuaire</p>
        <div className="flex justify-center">
          <img className="w-[300px] lg:w-[500px]" src="/img/Logo_Emitech.png" alt="Logo" />
        </div>
        <div className="header-divider" />
        <p className="header-sub">Liste des membres</p>
        <div className="header-count">{mpianatra.length} membre{mpianatra.length !== 1 ? "s" : ""}</div>
      </header>

      <div className="toolbar">
        <div className="search-wrap">
          <span className="search-icon"><SearchIcon /></span>
          <input
            className="search-input"
            type="text"
            placeholder="Rechercher par nom ou matricule..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="id">Trier par défaut</option>
          <option value="name">Trier par nom</option>
          <option value="matricule">Trier par matricule</option>
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
        </p>

        {filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">👥</div>
            <p className="empty-title">Aucun membre trouvé</p>
            <p className="empty-sub">Essayez de modifier votre recherche</p>
          </div>
        ) : view === "grid" ? (
          <div className="cards-grid">
            {filtered.map((m, i) => (
              <MpianatraCard key={m.id_mpianatra} mpianatra={m} index={i} view="grid" onClick={setSelected} />
            ))}
          </div>
        ) : (
          <div className="list-view">
            {filtered.map((m, i) => (
              <MpianatraCard key={m.id_mpianatra} mpianatra={m} index={i} view="list" onClick={setSelected} />
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

      {selected && (
        <ImageModal mpianatra={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}