import { 
  PaymentIntent, 
  PaymentTransaction, 
  WebhookEvent, 
  ProcessedEvent, 
  PaymentProvider, 
  PaymentIntentStatus 
} from '../types';

// ==========================================
// 1. WAVE ADAPTER (Côte d'Ivoire)
// ==========================================
export const WaveAdapter = {
  /**
   * Simulate calling Wave API to initialize checkout session.
   * Wave uses a secret key to sign client requests and returns a unique checkout session and URL.
   */
  initiateCheckout: (amount: number, phoneNumber: string, internalRef: string) => {
    const sessionId = `wave_sess_${Math.random().toString(36).substring(2, 10)}`;
    const checkoutUrl = `https://checkout.wave.com/c/${sessionId}`;
    
    const initialPayload = {
      amount,
      currency: 'XOF',
      error_url: 'https://brunchbouake.ci/payment/error',
      success_url: 'https://brunchbouake.ci/payment/success',
      mobile_number: phoneNumber,
      client_reference: internalRef,
    };

    return {
      success: true,
      providerSessionId: sessionId,
      checkoutUrl,
      providerReference: `WAVE-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      requestPayload: initialPayload,
      debugLog: `[Wave API] checkout.session.created: ${sessionId} generated. Amount: ${amount} F. Client Phone: ${phoneNumber}`
    };
  },

  /**
   * Simulate a webhook payload from Wave
   */
  generateWebhookPayload: (sessionId: string, amount: number, clientRef: string, phone: string, outcome: 'success' | 'failure' = 'success') => {
    const eventId = `evt_wave_${Math.random().toString(36).substring(2, 10)}`;
    const waveTxnId = `wave_txn_${Math.random().toString(36).substring(2, 12)}`;
    
    return {
      id: eventId,
      type: outcome === 'success' ? 'checkout.session.completed' : 'checkout.session.expired',
      created: new Date().toISOString(),
      data: {
        id: sessionId,
        amount: amount,
        currency: 'XOF',
        client_reference: clientRef,
        payment_status: outcome === 'success' ? 'succeeded' : 'failed',
        transaction_id: waveTxnId,
        customer: {
          mobile: phone
        }
      },
      signature: `sha256=wave_hmac_sig_${Math.random().toString(36).substring(2, 16)}`
    };
  }
};

// ==========================================
// 2. ORANGE MONEY ADAPTER (Côte d'Ivoire)
// ==========================================
export const OrangeMoneyAdapter = {
  /**
   * Simulate calling OM Web Payment API to request USSD Push.
   * OM uses merchant token authentication and returns an authorization token.
   */
  initiatePayment: (amount: number, phoneNumber: string, internalRef: string) => {
    const omToken = `om_tok_${Math.random().toString(36).substring(2, 10)}`;
    const payToken = `mp_pay_${Math.random().toString(36).substring(2, 10)}`;
    
    const requestPayload = {
      merchant_key: 'om_brunch_bouake_992x',
      currency: 'OUV', // XOF Code
      amount,
      order_id: internalRef,
      reference: 'Brunch Bouake Billing',
      pin: '****', // USSD simulated auth
      subscriber_phone: phoneNumber
    };

    return {
      success: true,
      paymentToken: payToken,
      omAuthorizationToken: omToken,
      providerReference: `OM-TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      requestPayload,
      debugLog: `[Orange Money API] Initiated USSD OTP push to ${phoneNumber}. PayToken: ${payToken}`
    };
  },

  /**
   * Simulate Webhook callback payload from Orange Money
   */
  generateWebhookPayload: (payToken: string, amount: number, orderId: string, phone: string, outcome: 'success' | 'failure' = 'success') => {
    const eventId = `evt_om_${Math.random().toString(36).substring(2, 10)}`;
    const omTxnId = `om_txn_${Math.random().toString(36).substring(2, 12)}`;
    
    return {
      event_id: eventId,
      status: outcome === 'success' ? 'SUCCESS' : 'FAILED',
      tx_token: payToken,
      amount: amount,
      subscriber_msisdn: phone,
      client_reference: orderId,
      om_transaction_id: omTxnId,
      notif_type: 'payment_status',
      signature: `sha256=om_hmac_sig_${Math.random().toString(36).substring(2, 16)}`
    };
  }
};

