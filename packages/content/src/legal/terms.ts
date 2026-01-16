/**
 * Terms of Service content
 * Structure ready for future implementation
 */
export interface LegalSection {
  heading: string;
  content: string;
}

export const termsOfService = {
  title: "Términos de Servicio",
  lastUpdated: new Date("2024-01-01"),
  sections: [
    // Add terms sections here when ready
  ] as LegalSection[],
};
