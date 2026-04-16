// services/paymentService.ts

export type PaymentProvider = 'M-PESA' | 'AIRTEL' | 'ORANGE';

export interface PaymentRequest {
  phone: string;
  amount: number;
  provider: PaymentProvider;
}

export const MockMobileMoneyService = {
  // Simule l'envoi du Push USSD sur le téléphone de l'acheteur
  processPayment: async (request: PaymentRequest): Promise<{ success: boolean; transactionId: string }> => {
    console.log(`[Mock] Initialisation du paiement ${request.provider} pour ${request.amount} USD...`);
    
    // Simule un délai de traitement de 3 secondes
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulation d'un taux de réussite de 90%
        const isSuccess = Math.random() > 0.1;
        
        if (isSuccess) {
          resolve({
            success: true,
            transactionId: `TXN-${Math.floor(Math.random() * 1000000)}`
          });
        } else {
          reject(new Error("Paiement annulé par l'utilisateur ou solde insuffisant."));
        }
      }, 3000);
    });
  }
};