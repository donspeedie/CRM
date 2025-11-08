# CRM - Operation Alpha

AI-powered contact management system built for Nimble Development, Real Deal, and Personal connections.

## 🚀 Features (MVP - Weekend Sprint)

### ✅ Core Contact Management
- Add, view, edit, and delete contacts
- Search and filter contacts
- Tag-based organization (Nimble Development, Real Deal, Personal)
- Follow-up date tracking
- Rich contact profiles (email, phone, company, role, notes)

### 🔜 Coming Soon (Week 2+)
- AI Email Agent (forward emails → auto-create contacts)
- Meeting Notes Agent (voice/text → extract contacts + action items)
- Business Card Scanner
- Drip Campaign Engine
- Advanced AI enrichment

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Database**: Firebase Firestore
- **Auth**: Firebase Authentication
- **AI**: Anthropic Claude API
- **Styling**: Tailwind CSS
- **Hosting**: Vercel

## 📋 Prerequisites

- Node.js 18+ installed
- Firebase account (free tier works)
- Anthropic API key (for AI features)
- Git installed

## 🏃‍♂️ Quick Start

### 1. Clone & Install

```bash
# Navigate to the project directory
cd crm

# Install dependencies
npm install
```

### 2. Firebase Setup

#### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project"
3. Name it: "crm-alpha" (or your choice)
4. Disable Google Analytics (optional)
5. Click "Create Project"

#### Enable Authentication
1. In Firebase Console, go to **Authentication** → **Get Started**
2. Click **Sign-in method** tab
3. Enable **Email/Password** provider
4. Save

#### Create Firestore Database
1. In Firebase Console, go to **Firestore Database**
2. Click **Create Database**
3. Start in **Production mode**
4. Choose location closest to you
5. Click **Enable**

#### Update Firestore Rules
1. In Firestore, click **Rules** tab
2. Replace with these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Contacts - users can only access their own
    match /contacts/{contactId} {
      allow read, write: if request.auth != null && 
                          resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                     request.resource.data.userId == request.auth.uid;
    }
    
    // Interactions - users can only access their own
    match /interactions/{interactionId} {
      allow read, write: if request.auth != null && 
                          resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && 
                     request.resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **Publish**

#### Get Firebase Config
1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to "Your apps" section
3. Click **Web** button (</> icon)
4. Register app name: "CRM"
5. Copy the config values

#### Get Service Account (for Admin SDK)
1. In Firebase Console → **Project Settings** → **Service Accounts** tab
2. Click **Generate New Private Key**
3. Download the JSON file
4. Keep this file SECURE (never commit to git!)

### 3. Environment Variables

Create `.env.local` file in the root directory:

```bash
# Copy from .env.example
cp .env.example .env.local
```

Edit `.env.local` with your Firebase config:

```env
# Firebase Config (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Firebase Admin (from Service Account JSON)
FIREBASE_ADMIN_PROJECT_ID=your-project-id
FIREBASE_ADMIN_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"

# Anthropic API (for AI features - Week 2)
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Email Agent (for AI features - Week 2)
EMAIL_CAPTURE_ADDRESS=capture@yourdomain.com
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Create Your Account

1. Click "Sign Up"
2. Enter email: dspeedie@fluidcm.com
3. Create password
4. You're in! 🎉

## 🚢 Deploy to Vercel

### One-Click Deploy

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial CRM setup"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/crm.git
git push -u origin main
```

2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repo
5. Add Environment Variables (same as .env.local)
6. Click "Deploy"

Your CRM will be live at: `https://your-project.vercel.app`

### Custom Domain (Optional)

1. In Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain
3. Follow DNS instructions
4. SSL certificate auto-generated

## 📱 Usage Guide

### Adding Contacts

**Method 1: Quick Add**
1. Click "Add Contact" button
2. Fill in name (required)
3. Add optional details (email, phone, company, etc.)
4. Select tags (Nimble Development, Real Deal, Personal)
5. Set follow-up date if needed
6. Click "Add Contact"

**Method 2: From Email (Coming Week 2)**
- Forward email to capture@yourdomain.com
- AI extracts contact info automatically
- Review and approve

### Managing Follow-Ups

1. Set follow-up dates when adding/editing contacts
2. Click "Follow-Up" in sidebar
3. See overdue, today, and upcoming follow-ups
4. Click contact to view/update

### Search & Filter

- Use search bar on main dashboard
- Searches: name, email, company, phone
- Click tags to filter by category

### Contact Details

- Click any contact card
- View full profile
- Quick actions: email, call
- Edit or delete contact

## 🗂️ Project Structure

```
crm/
├── app/
│   ├── dashboard/          # Main app pages
│   │   ├── add/           # Add contact form
│   │   ├── follow-up/     # Follow-up list
│   │   ├── contact/[id]/  # Contact detail
│   │   └── page.tsx       # Dashboard home
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Login page
├── components/
│   └── AuthProvider.tsx   # Auth context
├── lib/
│   ├── firebase.ts        # Firebase client
│   ├── firebase-admin.ts  # Firebase admin
│   └── contact-service.ts # Firestore operations
├── types/
│   └── contact.ts         # TypeScript types
└── public/                # Static assets
```

## 🔐 Security Notes

### Firestore Rules
The security rules ensure:
- Users only see their own contacts
- Users can't modify other users' data
- All operations require authentication

### Environment Variables
- Never commit `.env.local` to git
- Use Vercel for production secrets
- Rotate keys if exposed

### Firebase Admin Key
- Keep service account JSON private
- Never expose in client-side code
- Only used in server-side API routes

## 🐛 Troubleshooting

### "Firebase not configured"
- Check `.env.local` exists
- Verify all NEXT_PUBLIC_ variables are set
- Restart dev server after changing .env

### "Authentication failed"
- Ensure Email/Password enabled in Firebase Console
- Check for typos in email/password
- Try password reset

### "Permission denied" in Firestore
- Check Firestore rules are published
- Verify user is authenticated
- Ensure userId matches in documents

### Build errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

## 📈 Roadmap

### Week 1 (Current)
- ✅ Authentication
- ✅ Contact CRUD
- ✅ Search & filter
- ✅ Follow-up tracking
- ✅ Tag management

### Week 2
- [ ] AI Email Agent
- [ ] Meeting Notes Agent
- [ ] Business Card Scanner
- [ ] Contact enrichment

### Week 3-4
- [ ] Drip campaigns
- [ ] Email templates
- [ ] Bulk operations
- [ ] Export/import

### Month 2+
- [ ] Project linking (Nimble Development)
- [ ] Deal pipeline
- [ ] Analytics dashboard
- [ ] Mobile app

## 🤝 Support

Questions? Issues?

- Email: dspeedie@fluidcm.com
- Check Firebase Console for errors
- Review Vercel deployment logs

## 📝 License

Private project for Nimble Development / Real Deal

---

**Built with ⚡ for Operation Alpha**
