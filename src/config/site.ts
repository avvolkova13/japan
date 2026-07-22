import type { ProjectConfig } from "@/types/config";

export const siteConfig = {
  projectName: "KANSO",
  publicBrandName: "KANSO",
  supportEmail: "__PLACEHOLDER_SUPPORT_EMAIL__",
  supportHours: "__PLACEHOLDER_SUPPORT_HOURS__",
  legalCompanyName: "__PLACEHOLDER_LEGAL_COMPANY_NAME__",
  legalAddress: "__PLACEHOLDER_LEGAL_ADDRESS__",
  catalogMode: "demo",
  supportedLanguages: ["__PLACEHOLDER_LANGUAGE__"],
  supportedCurrencies: ["__PLACEHOLDER_CURRENCY__"],
  legalLinks: {
    privacyPolicy: "__PLACEHOLDER_PRIVACY_POLICY_URL__",
    terms: "__PLACEHOLDER_TERMS_URL__",
    delivery: "__PLACEHOLDER_DELIVERY_URL__",
    payment: "__PLACEHOLDER_PAYMENT_URL__",
    faq: "__PLACEHOLDER_FAQ_URL__",
  },
  paymentMethods: ["__PLACEHOLDER_PAYMENT_METHOD__"],
  deliveryMethods: ["__PLACEHOLDER_DELIVERY_METHOD__"],
} satisfies ProjectConfig;