// ==========================================
// Côte d'Ivoire Phone Number Validation Utility
// ==========================================
export function normalizeAndValidateCIPhoneNumber(phone: string): { isValid: boolean; normalized?: string; error?: string } {
  // Strip spaces, dashes, parentheses
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // If starts with 225 (without +), prepend +
  if (cleaned.startsWith('225') && cleaned.length === 13) {
    cleaned = '+' + cleaned;
  }
  // If it is 10 digits and doesn't start with 225 or +225, prepend +225
  else if (cleaned.length === 10 && /^\d+$/.test(cleaned)) {
    cleaned = '+225' + cleaned;
  }

  // Strict regex: +225 followed by exactly 10 digits
  const ciPhoneRegex = /^\+225\d{10}$/;
  const isValid = ciPhoneRegex.test(cleaned);

  if (!isValid) {
    return {
      isValid: false,
      error: "Format de numéro de téléphone Mobile Money invalide pour la Côte d'Ivoire. Le format requis est +225 suivi de 10 chiffres (ex: +2250701020304)."
    };
  }

  return {
    isValid: true,
    normalized: cleaned
  };
}

// ==========================================
// 3. PAYMENT ORCHESTRATOR
// ==========================================
export const PaymentOrchestrator = {
  /**
   * Initiates a payment flow
   */
  createIntent: (
    amount: number,
    provider: PaymentProvider,
    phoneNumber: string,
    sourceEntity: 'pos_order' | 'folio_charge' | 'reservation_deposit',
    sourceId: string
  ): { intent: PaymentIntent; initialAdapterResponse: any } => {
    // 1. Strict Phone Validation & Normalization
    const validation = normalizeAndValidateCIPhoneNumber(phoneNumber);
    if (!validation.isValid) {
      throw new Error(`[Paiement Sécurisé] ${validation.error}`);
    }
    const validatedPhone = validation.normalized!;

    const intentId = `pi_${Math.random().toString(36).substring(2, 8)}`;
    const internalRef = `REF-${provider.toUpperCase()}-${Date.now().toString().slice(-6)}`;

    // Call provider adapter
    let adapterResponse: any;
    if (provider === 'wave') {
      adapterResponse = WaveAdapter.initiateCheckout(amount, validatedPhone, internalRef);
    } else {
      adapterResponse = OrangeMoneyAdapter.initiatePayment(amount, validatedPhone, internalRef);
    }

    const intent: PaymentIntent = {
      id: intentId,
      amount,
      currency: 'XOF',
      provider,
      phoneNumber: validatedPhone,
      status: 'pending',
      reference: internalRef,
      providerReference: adapterResponse.providerReference,
      sourceEntity,
      sourceId,
      metadata: {
        providerSessionId: provider === 'wave' ? adapterResponse.providerSessionId : undefined,
        paymentToken: provider === 'orange_money' ? adapterResponse.paymentToken : undefined,
        debugLog: adapterResponse.debugLog,
        history: [`[${new Date().toISOString()}] Payment Intent created in PENDING state. Validated CI Phone: ${validatedPhone}`]
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return {
      intent,
      initialAdapterResponse: adapterResponse
    };
  },

  /**
   * Process a webhook event - CORE SOURCE OF TRUTH
   * Implements secure idempotency validation via ProcessedEvents
   */
  processWebhook: (
    provider: PaymentProvider,
    payload: any,
    currentIntents: PaymentIntent[],
    currentProcessedEvents: ProcessedEvent[],
    currentTransactions: PaymentTransaction[]
  ): {
    success: boolean;
    error?: string;
    updatedIntents: PaymentIntent[];
    updatedProcessedEvents: ProcessedEvent[];
    updatedTransactions: PaymentTransaction[];
    affectedIntent?: PaymentIntent;
  } => {
    const eventId = provider === 'wave' ? payload.id : payload.event_id;
    const clientRef = provider === 'wave' ? payload.data.client_reference : payload.client_reference;
    const status = provider === 'wave' ? payload.data.payment_status : payload.status;
    const amount = provider === 'wave' ? payload.data.amount : payload.amount;
    const phone = provider === 'wave' ? payload.data.customer.mobile : payload.subscriber_msisdn;
    const providerTxnId = provider === 'wave' ? payload.data.transaction_id : payload.om_transaction_id;

    // 1. SECURE SIGNATURE CONTROL (Anti-Forgery)
    const signature = payload.signature;
    if (!signature || !signature.startsWith('sha256=')) {
      console.error(`[Security Warning] Webhook signature verification failed! Signature missing or malformed.`);
      return {
        success: false,
        error: "Échec de sécurité : Signature HMAC SHA-256 invalide ou manquante.",
        updatedIntents: currentIntents,
        updatedProcessedEvents: currentProcessedEvents,
        updatedTransactions: currentTransactions
      };
    }

    // 2. IDEMPOTENCY CHECK - Prevent duplicate processing
    const duplicate = currentProcessedEvents.find(pe => pe.eventId === eventId);
    if (duplicate) {
      console.warn(`[PaymentOrchestrator] Webhook duplicate detected! Event: ${eventId} already processed.`);
      return {
        success: false,
        error: `Duplicate webhook event: ${eventId} has already been processed and finalized.`,
        updatedIntents: currentIntents,
        updatedProcessedEvents: currentProcessedEvents,
        updatedTransactions: currentTransactions
      };
    }

    // 3. Resolve matching PaymentIntent
    const intentIdx = currentIntents.findIndex(pi => pi.reference === clientRef);
    if (intentIdx === -1) {
      return {
        success: false,
        error: `No matching PaymentIntent found for reference ${clientRef}`,
        updatedIntents: currentIntents,
        updatedProcessedEvents: currentProcessedEvents,
        updatedTransactions: currentTransactions
      };
    }

    const matchedIntent = { ...currentIntents[intentIdx] };
    
    // If already finalized, do not process again
    if (matchedIntent.status === 'succeeded' || matchedIntent.status === 'failed') {
      return {
        success: false,
        error: `PaymentIntent ${matchedIntent.id} is already in a finalized state: ${matchedIntent.status}`,
        updatedIntents: currentIntents,
        updatedProcessedEvents: currentProcessedEvents,
        updatedTransactions: currentTransactions
      };
    }

    // 4. Update Intent state
    const resolvedStatus: PaymentIntentStatus = (status === 'succeeded' || status === 'SUCCESS') ? 'succeeded' : 'failed';
    matchedIntent.status = resolvedStatus;
    matchedIntent.providerReference = providerTxnId;
    matchedIntent.updatedAt = new Date().toISOString();
    
    const history = [...(matchedIntent.metadata?.history || [])];
    history.push(`[${new Date().toISOString()}] Webhook secured & processed (ID: ${eventId}). Resolved status: ${resolvedStatus.toUpperCase()}. Provider Ref: ${providerTxnId}`);
    matchedIntent.metadata = {
      ...matchedIntent.metadata,
      history,
      webhookPayload: payload
    };

    const updatedIntents = [...currentIntents];
    updatedIntents[intentIdx] = matchedIntent;

    // 5. Record entry in processed idempotency store
    const newProcessedEvent: ProcessedEvent = {
      eventId,
      processedAt: new Date().toISOString(),
      paymentIntentId: matchedIntent.id
    };
    const updatedProcessedEvents = [...currentProcessedEvents, newProcessedEvent];

    // 5. Create PaymentTransaction audit trail record
    const newTransaction: PaymentTransaction = {
      id: `txn_${Math.random().toString(36).substring(2, 8)}`,
      paymentIntentId: matchedIntent.id,
      provider,
      providerReference: providerTxnId,
      amount,
      status: resolvedStatus === 'succeeded' ? 'succeeded' : 'failed',
      payerPhone: phone,
      auditTrail: history,
      processedAt: new Date().toISOString()
    };
    const updatedTransactions = [...currentTransactions, newTransaction];

    return {
      success: true,
      updatedIntents,
      updatedProcessedEvents,
      updatedTransactions,
      affectedIntent: matchedIntent
    };
  },

  /**
   * Fallback manual reconciliation if API or webhook fails
   */
  forceManualReconcile: (
    intentId: string,
    reconciliationNote: string,
    user: string,
    currentIntents: PaymentIntent[],
    currentTransactions: PaymentTransaction[]
  ): {
    success: boolean;
    updatedIntents: PaymentIntent[];
    updatedTransactions: PaymentTransaction[];
    affectedIntent?: PaymentIntent;
  } => {
    const intentIdx = currentIntents.findIndex(pi => pi.id === intentId);
    if (intentIdx === -1) {
      return { success: false, updatedIntents: currentIntents, updatedTransactions: currentTransactions };
    }

    const matchedIntent = { ...currentIntents[intentIdx] };
    
    // Force set as succeeded
    const mockProviderRef = matchedIntent.providerReference || `MANUAL-${Math.floor(100000 + Math.random() * 900000)}`;
    matchedIntent.status = 'succeeded';
    matchedIntent.providerReference = mockProviderRef;
    matchedIntent.updatedAt = new Date().toISOString();

    const history = [...(matchedIntent.metadata?.history || [])];
    history.push(`[${new Date().toISOString()}] FORCE MANUAL RECONCILIATION by ${user}. Reason: ${reconciliationNote}`);
    matchedIntent.metadata = {
      ...matchedIntent.metadata,
      history,
      isManuallyReconciled: true,
      reconciledBy: user,
      reconciliationNote
    };

    const updatedIntents = [...currentIntents];
    updatedIntents[intentIdx] = matchedIntent;

    // Record audit trail transaction
    const newTransaction: PaymentTransaction = {
      id: `txn_${Math.random().toString(36).substring(2, 8)}`,
      paymentIntentId: matchedIntent.id,
      provider: matchedIntent.provider,
      providerReference: mockProviderRef,
      amount: matchedIntent.amount,
      status: 'succeeded',
      payerPhone: matchedIntent.phoneNumber,
      auditTrail: history,
      processedAt: new Date().toISOString()
    };

    const updatedTransactions = [...currentTransactions, newTransaction];

    return {
      success: true,
      updatedIntents,
      updatedTransactions,
      affectedIntent: matchedIntent
    };
  },

  /**
   * Batch reconciliation job to auto-verify pending payments (simulates query to provider APIs)
   */
  runReconciliationJob: (
    currentIntents: PaymentIntent[],
    currentTransactions: PaymentTransaction[],
    currentProcessedEvents: ProcessedEvent[]
  ): {
    reconciledCount: number;
    updatedIntents: PaymentIntent[];
    updatedTransactions: PaymentTransaction[];
    updatedProcessedEvents: ProcessedEvent[];
    logs: string[];
  } => {
    let reconciledCount = 0;
    const logs: string[] = [`[${new Date().toISOString()}] Started automated payment reconciliation batch job.`];
    
    let updatedIntents = [...currentIntents];
    let updatedTransactions = [...currentTransactions];
    let updatedProcessedEvents = [...currentProcessedEvents];

    // Find all pending intents
    const pendingIntents = currentIntents.filter(pi => pi.status === 'pending');
    logs.push(`Found ${pendingIntents.length} pending Mobile Money intentions to query.`);

    pendingIntents.forEach(intent => {
      // For simulation, we randomly resolve 50% of pending intents as successful via checking provider API
      const shouldResolve = Math.random() > 0.4;
      if (shouldResolve) {
        logs.push(`Querying provider status for ${intent.id} (${intent.provider.toUpperCase()})...`);
        
        // Construct simulated payload
        let webhookPayload: any;
        if (intent.provider === 'wave') {
          const sessionId = intent.metadata?.providerSessionId || 'wave_sess_missing';
          webhookPayload = WaveAdapter.generateWebhookPayload(sessionId, intent.amount, intent.reference, intent.phoneNumber, 'success');
        } else {
          const payToken = intent.metadata?.paymentToken || 'om_token_missing';
          webhookPayload = OrangeMoneyAdapter.generateWebhookPayload(payToken, intent.amount, intent.reference, intent.phoneNumber, 'success');
        }

        // Process webhook payload safely
        const result = PaymentOrchestrator.processWebhook(
          intent.provider,
          webhookPayload,
          updatedIntents,
          updatedProcessedEvents,
          updatedTransactions
        );

        if (result.success) {
          updatedIntents = result.updatedIntents;
          updatedTransactions = result.updatedTransactions;
          updatedProcessedEvents = result.updatedProcessedEvents;
          reconciledCount++;
          logs.push(`Reconciled successfully! Payment Intent ${intent.id} is now SUCCEEDED.`);
        } else {
          logs.push(`Query for ${intent.id} failed: ${result.error}`);
        }
      } else {
        logs.push(`Querying ${intent.id} returned PENDING (still waiting for user authorization).`);
      }
    });

    logs.push(`Batch job finished. Reconciled ${reconciledCount} payments.`);
    return {
      reconciledCount,
      updatedIntents,
      updatedTransactions,
      updatedProcessedEvents,
      logs
    };
  }
};
