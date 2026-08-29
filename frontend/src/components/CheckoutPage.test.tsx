import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CheckoutPage } from "./CheckoutPage";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import { LocalizationProvider } from "../contexts/LocalizationContext";

describe("CheckoutPage", () => {
  it("announces required field errors", async () => {
    render(
      <AuthProvider><LocalizationProvider><CartProvider>
        <CheckoutPage onBack={() => undefined} onPlaceOrder={() => undefined} />
      </CartProvider></LocalizationProvider></AuthProvider>,
    );
    expect(screen.getByRole("heading", { name: /checkout/i })).toBeInTheDocument();
    fireEvent.submit(screen.getByRole("button", { name: /commander|place order/i }).closest("form")!);
    expect(screen.getByRole("alert")).toHaveTextContent(/panier est vide/i);
  });
});
