import { PaymentMethod, PaymentStatus } from "../types/order";

export interface PaymentIntent {
  status: PaymentStatus;
  provider: string;
  transactionId?: string;
}

export const paymentService = {
  async prepare(method: PaymentMethod): Promise<PaymentIntent> {
    return { status: method === "cash_on_delivery" ? "pending" : "pending", provider: method };
  },
};
