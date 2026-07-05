import { z } from 'zod';

/**
 * ====================================================
 * RUNTIME SCHEMA VALIDATIONS (ZOD) FOR BRUNCH BOUAKÉ SASS
 * ====================================================
 */

// Phone number regex pattern suitable for Côte d'Ivoire (+225) and generic formats
const phoneRegex = /^(?:\+225\s?)?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}\s?[0-9]{2}$|^\+?[1-9]\d{1,14}$/;

// 1. User account schema validation
export const userAccountSchema = z.object({
  name: z.string()
    .min(3, "Le nom complet doit comporter au moins 3 caractères.")
    .max(50, "Le nom complet ne peut pas dépasser 50 caractères.")
    .transform(val => val.trim()),
  username: z.string()
    .min(4, "L'identifiant doit comporter au moins 4 caractères.")
    .max(30, "L'identifiant ne peut pas dépasser 30 caractères.")
    .transform(val => val.trim().toLowerCase()),
  email: z.string()
    .email("Format de courrier électronique incorrect.")
    .max(80, "L'email est trop long.")
    .transform(val => val.trim().toLowerCase()),
  phone: z.string()
    .regex(phoneRegex, "Le numéro de téléphone doit être valide (ex: +225 07 48 29 10 11).")
    .transform(val => val.trim()),
  role: z.enum(['admin', 'manager', 'receptionist', 'waiter', 'accountant', 'housekeeper']),
  status: z.enum(['active', 'inactive', 'blocked']),
  branch: z.string().min(2, "Le choix de la succursale est requis.").optional()
});

// 2. Reservation validation schema
export const reservationSchema = z.object({
  roomId: z.string().min(1, "La chambre est requise."),
  guestName: z.string().min(3, "Le nom du client doit contenir au moins 3 caractères.").trim(),
  guestPhone: z.string().regex(phoneRegex, "Numéro de téléphone du client invalide.").trim(),
  guestEmail: z.string().email("Format d'email du client invalide.").or(z.literal('')),
  checkInDate: z.string().min(1, "La date de check-in est requise."),
  checkOutDate: z.string().min(1, "La date de check-out est requise."),
  numberOfGuests: z.number().int().min(1).max(10),
  totalAmount: z.number().min(0),
  paidAmount: z.number().min(0),
  specialRequests: z.string().optional()
}).refine(data => {
  const inDate = new Date(data.checkInDate);
  const outDate = new Date(data.checkOutDate);
  return outDate > inDate;
}, {
  message: "La date de départ doit être strictement postérieure à la date d'arrivée.",
  path: ["checkOutDate"]
});

// 3. MenuItem schema validation
export const menuItemSchema = z.object({
  name: z.string().min(2, "Le nom de l'article doit contenir au moins 2 caractères.").trim(),
  category: z.enum(['plat', 'boisson', 'accompagnement', 'dessert']),
  price: z.number().positive("Le prix doit être strictement positif."),
  available: z.boolean(),
  description: z.string().optional()
});

// Helper validation functions returning formatted errors
export function validateUser(data: unknown) {
  const result = userAccountSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    // Map to a user-friendly error sentence
    const firstKey = Object.keys(errors)[0];
    const message = errors[firstKey]?.[0] || "Données utilisateur invalides.";
    return { success: false, message, errors };
  }
  return { success: true, data: result.data };
}

export function validateReservation(data: unknown) {
  const result = reservationSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const globalErrors = result.error.flatten().formErrors;
    const firstKey = Object.keys(errors)[0];
    const message = errors[firstKey]?.[0] || globalErrors[0] || "Données de réservation invalides.";
    return { success: false, message, errors };
  }
  return { success: true, data: result.data };
}

export function validateMenuItem(data: unknown) {
  const result = menuItemSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    const firstKey = Object.keys(errors)[0];
    const message = errors[firstKey]?.[0] || "Données du menu de restaurant invalides.";
    return { success: false, message, errors };
  }
  return { success: true, data: result.data };
}
