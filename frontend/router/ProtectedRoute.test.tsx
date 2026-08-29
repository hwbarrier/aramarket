import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";

function renderRole(role: "client" | "vendor" | "admin", requiredRole: "vendor" | "admin") {
  localStorage.setItem("user", JSON.stringify({
    id: "user-1",
    email: `${role}@test.fr`,
    name: role,
    role,
    permissions: [],
    createdAt: "",
    isVerified: true,
  }));
  return render(
    <MemoryRouter initialEntries={["/protected"]}>
      <AuthProvider>
        <Routes>
          <Route path="/protected" element={<ProtectedRoute role={requiredRole}><p>Accès autorisé</p></ProtectedRoute>} />
          <Route path="/404" element={<p>Accès refusé</p>} />
          <Route path="/login" element={<p>Connexion requise</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("ProtectedRoute", () => {
  beforeEach(() => localStorage.clear());

  it("refuse un client sur une route vendeur ou admin", async () => {
    renderRole("client", "vendor");
    expect(await screen.findByText("Accès refusé")).toBeInTheDocument();
  });

  it("refuse un vendeur sur une route admin", async () => {
    renderRole("vendor", "admin");
    expect(await screen.findByText("Accès refusé")).toBeInTheDocument();
  });

  it("autorise un administrateur sur une route admin", async () => {
    renderRole("admin", "admin");
    expect(await screen.findByText("Accès autorisé")).toBeInTheDocument();
  });
});
