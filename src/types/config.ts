export type LegalLinks = {
  privacyPolicy: string;
  terms: string;
  delivery: string;
  payment: string;
  faq: string;
};

export type ProjectConfig = {
  projectName: string;
  publicBrandName: string;
  supportEmail: string;
  supportHours: string;
  legalCompanyName: string;
  legalAddress: string;
  catalogMode: "demo" | "production";
  supportedLanguages: readonly string[];
  supportedCurrencies: readonly string[];
  legalLinks: LegalLinks;
  paymentMethods: readonly string[];
  deliveryMethods: readonly string[];
};
