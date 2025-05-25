# E3 Circle - Production Deployment Guide

This guide covers deploying the E3 Circle profile system to production with proper security, performance, and reliability considerations.

## Pre-Deployment Checklist

### 🔒 Security Requirements

#### 1. Environment Variables
```bash
# Required environment variables
VITE_SUPABASE_URL=your-production-supabase-url
VITE_SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # Server-side only
JWT_SECRET=your-strong-jwt-secret
ENCRYPTION_KEY=your-32-character-encryption-key
```

#### 2. Password Security
**⚠️ CRITICAL**: Replace client-side password hashing with proper server-side implementation:

```typescript
// server/auth.js (Node.js/Express example)
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};
```

#### 3. File Upload Security
Implement secure file handling:

```typescript
// Use a service like Cloudinary, AWS S3, or similar
const uploadProfilePhoto = async (file) => {
  // Validate file type and size
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    throw new Error('Invalid file type');
  }
  
  if (file.size > 5 * 1024 * 1024) { // 5MB
    throw new Error('File too large');
  }
  
  // Scan for viruses (use ClamAV or similar)
  // Upload to secure storage
  // Return secure URL
};
```

#### 4. Input Validation & Sanitization
Server-side validation is essential:

```typescript
// server/validation.js
const validator = require('validator');

const validateUserInput = (data) => {
  return {
    email: validator.isEmail(data.email) ? validator.normalizeEmail(data.email) : null,
    name: validator.escape(data.name),
    mobile: validator.isMobilePhone(data.mobile) ? data.mobile : null,
    urls: data.urls.map(url => validator.isURL(url) ? url : null).filter(Boolean)
  };
};
```

### 🛡️ Database Security

#### 1. Row Level Security (RLS) Policies
Enhance Supabase RLS policies:

```sql
-- More restrictive user policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only view public profile data" ON users
  FOR SELECT USING (
    -- Only allow access to non-sensitive fields for public viewing
    current_setting('request.jwt.claims', true)::json->>'user_code' = user_code
    OR 
    -- Allow limited public access for profile viewing
    TRUE
  );

CREATE POLICY "Users can only update their own data" ON users
  FOR UPDATE USING (
    auth.jwt()->>'user_id' = id::text
  );

-- Secure link policies
CREATE POLICY "Links visible based on user privacy settings" ON user_links
  FOR SELECT USING (
    -- Add privacy controls
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = user_links.user_id 
      AND users.is_onboarding_complete = true
    )
  );
```

#### 2. Database Backup & Recovery
```sql
-- Set up automated backups
-- Configure point-in-time recovery
-- Test backup restoration procedures
```

### 🚀 Performance Optimization

#### 1. Build Optimization
```bash
# Optimize build for production
npm run build

# Analyze bundle size
npm install -g webpack-bundle-analyzer
npx webpack-bundle-analyzer build/static/js/*.js
```

#### 2. Image Optimization
```typescript
// Implement progressive image loading
const OptimizedImage = ({ src, alt, className }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className={`relative ${className}`}>
      {!loaded && <Skeleton className="absolute inset-0" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`transition-opacity ${loaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
      />
    </div>
  );
};
```

#### 3. Caching Strategy
```typescript
// Service Worker for caching (sw.js)
const CACHE_NAME = 'e3-circle-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  // Add other static assets
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});
```

## Deployment Platforms

### Option 1: Vercel (Recommended for React apps)

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Deploy
```bash
# Build the project
npm run build

# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

#### 3. Configure vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "build/**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;"
        }
      ]
    }
  ]
}
```

### Option 2: Netlify

#### 1. Build Configuration
```toml
# netlify.toml
[build]
  publish = "build"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains"
```

### Option 3: AWS S3 + CloudFront

#### 1. S3 Bucket Setup
```bash
# Create S3 bucket
aws s3 mb s3://e3circle-production

# Configure bucket for static hosting
aws s3 website s3://e3circle-production --index-document index.html --error-document index.html

# Upload build files
aws s3 sync build/ s3://e3circle-production --delete
```

#### 2. CloudFront Distribution
```json
{
  "DistributionConfig": {
    "CallerReference": "e3circle-production",
    "Comment": "E3 Circle Production",
    "DefaultCacheBehavior": {
      "TargetOriginId": "e3circle-s3",
      "ViewerProtocolPolicy": "redirect-to-https",
      "Compress": true,
      "CachePolicyId": "4135ea2d-6df8-44a3-9df3-4b5a84be39ad"
    },
    "Origins": [
      {
        "Id": "e3circle-s3",
        "DomainName": "e3circle-production.s3.amazonaws.com",
        "S3OriginConfig": {
          "OriginAccessIdentity": ""
        }
      }
    ],
    "Enabled": true
  }
}
```

## Custom Domain Setup

### 1. DNS Configuration
```bash
# For apex domain (example.com)
A     @    192.0.2.1
AAAA  @    2001:db8::1

