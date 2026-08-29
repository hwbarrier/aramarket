import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { describe, expect, it, beforeEach } from "vitest";
import { AuthProvider } from "../../contexts/AuthContext";
import { ProtectedRoute } from "../../router/ProtectedRoute";
import { AdminDashboardPage } from "./AdminDashboardPage";
import { AdminShell } from "./AdminShell";

function renderAdmin(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Routes>
          <Route path="/admin/*" element={<ProtectedRoute role="admin"><AdminShell><AdminDashboardPage /></AdminShell></ProtectedRoute>} />
          <Route path="/404" element={<p>Accès refusé</p>} />
        </Routes>
      </AuthProvider>
    </MemoryRouter>,
  );
}

describe("Admin Center", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("refuse l'accès aux utilisateurs non administrateurs", async () => {
    localStorage.setItem("user", JSON.stringify({ id: "1", email: "client@test.fr", name: "Client", role: "client", permissions: ["buy_products"], createdAt: "", isVerified: true }));
    renderAdmin("/admin/dashboard");
    expect(await screen.findByText("Accès refusé")).toBeInTheDocument();
  });

  it("affiche le pilotage et sa navigation pour un administrateur", async () => {
    localStorage.setItem("user", JSON.stringify({ id: "1", email: "admin@test.fr", name: "Admin", role: "admin", permissions: [], createdAt: "", isVerified: true }));
    renderAdmin("/admin/dashboard");
    expect(await screen.findByText("Pilotage marketplace")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Vendeurs/i })).toBeInTheDocument();
  });
});
