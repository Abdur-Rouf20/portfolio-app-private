import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const backendEnvPath = path.resolve(currentDir, '../../.env');
const projectRootEnvPath = path.resolve(currentDir, '../../../.env');

// Load the active backend configuration first (including the working Atlas URI).
dotenv.config({ path: backendEnvPath });

// Load the previous project's root .env only for variables not already supplied.
// This allows the existing SMTP settings to be reused without replacing Atlas/JWT values.
const legacyConfig = dotenv.config({ path: projectRootEnvPath });

if (legacyConfig.parsed?.ADMIN_EMAIL && !process.env.PORTFOLIO_NOTIFICATION_EMAIL) {
  process.env.PORTFOLIO_NOTIFICATION_EMAIL = legacyConfig.parsed.ADMIN_EMAIL;
}
