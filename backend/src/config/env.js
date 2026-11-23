import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const backendEnvPath = path.resolve(currentDir, '../../.env');
const projectRootEnvPath = path.resolve(currentDir, '../../../.env');

// Load backend/.env first. Root .env remains a compatibility fallback only.
dotenv.config({ path: backendEnvPath });
dotenv.config({ path: projectRootEnvPath });

// Preserve older root-level mail configuration while supporting backend/.env.
if (!process.env.PORTFOLIO_NOTIFICATION_EMAIL && process.env.ADMIN_EMAIL) {
  process.env.PORTFOLIO_NOTIFICATION_EMAIL = process.env.ADMIN_EMAIL;
}
