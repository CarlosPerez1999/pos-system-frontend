/**
 * Configuration model for store settings.
 */
export interface Configuration {
  storeName: string;
}

/**
 * Configuration update payload.
 */
export interface ConfigurationUpdate {
  storeName?: string;
}
