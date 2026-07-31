"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Keycloak from "keycloak-js";
import { AlertTriangle, LoaderCircle, RotateCcw } from "lucide-react";

type AuthStatus = "loading" | "authenticated" | "error";

type AuthUser = {
  name: string;
  email: string;
  initials: string;
};

type AuthContextValue = {
  status: AuthStatus;
  user: AuthUser | null;
  roles: string[];
  getAccessToken: () => Promise<string>;
  logout: () => Promise<void>;
};

const unavailableAuth: AuthContextValue = {
  status: "loading",
  user: null,
  roles: [],
  getAccessToken: async () => {
    throw new Error("Authentication is not ready");
  },
  logout: async () => undefined,
};

const AuthContext = createContext<AuthContextValue>(unavailableAuth);
const demoMode = process.env.NEXT_PUBLIC_DEMO_MODE === "true";
const demoUser = { name: "Luis Flores", email: "owner@equiply.demo", initials: "LF" };

export function AuthProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const keycloakRef = useRef<Keycloak | null>(null);
  const initializationStarted = useRef(false);
  const [status, setStatus] = useState<AuthStatus>(demoMode ? "authenticated" : "loading");
  const [user, setUser] = useState<AuthUser | null>(demoMode ? demoUser : null);
  const [roles, setRoles] = useState<string[]>(demoMode ? ["OWNER"] : []);
  const [errorMessage, setErrorMessage] = useState("No se pudo conectar con el servicio de identidad.");

  useEffect(() => {
    if (initializationStarted.current) return;
    initializationStarted.current = true;

    if (demoMode) return;

    const client = new Keycloak({
      url: process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? "http://localhost:8180",
      realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? "equiply",
      clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? "equiply-web",
    });
    keycloakRef.current = client;

    client.onTokenExpired = () => {
      void client.updateToken(30).catch(() => {
        setErrorMessage("Tu sesión expiró. Vuelve a iniciar sesión para continuar.");
        setStatus("error");
      });
    };

    void client
      .init({
        onLoad: "login-required",
        checkLoginIframe: false,
        pkceMethod: "S256",
      })
      .then((authenticated) => {
        if (!authenticated) {
          return client.login({ redirectUri: window.location.href });
        }

        const claims = client.tokenParsed;
        const firstName = stringClaim(claims?.given_name);
        const lastName = stringClaim(claims?.family_name);
        const email = stringClaim(claims?.email) || stringClaim(claims?.preferred_username);
        const name = [firstName, lastName].filter(Boolean).join(" ") || email || "Usuario Equiply";

        setUser({
          name,
          email,
          initials: initialsFor(name),
        });
        setRoles(client.realmAccess?.roles ?? []);
        setStatus("authenticated");
      })
      .catch(() => {
        setStatus("error");
      });
  }, []);

  async function getAccessToken() {
    if (demoMode) return "demo-token";
    const client = keycloakRef.current;
    if (!client?.authenticated) throw new Error("An authenticated session is required");

    await client.updateToken(30);
    if (!client.token) throw new Error("The access token is unavailable");
    return client.token;
  }

  async function logout() {
    if (demoMode) {
      window.location.assign(process.env.NEXT_PUBLIC_BASE_PATH || "/");
      return;
    }
    const client = keycloakRef.current;
    if (!client) return;
    await client.logout({ redirectUri: window.location.origin });
  }

  if (status === "loading") {
    return (
      <main id="main-content" className="grid min-h-screen place-items-center bg-[#151824] px-5 text-white">
        <div role="status" className="text-center">
          <LoaderCircle aria-hidden="true" className="mx-auto size-8 animate-spin text-[#b8e845]" />
          <p className="mt-5 font-heading text-xl font-bold">Abriendo tu espacio de trabajo</p>
          <p className="mt-2 text-sm text-white/70">Validando la sesión con Keycloak...</p>
        </div>
      </main>
    );
  }

  if (status === "error") {
    return (
      <main id="main-content" className="grid min-h-screen place-items-center bg-[#f4f2ec] px-5 text-[#171a24]">
        <div role="alert" className="max-w-md rounded-[24px] border border-[#edc8b9] bg-white p-7 text-center shadow-xl">
          <span className="mx-auto grid size-11 place-items-center rounded-xl bg-[#fff0e9] text-[#a23c27]">
            <AlertTriangle aria-hidden="true" className="size-5" />
          </span>
          <h1 className="mt-5 font-heading text-2xl font-bold tracking-[-0.035em]">No pudimos iniciar la sesión</h1>
          <p className="mt-3 text-sm leading-6 text-[#555861]">{errorMessage}</p>
          <button
            type="button"
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#171a24] px-5 text-sm font-bold text-white hover:bg-[#2b3041]"
            onClick={() => window.location.reload()}
          >
            <RotateCcw aria-hidden="true" className="size-4" /> Reintentar
          </button>
        </div>
      </main>
    );
  }

  return (
    <AuthContext value={{ status, user, roles, getAccessToken, logout }}>
      {children}
    </AuthContext>
  );
}

export function useEquiplyAuth() {
  return useContext(AuthContext);
}

function stringClaim(value: unknown) {
  return typeof value === "string" ? value : "";
}

function initialsFor(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
