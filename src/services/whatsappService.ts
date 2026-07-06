import { WhatsAppMessage } from '../types';
import { saveWhatsAppItemDB, deleteWhatsAppItemDB } from '../utils/indexedDB';

// ==========================================
// Côte d'Ivoire Phone Number Validation Utility
// ==========================================
export function validateAndNormalizeCIPhone(phone: string): { isValid: boolean; normalized?: string; error?: string } {
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
      error: "Format de numéro de téléphone WhatsApp invalide pour la Côte d'Ivoire. Requis: +225 suivi de 10 chiffres (ex: +2250701020304)."
    };
  }

  return {
    isValid: true,
    normalized: cleaned
  };
}

// ==========================================
// Templates Definitions (French / Nouchi local chic)
// ==========================================
export const WHATSAPP_TEMPLATES = {
  reservation_confirm: (vars: Record<string, string>) => {
    const guest = vars.guestName || 'Cher Client';
    const room = vars.roomName || 'chambre';
    const checkIn = vars.checkInDate || 'N/A';
    const checkOut = vars.checkOutDate || 'N/A';
    const pin = vars.securityPin || '1234';
    return `Bonjour *${guest}*, votre Studio/Chambre chez *Brunch Bouaké* est confirmé du *${checkIn}* au *${checkOut}*. Votre PIN sécurisé est *${pin}*. À bientôt ! Akwaba chez vous ! 🇨🇮✨`;
  },
  pos_receipt: (vars: Record<string, string>) => {
    const tableOrRoom = vars.tableOrRoom || 'votre table';
    const amount = vars.amount || '0';
    const method = vars.method || 'espèces';
    const link = vars.receiptLink || 'https://brunch-bouake.ci/receipts/r-latest';
    return `Merci pour votre confiance chez *Brunch Bouaké* ! Votre addition pour la *${tableOrRoom}* d'un montant de *${Number(amount).toLocaleString('fr-FR')} FCFA* a été soldée par *${method.toUpperCase()}*. Reçu : ${link}. Bon appétit ! 🍹🔥`;
  },
  cleaning_alert: (vars: Record<string, string>) => {
    const room = vars.roomName || 'N/A';
    const staff = vars.staffName || 'Équipe';
    return `🚨 *Alerte Ménage* : La chambre *${room}* a besoin d'un nettoyage urgent suite au Check-Out. Assigné à : *${staff}*. Merci de faire briller l'espace ! 🧼✨`;
  },
  salary_notification: (vars: Record<string, string>) => {
    const name = vars.employeeName || 'Collaborateur';
    const period = vars.period || 'ce mois';
    const net = vars.netSalary || '0';
    return `Bonjour *${name}*, votre bulletin de paie pour la période *${period}* a été validé. Salaire Net versé : *${Number(net).toLocaleString('fr-FR')} FCFA*. Contactez la comptabilité pour votre chèque/virement Wave.`;
  }
};

