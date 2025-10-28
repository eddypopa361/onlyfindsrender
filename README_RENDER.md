# OnlyFinds - Render Deployment Guide

## Deployment pe Render

### 1. Pregătire Repo
Repo-ul este configurat cu toate fișierele necesare pentru deployment pe Render.

### 2. Configurare Render Dashboard

1. **Conectează repo-ul** la Render:
   - Mergi la https://dashboard.render.com
   - Click pe "New +" → "Web Service"
   - Conectează repo-ul `onlyfindsrender` de pe GitHub

2. **Setări automate**:
   Render va detecta automat `render.yaml` și va configura:
   - Build Command: `npm install && npm run build`
   - Start Command: `npm run start`
   - Health Check Path: `/health`

### 3. Variabile de Mediu

Adaugă următoarele în Render Dashboard (Environment):

#### Database (Supabase)
```
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

#### Supabase Config
```
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=eyJ... (your anon key)
SUPABASE_SERVICE_ROLE_KEY=eyJ... (your service role key)
```

#### Session
```
SESSION_SECRET=random-string-min-32-characters
```

### 4. Deploy

1. După ce adaugi variabilele de mediu, click pe **"Create Web Service"**
2. Render va rula primul build automat
3. Site-ul va fi disponibil la: `https://onlyfinds.onrender.com` (sau custom domain)

### 5. Health Check

După deployment, verifică:
- `https://your-app.onrender.com/health` - ar trebui să returneze status healthy
- Site-ul principal ar trebui să fie funcțional

### 6. Database Migration

Dacă ai nevoie să rulezi migrații:
```bash
# Din Render Shell (Dashboard → Shell)
npm run db:push
```

### 7. Custom Domain (Opțional)

În Render Dashboard:
1. Mergi la Settings → Custom Domain
2. Adaugă domeniul tău
3. Configurează DNS records conform instrucțiunilor

## Troubleshooting

### Build Failures
- Verifică logs în Render Dashboard
- Asigură-te că toate dependențele sunt în `package.json`

### Runtime Errors
- Verifică că toate variabilele de mediu sunt setate corect
- Verifică logs în "Logs" tab

### Database Connection Issues
- Verifică că `DATABASE_URL` este corect (folosește connection pooler)
- Asigură-te că Supabase permite conexiuni externe

## Caracteristici

- ✅ Auto-deploy pe push la main branch
- ✅ Health check monitoring
- ✅ Free SSL certificates
- ✅ CDN și caching
- ✅ Rollback ușor la versiuni anterioare
- ✅ Environment variables securizate

## Comenzi Utile

```bash
# Local development
npm run dev

# Build local
npm run build

# Test production build local
npm run start

# Type checking
npm run check
```

## Port Configuration

Aplicația rulează pe portul **5000** (configurat în `server/index.ts`).
Render va expune automat aplicația pe port 443 (HTTPS) și 80 (HTTP).
