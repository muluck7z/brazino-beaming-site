import { useGetAuthMe, useAuthLogout } from "@workspace/api-client-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function AuthGate() {
  const { data: user, isLoading } = useGetAuthMe();
  const logout = useAuthLogout();

  const params = new URLSearchParams(window.location.search);
  const authError = params.get("error");

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F4F9F5" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: "40px", height: "40px", border: "3px solid #e2f0e8", borderTopColor: "#1B7340", borderRadius: "50%", margin: "0 auto 12px", animation: "spin 0.8s linear infinite" }} />
          <p style={{ color: "#6B7280", fontFamily: "Inter, sans-serif", fontSize: "0.875rem" }}>Verificando acesso...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (user) {
    return (
      <div style={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
        <iframe
          src="/api/site"
          title="Brazino Beaming"
          style={{ width: "100%", height: "100%", border: "none", display: "block" }}
          allow="autoplay"
        />
        <button
          onClick={() => {
            logout.mutate(undefined, {
              onSuccess: () => {
                window.location.reload();
              },
            });
          }}
          title="Sair"
          style={{
            position: "fixed",
            bottom: "1.25rem",
            right: "1.25rem",
            background: "rgba(255,255,255,0.92)",
            border: "1.5px solid #1B7340",
            borderRadius: "8px",
            color: "#1B7340",
            padding: "0.4rem 0.875rem",
            fontSize: "0.75rem",
            fontFamily: "Inter, sans-serif",
            fontWeight: 600,
            cursor: "pointer",
            backdropFilter: "blur(8px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "0.4rem",
            boxShadow: "0 2px 8px rgba(13,40,24,0.12)",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Sair
        </button>
      </div>
    );
  }

  const isNoAccess = authError === "no_access";
  const isAuthFailed = authError === "auth_failed";

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        body{background:#F4F9F5}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        .login-btn:hover{background:#155d33!important;box-shadow:0 6px 20px rgba(27,115,64,.45)!important;transform:translateY(-1px)}
        .login-btn:active{transform:translateY(0)!important}
        .discord-btn:hover{background:#4752c4!important;box-shadow:0 6px 20px rgba(88,101,242,.45)!important;transform:translateY(-1px)}
      `}</style>

      <div style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#F4F9F5",
        fontFamily: "Inter, sans-serif",
        padding: "1.5rem",
      }}>
        <div style={{ width: "100%", maxWidth: "420px", animation: "fadeUp 0.4s ease both" }}>

          {/* Logo + header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "72px",
              height: "72px",
              borderRadius: "18px",
              border: "2px solid #1B7340",
              boxShadow: "0 4px 16px rgba(27,115,64,0.18)",
              marginBottom: "1rem",
              overflow: "hidden",
              background: "#fff",
            }}>
              <img
                src="https://raw.githubusercontent.com/muluck7z/brazino-beaming-site/main/logo-brazino.jpg"
                alt="Brazino"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>
            <h1 style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "#0D2818",
              fontFamily: "Poppins, sans-serif",
              letterSpacing: "-0.01em",
            }}>
              BRAZINO BEAMING
            </h1>
            <p style={{ marginTop: "0.35rem", fontSize: "0.85rem", color: "#6B7280", fontWeight: 500 }}>
              Área exclusiva para membros
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: "#fff",
            border: "1px solid rgba(27,115,64,0.15)",
            borderRadius: "16px",
            padding: "1.75rem",
            boxShadow: "0 4px 24px rgba(13,40,24,0.08)",
          }}>

            {/* Error: no access */}
            {isNoAccess && (
              <div style={{
                background: "#FEF2F2",
                border: "1px solid #FECACA",
                borderRadius: "10px",
                padding: "0.875rem 1rem",
                marginBottom: "1.25rem",
                display: "flex",
                gap: "0.625rem",
                alignItems: "flex-start",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px" }}>
                  <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <div>
                  <p style={{ color: "#DC2626", fontWeight: 700, fontSize: "0.8rem" }}>Acesso negado</p>
                  <p style={{ color: "#B91C1C", fontSize: "0.775rem", marginTop: "0.15rem", lineHeight: 1.4 }}>
                    Você não possui o cargo necessário no servidor Discord.
                  </p>
                </div>
              </div>
            )}

            {/* Error: auth failed */}
            {isAuthFailed && (
              <div style={{
                background: "#FFFBEB",
                border: "1px solid #FDE68A",
                borderRadius: "10px",
                padding: "0.875rem 1rem",
                marginBottom: "1.25rem",
                display: "flex",
                gap: "0.625rem",
                alignItems: "flex-start",
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px" }}>
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <p style={{ color: "#D97706", fontWeight: 700, fontSize: "0.8rem" }}>Falha na autenticação</p>
                  <p style={{ color: "#B45309", fontSize: "0.775rem", marginTop: "0.15rem", lineHeight: 1.4 }}>
                    Erro ao conectar com o Discord. Tente novamente.
                  </p>
                </div>
              </div>
            )}

            {/* Info */}
            <div style={{
              background: "#F0FBF4",
              border: "1px solid rgba(57,211,83,0.25)",
              borderRadius: "10px",
              padding: "0.875rem 1rem",
              marginBottom: "1.5rem",
              display: "flex",
              gap: "0.625rem",
              alignItems: "flex-start",
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1B7340" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px" }}>
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <p style={{ color: "#0D2818", fontSize: "0.8rem", lineHeight: 1.55 }}>
                Conteúdo exclusivo para membros com cargo no servidor{" "}
                <strong style={{ color: "#1B7340" }}>Brazino Beaming</strong>.
                Faça login com Discord para verificar seu acesso.
              </p>
            </div>

            {/* Discord login button */}
            <a
              href="/api/auth/discord"
              className="discord-btn"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.625rem",
                width: "100%",
                padding: "0.8rem 1.25rem",
                background: "#5865F2",
                color: "#fff",
                borderRadius: "10px",
                fontWeight: 700,
                fontSize: "0.9rem",
                fontFamily: "Poppins, sans-serif",
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(88,101,242,0.35)",
                transition: "all 0.18s ease",
                cursor: "pointer",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.001.022.015.043.032.055a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
              </svg>
              Entrar com Discord
            </a>

            <p style={{ textAlign: "center", marginTop: "1rem", color: "#9CA3AF", fontSize: "0.72rem" }}>
              Somente membros com o cargo autorizado terão acesso.
            </p>
          </div>

          {/* Footer */}
          <p style={{ textAlign: "center", marginTop: "1.5rem", color: "#9CA3AF", fontSize: "0.72rem" }}>
            © 2025 Brazino Beaming — Todos os direitos reservados
          </p>
        </div>
      </div>
    </>
  );
}

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate />
    </QueryClientProvider>
  );
}

export default App;
