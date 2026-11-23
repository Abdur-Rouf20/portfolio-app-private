# Portfolio app compatibility + SMTP patch

This patch is intended for the **rouf-portfolio-app** project generated earlier (the one with `backend/` and `frontend/`).

It does not contain your credentials. Keep your existing `.env` files.

## What this patch changes

- Reads `backend/.env` first, then the project-root `.env` for any missing settings.
- Keeps the current Atlas setting (`MONGODB_URI`) working and also supports the older `MONGO_URI` name.
- Reuses the existing `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, and `ADMIN_EMAIL` settings.
- Sends an email notification to the configured portfolio inbox when a visitor submits the contact form.
- Continues saving the message to MongoDB, so the admin dashboard retains an inbox even if SMTP is temporarily unavailable.
- Adds a small per-IP contact-form rate limit.

## Merge steps (Windows)

1. Stop the backend (`Ctrl+C` in its terminal).
2. Extract this patch ZIP.
3. Copy the patch's `backend` folder into your existing `rouf-portfolio-app` folder and choose **merge/replace** when prompted. It only contains the files listed below.
4. Copy the `.env` file from your earlier project (`portfolio-ecosystem/portfolio-app/.env`) into the **root** of `rouf-portfolio-app`, next to `README.md`. Do not overwrite `rouf-portfolio-app/backend/.env`.
   - This copies your existing settings; you do not need to edit the SMTP values.
   - Your existing `backend/.env` is loaded first, so its current Atlas `MONGODB_URI` and JWT settings keep priority.
   - The root `.env` supplies the legacy SMTP settings that are not already defined in `backend/.env`.
5. Open CMD in `rouf-portfolio-app\backend` and run:

   ```cmd
   npm install nodemailer
   ```

   This updates `backend/package.json` and `backend/package-lock.json` without replacing your existing dependencies.
6. Start the backend:

   ```cmd
   npm run dev
   ```

7. Submit a test message from the public Contact page. Check:
   - The API response says `emailNotificationSent: true`.
   - The configured portfolio inbox receives the notification.
   - The message appears in the admin dashboard.

## Important notes

- Do not send or commit either `.env` file to GitHub.
- The old `.env` in the uploaded project used `MONGO_URI` with a local MongoDB URL. The new backend prefers `MONGODB_URI`, so your currently working Atlas connection in `backend/.env` remains in use.
- If your SMTP provider is Gmail, `SMTP_PASS` should be the Gmail App Password, not your normal Google account password.
- If email delivery fails, the contact message is still stored in MongoDB. Check the backend terminal for `Contact email delivery failed` and verify the SMTP host, port, username, app password, and account security settings.
- This patch does not add or start Playwright, Newman, JMeter, Docker, Nginx, or CI/CD work.
