/**
 * Email Configuration
 * ---------------------------------------
 * This file contains customizable variables for the email templates.
 * Modify the values below to match your brand identity.
 * This file is imported by EmailSender.js.
 */

// Theme colors for email templates
const THEME_COLORS = {
  primary: "#2e7d32",       // Main brand color, used for headers and buttons
  secondary: "#8d6e63",     // A secondary color for gradients or accents
  lightBackground: "#e8f5e9", // Light background color for footers or separators
  success: "#28A745",      // Color for success notifications (e.g., confirmed)
  danger: "#DC3545",       // Color for warnings or cancellations (e.g., cancelled)
  warning: "#FFC107",      // Color for pending or alert states (e.g., pending)
  buttonText: "#ffffff",    // Text color for buttons
  bodyText: "#333333",       // Main text color
  footerText: "#666666",      // Text color for the footer
};

// Company details
const COMPANY_NAME = "NanguraSocialCare";

module.exports = {
  THEME_COLORS,
  COMPANY_NAME,
};
