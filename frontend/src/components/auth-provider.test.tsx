import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const keycloak = vi.hoisted(() => ({
  authenticated: true,
  init: vi.fn().mockResolvedValue(true),
  login: vi.fn().mockResolvedValue(undefined),
  logout: vi.fn().mockResolvedValue(undefined),
  updateToken: vi.fn().mockResolvedValue(false),
  token: "access-token",
  tokenParsed: {
    given_name: "Luis",
    family_name: "Flores",
    email: "owner@equiply.local",
  },
  realmAccess: { roles: ["OWNER"] },
  onTokenExpired: undefined as (() => void) | undefined,
}));

vi.mock("keycloak-js", () => ({
  default: class KeycloakMock {
    authenticated = keycloak.authenticated;
    init = keycloak.init;
    login = keycloak.login;
    logout = keycloak.logout;
    updateToken = keycloak.updateToken;
    token = keycloak.token;
    tokenParsed = keycloak.tokenParsed;
    realmAccess = keycloak.realmAccess;
    onTokenExpired = keycloak.onTokenExpired;
  },
}));

import { AuthProvider, useEquiplyAuth } from "./auth-provider";

describe("AuthProvider", () => {
  beforeEach(() => {
    keycloak.init.mockClear();
  });

  it("initializes Keycloak with the secure browser flow and exposes identity", async () => {
    render(
      <AuthProvider>
        <IdentityProbe />
      </AuthProvider>,
    );

    expect(await screen.findByText("Luis Flores")).toBeInTheDocument();
    expect(screen.getByText("OWNER")).toBeInTheDocument();
    expect(keycloak.init).toHaveBeenCalledWith({
      onLoad: "login-required",
      checkLoginIframe: false,
      pkceMethod: "S256",
    });
  });
});

function IdentityProbe() {
  const { user, roles } = useEquiplyAuth();
  return <div>{user?.name}<span>{roles.join(",")}</span></div>;
}