# For subdomain (app.example.com)
CNAME app  your-deployment-domain.vercel.app
```

### 2. SSL Certificate
```bash
# Let's Encrypt (if using custom server)
sudo certbot --nginx -d e3circle.com -d www.e3circle.com

# Or use platform-provided SSL (Vercel, Netlify, etc.)
```

## Monitoring & Analytics

### 1. Error Tracking
```typescript
// Sentry integration
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.REACT_APP_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  beforeSend(event) {
    // Filter out sensitive data
    if (event.user) {
      delete event.user.email;
    }
    return event;
  }
});

// Wrap your app
const App = Sentry.withErrorBoundary(AppComponent, {
  fallback: ErrorFallback
});
```

### 2. Performance Monitoring
```typescript
// Google Analytics 4
import { gtag } from 'ga-gtag';

gtag('config', 'GA_MEASUREMENT_ID', {
  page_title: document.title,
  page_location: window.location.href
});

// Track user interactions
const trackProfileView = (userCode) => {
  gtag('event', 'profile_view', {
    user_code: userCode,
    page_title: 'Profile View'
  });
};
```

### 3. Health Checks
```typescript
// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION
  });
});
```

## Security Headers & CSP

### Content Security Policy
```typescript
// helmet.js configuration
const helmet = require('helmet');

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "fonts.googleapis.com"],
      fontSrc: ["'self'", "fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://your-supabase-url.supabase.co"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

## Backup & Disaster Recovery

### 1. Database Backups
```sql
-- Automated Supabase backups
-- Manual backup script
pg_dump --host=your-host --port=5432 --username=postgres --dbname=postgres --file=backup.sql
```

### 2. Code Repository
```bash
# Ensure code is backed up in multiple locations
git remote add backup https://backup-repo-url.git
git push backup main
```

### 3. Recovery Procedures
1. **Database Recovery**: Test restoration from backup
2. **Application Recovery**: Automated deployment from git
3. **DNS Failover**: Configure backup domains
4. **Monitoring**: Set up alerts for downtime

## Performance Budgets

### Bundle Size Limits
```json
{
  "bundlesize": [
    {
      "path": "./build/static/js/*.js",
      "maxSize": "300kb"
    },
    {
      "path": "./build/static/css/*.css",
      "maxSize": "50kb"
    }
  ]
}
```

### Core Web Vitals Targets
- **Largest Contentful Paint (LCP)**: < 2.5 seconds
- **First Input Delay (FID)**: < 100 milliseconds
- **Cumulative Layout Shift (CLS)**: < 0.1

## Legal & Compliance

### 1. Privacy Policy
- Data collection practices
- Cookie usage
- User rights (GDPR, CCPA)
- Data retention policies

### 2. Terms of Service
- User responsibilities
- Platform usage rules
- Account termination procedures
- Liability limitations

### 3. GDPR Compliance
```typescript
// Data export functionality
const exportUserData = async (userId) => {
  const userData = await getUserData(userId);
  const userLinks = await getUserLinks(userId);
  
  return {
    profile: userData,
    links: userLinks,
    exported_at: new Date().toISOString()
  };
};

// Data deletion
const deleteUserAccount = async (userId) => {
  await deleteUserLinks(userId);
  await deleteUserData(userId);
  await logDataDeletion(userId);
};
```

## Launch Checklist

### Pre-Launch
- [ ] Security audit completed
- [ ] Performance testing passed
- [ ] Backup procedures tested
- [ ] SSL certificates installed
- [ ] Monitoring configured
- [ ] Error tracking enabled
- [ ] Analytics implemented

### Launch Day
- [ ] Deploy to production
- [ ] Verify all user journeys work
- [ ] Test onboarding flow end-to-end
- [ ] Verify profile display functionality
- [ ] Check mobile responsiveness
- [ ] Test error scenarios

### Post-Launch
- [ ] Monitor error rates
- [ ] Track performance metrics
- [ ] Monitor user feedback
- [ ] Check server resources
- [ ] Verify backup processes
- [ ] Review security logs

## Maintenance & Updates

### Regular Tasks
- **Weekly**: Review error logs, performance metrics
- **Monthly**: Security updates, dependency updates
- **Quarterly**: Security audit, performance review
- **Annually**: Penetration testing, disaster recovery testing

### Update Procedures
1. Test updates in staging environment
2. Prepare rollback plan
3. Deploy during low-traffic periods
4. Monitor for issues post-deployment
5. Communicate changes to users if needed

This deployment guide ensures a secure, performant, and reliable production deployment of the E3 Circle profile system.