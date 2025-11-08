# 🚀 CRM Deployment Checklist

## ✅ Pre-Deployment (Do This First)

### 1. Firebase Setup
- [ ] Create Firebase project at console.firebase.google.com
- [ ] Enable Email/Password authentication
- [ ] Create Firestore database (production mode)
- [ ] Update Firestore security rules
- [ ] Get Firebase config (web app credentials)
- [ ] Download service account JSON

### 2. Local Environment
- [ ] Copy .env.example to .env.local
- [ ] Add Firebase config to .env.local
- [ ] Add Firebase Admin credentials to .env.local
- [ ] Test locally: `npm install && npm run dev`
- [ ] Create test account and add sample contact
- [ ] Verify all features work

### 3. Code Repository
- [ ] Initialize git: `git init`
- [ ] Create .gitignore (already done)
- [ ] Make first commit: `git add . && git commit -m "Initial CRM setup"`
- [ ] Create GitHub repo
- [ ] Push code: `git remote add origin [your-repo-url] && git push -u origin main`

## 🌐 Vercel Deployment

### 4. Deploy to Vercel
- [ ] Go to vercel.com and sign in with GitHub
- [ ] Click "New Project"
- [ ] Import your CRM repository
- [ ] Configure project:
  - Framework Preset: Next.js
  - Root Directory: ./
  - Build Command: `npm run build`
  - Output Directory: (leave default)

### 5. Environment Variables
Add these in Vercel dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY
```

⚠️ **IMPORTANT**: For FIREBASE_ADMIN_PRIVATE_KEY, include the quotes and \n characters:
```
"-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

- [ ] Add all environment variables
- [ ] Click "Deploy"

### 6. Verify Deployment
- [ ] Wait for build to complete (2-3 minutes)
- [ ] Click "Visit" to open your live site
- [ ] Test sign up with a new account
- [ ] Add a test contact
- [ ] Verify all features work

## 🎯 Post-Deployment

### 7. Domain Setup (Optional)
- [ ] In Vercel: Settings → Domains
- [ ] Add your custom domain
- [ ] Update DNS records (provided by Vercel)
- [ ] Wait for SSL certificate (auto-generated)

### 8. Firebase Production Settings
- [ ] In Firebase Console → Authentication → Settings
- [ ] Add your production domain to authorized domains
- [ ] In Firestore, verify rules are correct for production

### 9. Testing Checklist
Test these features on production:
- [ ] User sign up
- [ ] User login
- [ ] Add contact
- [ ] Edit contact
- [ ] Delete contact
- [ ] Search contacts
- [ ] Filter by tags
- [ ] Follow-up page
- [ ] Mobile responsiveness

### 10. Security Review
- [ ] Verify .env.local is NOT in git
- [ ] Confirm Firestore rules prevent unauthorized access
- [ ] Check that Firebase Admin key is secure
- [ ] Enable 2FA on Firebase account
- [ ] Enable 2FA on Vercel account

## 📱 First Use

### 11. Create Your Real Account
- [ ] Go to your production URL
- [ ] Sign up with dspeedie@fluidcm.com
- [ ] Add your first real contacts
- [ ] Set up follow-up dates
- [ ] Test workflow end-to-end

## 🔜 Week 2 Setup (AI Features)

### 12. Anthropic API
- [ ] Get API key from console.anthropic.com
- [ ] Add to Vercel environment variables:
  - ANTHROPIC_API_KEY
- [ ] Redeploy application

### 13. Email Agent Setup
- [ ] Set up email forwarding
- [ ] Configure capture@yourdomain.com
- [ ] Add EMAIL_CAPTURE_ADDRESS to environment variables
- [ ] Test email import feature

## 🐛 Troubleshooting

### Build Fails
1. Check Vercel build logs
2. Verify all environment variables are set
3. Test build locally: `npm run build`

### Authentication Issues
1. Check Firebase Console → Authentication
2. Verify production domain is authorized
3. Check browser console for errors

### Firestore Permission Errors
1. Verify Firestore rules are published
2. Check user is authenticated
3. Verify userId matches in documents

### Environment Variable Issues
1. Make sure NO spaces around = in .env
2. Wrap private key in quotes
3. Include \n in private key
4. Redeploy after adding variables

## 📊 Monitoring

### 15. Set Up Monitoring
- [ ] Check Vercel Analytics
- [ ] Review Firebase Usage dashboard
- [ ] Set up budget alerts in Firebase
- [ ] Monitor Anthropic API usage (Week 2)

## ✨ Success Metrics

Your CRM is successfully deployed when:
- ✅ You can access it from any device
- ✅ You can create an account
- ✅ You can add/edit/delete contacts
- ✅ Search and filters work
- ✅ Follow-ups are tracked
- ✅ Mobile view looks good
- ✅ SSL certificate is active (https)

---

## 🎉 You're Live!

**Production URL**: https://your-project.vercel.app
**Firebase Console**: https://console.firebase.google.com/project/your-project
**Vercel Dashboard**: https://vercel.com/dashboard

**Next Steps**:
1. Start adding real contacts
2. Set up follow-up workflow
3. Test daily for a week
4. Week 2: Add AI features
5. Month 2: Advanced features

---

**Questions?** Email dspeedie@fluidcm.com
