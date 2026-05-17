import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default function App() {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembres();
  }, []);

  async function fetchMembres() {
    const { data, error } = await supabase
      .from("membreEmitech")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setMembres(data);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-6 w-12 h-12 border-2 border-gray-200 border-t-[#05053e] rounded-full animate-spin" />
          <p className="text-[#05053e] text-lg tracking-wide font-['Playfair_Display',_Georgia,_serif]">
            Chargement…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-white via-gray-50 to-white min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        
        * { box-sizing: border-box; }
        
        .card {
          background: #fff;
          border: 1px solid #ececec;
          border-radius: 16px;
          overflow: hidden;
          transition: box-shadow 0.3s ease, transform 0.3s ease;
        }
        .card:hover {
          box-shadow: 0 20px 60px rgba(5,5,62,0.10);
          transform: translateY(-6px);
        }
        .card-img {
          width: 100%;
          height: 260px;
          object-fit: cover;
          display: block;
          transition: transform 0.5s ease;
        }
        .card:hover .card-img {
          transform: scale(1.05);
        }
        .card-img-wrap {
          overflow: hidden;
          position: relative;
        }
        .card-img-wrap::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(5,5,62,0.07) 100%);
          pointer-events: none;
        }
        .badge {
          display: inline-block;
          padding: 5px 14px;
          border-radius: 100px;
          background: #f0f4ff;
          color: #05053e;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          border: 1px solid #dbe4ff;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
          gap: 28px;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .appear {
          opacity: 0;
          animation: fadeUp 0.55s ease-out forwards;
        }
        .divider {
          width: 48px;
          height: 3px;
          background: #05053e;
          border-radius: 2px;
          margin: 18px auto 0;
        }
      `}</style>

      {/* ─── HEADER ─── */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100 py-20 px-6 text-center">
        {/* Eyebrow label */}
        <p className="text-[11px] font-medium tracking-[0.18em] uppercase text-[#92cdfa] mb-4">
          Notre Équipe
        </p>

        {/* Main title */}
        <h1 className="text-[clamp(52px,10vw,88px)] font-black text-[#05053e] leading-none tracking-[-0.02em]">
          EMI<span className="text-[#92cdfa]">TECH</span>
        </h1>

        <div className="divider" />

        <p className="mt-5 font-light text-base text-gray-500 max-w-md mx-auto leading-relaxed">
          Découvrez les membres des bureaux talentueux qui font rayonner notre organisation
        </p>
      </header>

      {/* ─── MEMBERS GRID ─── */}
      <main className="max-w-6xl mx-auto py-[72px] px-6">
        {membres.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-[#05053e] mb-2">
              Aucun membre trouvé
            </p>
            <p className="text-gray-400 text-sm">
              Les membres seront bientôt ajoutés
            </p>
          </div>
        ) : (
          <div className="grid">
            {membres.map((membre, index) => (
              <article
                key={membre.id}
                className="card appear"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                {/* Photo */}
                <div className="card-img-wrap">
                  <img
                    src={membre.lien_image}
                    alt={membre.nom}
                    className="card-img"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        membre.nom
                      )}&background=dbe4ff&color=05053e&bold=true&size=260`;
                    }}
                  />
                </div>

                {/* Info */}
                <div className="p-6 pb-7">
                  {/* Pseudo */}
                  <h2 className="text-[22px] font-bold text-[#05053e] mb-1 font-['DM_Sans',_sans-serif]">
                    {membre.pseudo}
                  </h2>

                  {/* Nom complet */}
                  <p className="text-sm text-gray-400 font-normal mb-4 tracking-[0.01em] font-['DM_Sans',_sans-serif]">
                    {membre.nom}
                  </p>

                  {/* Poste badge */}
                  <span className="badge">{membre.post}</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-gray-100 py-9 px-6 text-center bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <p className="text-lg font-bold text-[#05053e] mb-1.5 font-['DM_Sans',_sans-serif]">
          EMITECH
        </p>
        <p className="text-xs text-gray-400 font-light font-['DM_Sans',_sans-serif]">
          © 2024 — Tous droits réservés · Une organisation innovante
        </p>
      </footer>
    </div>
  );
}