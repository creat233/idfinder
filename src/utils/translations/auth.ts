
import { Translations } from './types';

export const authTranslations: Translations = {
  logout: { fr: "Déconnexion", en: "Logout" },
  logout_success: { fr: "Vous avez été déconnecté.", en: "You have been logged out." },

  // Login Page
  login_title: { fr: "Connexion", en: "Login" },
  login_email_label: { fr: "Email", en: "Email" },
  login_email_placeholder: { fr: "Votre adresse email", en: "Your email address" },
  login_password_label: { fr: "Mot de passe", en: "Password" },
  login_password_placeholder: { fr: "Votre mot de passe", en: "Your password" },
  login_button: { fr: "Se connecter", en: "Log in" },
  login_loading_button: { fr: "Connexion en cours...", en: "Logging in..." },
  login_error_invalid_email: { fr: "Email invalide", en: "Invalid email" },
  login_error_password_required: { fr: "Le mot de passe est requis", en: "Password is required" },
  login_general_error: { fr: "Une erreur s'est produite lors de la connexion", en: "An error occurred during login" },

  // Register Page
  register_title: { fr: "Créer un compte", en: "Create an account" },
  register_firstname_label: { fr: "Prénom *", en: "First Name *" },
  register_firstname_placeholder: { fr: "Votre prénom", en: "Your first name" },
  register_lastname_label: { fr: "Nom *", en: "Last Name *" },
  register_lastname_placeholder: { fr: "Votre nom", en: "Your last name" },
  register_country_label: { fr: "Pays de résidence *", en: "Country of residence *" },
  register_phone_label: { fr: "Téléphone *", en: "Phone *" },
  register_phone_placeholder: { fr: "ex: +221 77 123 45 67", en: "e.g.: +1 555 123 4567" },
  register_phone_helptext: { fr: "Le numéro de téléphone est obligatoire pour recevoir les notifications WhatsApp", en: "Phone number is required to receive WhatsApp notifications" },
  register_email_label: { fr: "Email *", en: "Email *" },
  register_email_placeholder: { fr: "Votre adresse email", en: "Your email address" },
  register_password_label: { fr: "Mot de passe *", en: "Password *" },
  register_password_placeholder: { fr: "Choisissez un mot de passe", en: "Choose a password" },
  register_important_note_title: { fr: "Important :", en: "Important:" },
  register_important_note_text: { fr: "Tous les champs marqués d'un (*) sont obligatoires. Votre numéro de téléphone sera utilisé pour vous contacter via WhatsApp concernant vos codes promo et les cartes trouvées.", en: "All fields marked with (*) are required. Your phone number will be used to contact you via WhatsApp regarding your promo codes and found cards." },
  register_button: { fr: "Créer un compte", en: "Create account" },
  register_loading_button: { fr: "Inscription en cours...", en: "Creating account..." },
  register_error_email_invalid: { fr: "Email invalide", en: "Invalid email" },
  register_error_password_short: { fr: "Le mot de passe doit contenir au moins 6 caractères", en: "Password must be at least 6 characters long" },
  register_error_firstname_short: { fr: "Le prénom doit contenir au moins 2 caractères", en: "First name must be at least 2 characters long" },
  register_error_lastname_short: { fr: "Le nom doit contenir au moins 2 caractères", en: "Last name must be at least 2 characters long" },
  register_error_phone_short: { fr: "Le numéro de téléphone doit contenir au moins 8 chiffres", en: "Phone number must contain at least 8 digits" },
  register_error_phone_invalid: { fr: "Format de téléphone invalide (ex: +221 77 123 45 67)", en: "Invalid phone format (e.g., +1 555 123 4567)" },
  register_error_country_required: { fr: "Le pays est requis", en: "Country is required" },
  register_error_generic: { fr: "Une erreur s'est produite lors de l'inscription. Veuillez réessayer.", en: "An error occurred during registration. Please try again." },
  register_error_all_fields: { fr: "Tous les champs obligatoires doivent être remplis", en: "All required fields must be filled" },

  // Reset Password Page
  reset_password_title: { fr: "Réinitialiser le mot de passe", en: "Reset Password" },
  reset_password_email_label: { fr: "Email", en: "Email" },
  reset_password_email_placeholder: { fr: "Votre adresse email", en: "Your email address" },
  reset_password_button: { fr: "Réinitialiser le mot de passe", en: "Reset Password" },
  reset_password_loading_button: { fr: "Envoi en cours...", en: "Sending..." },
  reset_password_cancel_button: { fr: "Annuler", en: "Cancel" },
  reset_password_success_toast_title: { fr: "Email envoyé", en: "Email sent" },
  reset_password_success_toast_desc: { fr: "Vérifiez votre boîte mail pour réinitialiser votre mot de passe", en: "Check your inbox to reset your password" },
  reset_password_error_generic: { fr: "Une erreur s'est produite lors de l'envoi de l'email", en: "An error occurred while sending the email" },

  // Auth Hook
  auth_hook_profile_error_toast_title: { fr: "Attention", en: "Warning" },
  auth_hook_profile_error_toast_desc: { fr: "Compte créé mais les informations de profil n'ont pas pu être sauvegardées. Veuillez mettre à jour votre profil.", en: "Account created but profile information could not be saved. Please update your profile." },
  auth_hook_account_created_toast_title: { fr: "Compte créé avec succès", en: "Account created successfully" },
  auth_hook_account_created_toast_desc: { fr: "Vous pouvez maintenant vous connecter avec vos informations complètes", en: "You can now log in with your full information" },
  auth_hook_signed_in_toast_desc: { fr: "Vous pouvez maintenant vous connecter", en: "You can now log in" },
  auth_hook_user_exists_toast_title: { fr: "Erreur", en: "Error" },
  auth_hook_user_exists_toast_desc: { fr: "L'utilisateur existe déjà. Veuillez vous connecter.", en: "User already exists. Please log in." },
  auth_hook_password_recovery_toast_title: { fr: "Réinitialisation du mot de passe", en: "Password Recovery" },
  auth_hook_password_recovery_toast_desc: { fr: "Veuillez suivre les instructions pour réinitialiser votre mot de passe", en: "Please follow the instructions to reset your password" },

  // Login Header
  login_header_main_title: { fr: "Sama Pièce", en: "Sama Pièce" },
  login_header_subtitle: { fr: "Votre plateforme de récupération de documents", en: "Your document recovery platform" },
  login_header_tagline: { fr: "✨ Signalez, retrouvez et restituez facilement les documents égarés grâce à notre communauté solidaire", en: "✨ Easily report, find, and return lost documents through our supportive community" }
};
