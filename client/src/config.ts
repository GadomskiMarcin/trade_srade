// Configuration for the frontend application
// This file loads environment variables and provides them to the application

interface Config {
  apiUrl: string;
  environment: string;
}

function getRequiredEnvVar(name: string): string {
  const value = import.meta.env[name];
  if (!value) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
}

function getOptionalEnvVar(name: string, defaultValue: string): string {
  const value = import.meta.env[name];
  return value || defaultValue;
}

export function loadConfig(): Config {
  try {
    const config: Config = {
      apiUrl: getRequiredEnvVar('VITE_API_URL'),
      environment: getOptionalEnvVar('VITE_ENV', 'development'),
    };

    // Validate API URL format
    try {
      new URL(config.apiUrl);
    } catch {
      throw new Error('VITE_API_URL must be a valid URL');
    }

    return config;
  } catch (error) {
    console.error('Configuration error:', error);
    throw error;
  }
}

// Export the configuration
export const config = loadConfig(); 