// ==========================================
// WHATSAPP ORCHESTRATOR
// ==========================================
export const WhatsAppOrchestrator = {
  /**
   * Generates mock receipt link
   */
  generateReceiptLink(orderId: string): string {
    return `https://brunch-bouake.ci/receipts/${orderId}`;
  },

  /**
   * Compiles template text based on variables
   */
  renderMessage(templateName: 'reservation_confirm' | 'pos_receipt' | 'cleaning_alert' | 'salary_notification', variables: Record<string, string>): string {
    const renderer = WHATSAPP_TEMPLATES[templateName];
    if (!renderer) {
      throw new Error(`Modèle WhatsApp inconnu: ${templateName}`);
    }
    return renderer(variables);
  },

  /**
   * Simulates the low-level API call to the WhatsApp Gateway of a specific Tenant
   */
  async simulateApiCall(
    to: string, 
    compiledText: string, 
    config: { instanceUrl: string; apiToken: string; isActive: boolean }
  ): Promise<{ success: boolean; messageId: string; debugLog: string }> {
    // 1. Validate Active Configuration
    if (!config || !config.isActive) {
      throw new Error("Le service WhatsApp est inactif ou non configuré pour cet établissement.");
    }

    if (!config.apiToken || config.apiToken.includes("key_missing")) {
      throw new Error("Clé d'API WhatsApp manquante. Veuillez la configurer dans l'onglet Paramètres.");
    }

    // 2. Simulate Network call
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 25% flaky network rate simulation to trigger offline queue testing!
    if (Math.random() < 0.20) {
      throw new Error("Délai d'attente réseau WhatsApp Gateway dépassé (504 Gateway Timeout).");
    }

    const messageId = `msg_wa_${Math.random().toString(36).substring(2, 10)}`;
    const debugLog = `[WhatsApp Gateway API] Envoyé avec succès via ${config.instanceUrl}. Token: ${config.apiToken.slice(0, 8)}***. Destinataire: ${to}`;

    return {
      success: true,
      messageId,
      debugLog
    };
  },

  /**
   * Main entrypoint to send a templated message with Multi-Tenant checks & Offline queueing
   */
  async sendTemplateMessage(
    to: string,
    template: 'reservation_confirm' | 'pos_receipt' | 'cleaning_alert' | 'salary_notification',
    variables: Record<string, string>,
    tenantId: string = 'tenant-bouake-kennedy',
    tenantSettings?: any // Optional: can pass settings from UI context directly
  ): Promise<{ status: 'sent' | 'queued'; messageId?: string; error?: string; message?: string }> {
    
    // 1. Strict Phone Validation & Normalization
    const phoneValidation = validateAndNormalizeCIPhone(to);
    if (!phoneValidation.isValid) {
      const errMsg = phoneValidation.error || "Numéro WhatsApp invalide.";
      console.error(`[WhatsApp Service] ${errMsg}`);
      return { status: 'failed', error: errMsg } as any;
    }
    const validatedTo = phoneValidation.normalized!;

    // 2. Resolve Multi-Tenant WhatsApp Gateway Configuration
    // Fallback to simulated defaults if not provided in tenantSettings
    const instanceUrl = tenantSettings?.whatsappConfig?.instanceUrl || `https://api.whatsapp-gateway.ci/v1/instance-${tenantId}`;
    const apiToken = tenantSettings?.whatsappConfig?.apiToken || `WA_TOKEN_SIMULATED_${tenantId.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_9921`;
    const isActive = tenantSettings?.whatsappConfig?.isActive !== false;

    const config = { instanceUrl, apiToken, isActive };
    const compiledText = this.renderMessage(template, variables);

    // 3. Network connection check
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    if (!isOnline) {
      // Create and save WhatsApp message to offline sync queue
      const queuedItem: WhatsAppMessage = {
        id: `wa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        tenantId,
        to: validatedTo,
        template,
        variables,
        status: 'pending',
        attempts: 0,
        createdAt: new Date().toISOString()
      };

      await saveWhatsAppItemDB(queuedItem);
      console.warn(`[WhatsApp Service] Mode Hors-ligne : Message pour ${validatedTo} mis en cache IndexedDB.`);
      return { 
        status: 'queued', 
        message: `Message WhatsApp mis en attente hors-ligne pour ${validatedTo}.` 
      };
    }

    try {
      // 4. Send Message via API Call
      const apiResponse = await this.simulateApiCall(validatedTo, compiledText, config);
      console.log(`[WhatsApp Service] Message envoyé avec succès. ID: ${apiResponse.messageId}`, apiResponse.debugLog);
      return {
        status: 'sent',
        messageId: apiResponse.messageId,
        message: `Message envoyé à ${validatedTo}.`
      };
    } catch (apiError: any) {
      console.warn(`[WhatsApp Service] Échec d'envoi API, mise en cache IndexedDB:`, apiError.message);
      
      // Auto-fallback to offline queue on API gateway errors
      const queuedItem: WhatsAppMessage = {
        id: `wa-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        tenantId,
        to: validatedTo,
        template,
        variables,
        status: 'pending',
        attempts: 1,
        lastAttempt: new Date().toISOString(),
        error: apiError.message,
        errorDetail: `Première tentative API échouée : ${apiError.message}`,
        createdAt: new Date().toISOString()
      };

      await saveWhatsAppItemDB(queuedItem);
      return {
        status: 'queued',
        error: apiError.message,
        message: `Le serveur WhatsApp est momentanément indisponible. Message sauvegardé dans la file d'attente.`
      };
    }
  },

  /**
   * Processes the entire WhatsApp queue
   */
  async processQueue(
    currentQueue: WhatsAppMessage[],
    tenantSettings?: any
  ): Promise<{ remainingQueue: WhatsAppMessage[]; sentCount: number; failedCount: number }> {
    let sentCount = 0;
    let failedCount = 0;
    const remainingQueue: WhatsAppMessage[] = [];

    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    if (!isOnline) {
      return { remainingQueue: currentQueue, sentCount: 0, failedCount: 0 };
    }

    for (const item of currentQueue) {
      if (item.status === 'failed' && item.attempts >= 3) {
        remainingQueue.push(item);
        continue;
      }

      const updatedItem: WhatsAppMessage = {
        ...item,
        status: 'sending',
        lastAttempt: new Date().toISOString()
      };

      try {
        const tenantId = item.tenantId;
        const instanceUrl = tenantSettings?.whatsappConfig?.instanceUrl || `https://api.whatsapp-gateway.ci/v1/instance-${tenantId}`;
        const apiToken = tenantSettings?.whatsappConfig?.apiToken || `WA_TOKEN_SIMULATED_${tenantId.toUpperCase().replace(/[^A-Z0-9]/g, '_')}_9921`;
        const isActive = tenantSettings?.whatsappConfig?.isActive !== false;
        
        const config = { instanceUrl, apiToken, isActive };
        const compiledText = this.renderMessage(item.template, item.variables);

        await this.simulateApiCall(item.to, compiledText, config);
        
        // Success: remove from IndexedDB
        await deleteWhatsAppItemDB(item.id);
        sentCount++;
      } catch (err: any) {
        const nextAttempts = item.attempts + 1;
        const errMsg = err.message || 'Network error';
        
        updatedItem.attempts = nextAttempts;
        updatedItem.error = errMsg;

        if (nextAttempts >= 3) {
          updatedItem.status = 'failed';
          updatedItem.errorDetail = `[ÉCHEC WA DÉFINITIF] Échec après 3 tentatives d'envoi. Erreur: ${errMsg}`;
          failedCount++;
        } else {
          updatedItem.status = 'pending';
          updatedItem.errorDetail = `Tentative d'envoi ${nextAttempts}/3 échouée: ${errMsg}`;
        }

        await saveWhatsAppItemDB(updatedItem);
        remainingQueue.push(updatedItem);
      }
    }

    return {
      remainingQueue,
      sentCount,
      failedCount
    };
  }
};
