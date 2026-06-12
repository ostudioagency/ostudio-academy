# O'Studio Academy — MVP

Landing page + liste d'attente + tableau admin

## Stack
- **Next.js 14** (App Router)
- **Tailwind CSS** (design tokens personnalisés)
- **Supabase** (base de données PostgreSQL)
- **TypeScript**

---

## Installation rapide

### 1. Cloner et installer
```bash
cd ostudio-academy
npm install
```

### 2. Créer le projet Supabase
1. Va sur [supabase.com](https://supabase.com) → Nouveau projet
2. Dans **SQL Editor**, exécute le contenu de `supabase-schema.sql`
3. Récupère tes clés dans **Settings → API**

### 3. Variables d'environnement
```bash
cp .env.example .env.local
```

Remplis `.env.local` :
```env
NEXT_PUBLIC_SUPABASE_URL=https://XXXXXX.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Pour l'écriture sécurisée (Settings → API → service_role)
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Mot de passe admin de ton choix
ADMIN_SECRET=change_moi_ici
```

### 4. Lancer en développement
```bash
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

---

## Pages

| URL | Description |
|-----|-------------|
| `/` | Landing page complète |
| `/confirmation` | Page de confirmation post-inscription |
| `/admin` | Tableau de bord admin (protégé par clé secrète) |

## API Routes

| Endpoint | Méthode | Description |
|----------|---------|-------------|
| `/api/waitlist` | POST | Inscription liste d'attente |
| `/api/admin` | GET | Lire les inscriptions (requiert `x-admin-secret`) |

---

## Accès admin

Va sur `/admin` et entre la valeur de `ADMIN_SECRET` dans ton `.env.local`.

### Export CSV
Le bouton "Exporter CSV" dans l'admin génère un fichier compatible Excel (encodage UTF-8 BOM).

---

## Déploiement sur Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Ajouter les variables d'environnement dans Vercel Dashboard
# Project → Settings → Environment Variables
```

---

## Structure des fichiers

```
ostudio-academy/
├── app/
│   ├── layout.tsx          # Layout global + Google Fonts
│   ├── page.tsx            # Homepage
│   ├── globals.css         # Design tokens + styles globaux
│   ├── confirmation/
│   │   └── page.tsx        # Page de confirmation
│   ├── admin/
│   │   └── page.tsx        # Tableau de bord admin
│   └── api/
│       ├── waitlist/
│       │   └── route.ts    # POST inscription
│       └── admin/
│           └── route.ts    # GET inscriptions (auth)
├── components/
│   ├── Navbar.tsx          # Navigation fixe
│   ├── Hero.tsx            # Section hero
│   ├── About.tsx           # Présentation académie
│   ├── ForWho.tsx          # Pour qui
│   ├── Programs.tsx        # Programmes à venir
│   ├── WaitlistForm.tsx    # Formulaire liste d'attente
│   └── Footer.tsx          # Pied de page
├── lib/
│   └── supabase.ts         # Client Supabase + types
├── supabase-schema.sql     # Schéma base de données
├── tailwind.config.js      # Design tokens
└── .env.example            # Template variables d'env
```

---

## Design Tokens

| Token | Valeur | Usage |
|-------|--------|-------|
| `cream` | `#FAF7F2` | Fond principal |
| `obsidian` | `#0D0D0D` | Texte, sections sombres |
| `gold` | `#C9A96E` | Accents, CTA |
| `gold-light` | `#E8C98A` | Shimmer, hover |
| `gold-dark` | `#8B7355` | Gold profond |

Typographie : **Cormorant Garamond** (display) + **Inter** (corps)

---

## Prochaines étapes (post-MVP)

- [ ] Authentification admin robuste (NextAuth ou Supabase Auth)
- [ ] Email de confirmation automatique (Resend ou SendGrid)
- [ ] Cours et modules de formation
- [ ] Système de paiement (Stripe)
- [ ] Agents IA intégrés
- [ ] Espace membre
