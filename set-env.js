const fs = require('fs');
const path = require('path');

// Load environment variables from .env file manually
const envPath = path.join(__dirname, '.env');
let envVars = {};

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join('=').trim(); // Handle values with =
      if (key && value) {
        envVars[key] = value;
      }
    }
  });
}

// Merge with process.env (process.env takes precedence if set, e.g. in CI/CD)
const apiUrl = process.env.API_URL || envVars.API_URL || 'http://localhost:3000/api';

const envConfigFile = `export const environment = {
  production: true,
  API_URL: '${apiUrl}',
};
`;

const envDevConfigFile = `export const environment = {
  production: false,
  API_URL: '${apiUrl}',
};
`;

const targetPath = path.join(__dirname, './src/environments/environment.ts');
const targetDevPath = path.join(__dirname, './src/environments/environment.development.ts');

fs.writeFileSync(targetPath, envConfigFile);
fs.writeFileSync(targetDevPath, envDevConfigFile);

console.log(`Environment files generated with API_URL: ${apiUrl}`);
