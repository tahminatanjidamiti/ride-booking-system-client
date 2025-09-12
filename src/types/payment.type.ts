export type TPaymentActionResponse = {
  success: boolean;
  message: string;
};

export interface IPaymentResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    paymentUrl: string;
  };
}

export type TPaymentActionPayload = Record<string, string>;

export type PAYMENT_STATUS = "PAID" | "UNPAID" | "CANCELLED" | "FAILED" | "REFUNDED";

export interface IPayment {
    booking: string;
    transactionId: string;
    amount: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    paymentGatewayData?: any
    invoiceUrl?: string
    status: PAYMENT_STATUS,
    paymentUrl?: string;
}