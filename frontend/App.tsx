import { RouterProvider } from "./router";
import { AppRoutes } from "./AppRoutes";
import { AuthProvider } from "./contexts/AuthContext";
import { LocalizationProvider } from "./contexts/LocalizationContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { CouponProvider } from "./contexts/CouponContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { MessageProvider } from "./contexts/MessageContext";

export default function App() {
  return (
    <RouterProvider>
      <AuthProvider>
        <LocalizationProvider>
          <NotificationProvider>
            <CartProvider>
              <WishlistProvider>
                <CouponProvider>
                  <CategoryProvider>
                    <MessageProvider>
                      <AppRoutes />
                    </MessageProvider>
                  </CategoryProvider>
                </CouponProvider>
              </WishlistProvider>
            </CartProvider>
          </NotificationProvider>
        </LocalizationProvider>
      </AuthProvider>
    </RouterProvider>
  );
}
