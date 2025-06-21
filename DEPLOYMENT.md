# Deployment Guide

This guide covers deployment options for the EMR AI Enhancement System across different platforms.

## 🚀 Quick Deploy Options

### Vercel (Recommended)

1. **One-Click Deploy**:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/emr-ai-enhancement-system)

2. **Manual Deployment**:
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   
   # For production
   vercel --prod
   ```

3. **Environment Variables**:
   - Go to Vercel Dashboard → Project → Settings → Environment Variables
   - Add all variables from `.env.example`
   - Ensure `VITE_TEMPO=false` for production

### Netlify

1. **One-Click Deploy**:
   [![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/your-username/emr-ai-enhancement-system)

2. **Manual Deployment**:
   ```bash
   # Build the project
   npm run build
   
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

3. **Configuration**:
   - The `netlify.toml` file is already configured
   - Add environment variables in Netlify Dashboard → Site Settings → Environment Variables

## 🐳 Docker Deployment

### Local Docker

```bash
# Build the image
docker build -t emr-ai-system .

# Run the container
docker run -p 8080:8080 emr-ai-system
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker

```bash
# Build for production
docker build -t emr-ai-system:prod .

# Run with environment variables
docker run -d \
  --name emr-ai-prod \
  -p 80:8080 \
  --env-file .env.production \
  --restart unless-stopped \
  emr-ai-system:prod
```

## ☁️ Cloud Platform Deployment

### AWS (Amazon Web Services)

#### AWS Amplify
```bash
# Install AWS Amplify CLI
npm install -g @aws-amplify/cli

# Initialize Amplify
amplify init

# Add hosting
amplify add hosting

# Deploy
amplify publish
```

#### AWS S3 + CloudFront
```bash
# Build the project
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Google Cloud Platform

#### Firebase Hosting
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize
firebase login
firebase init hosting

# Deploy
firebase deploy
```

#### Google Cloud Run
```bash
# Build and push to Container Registry
gcloud builds submit --tag gcr.io/PROJECT_ID/emr-ai-system

# Deploy to Cloud Run
gcloud run deploy --image gcr.io/PROJECT_ID/emr-ai-system --platform managed
```

### Microsoft Azure

#### Azure Static Web Apps
```bash
# Install Azure CLI
az extension add --name staticwebapp

# Create static web app
az staticwebapp create \
  --name emr-ai-system \
  --resource-group myResourceGroup \
  --source https://github.com/your-username/emr-ai-enhancement-system \
  --location "Central US" \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

## 🔧 Environment Configuration

### Production Environment Variables

```env
# Essential Production Variables
NODE_ENV=production
VITE_TEMPO=false

# API Keys (Required for AI functionality)
VITE_OPENAI_API_KEY=sk-...
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_GOOGLE_API_KEY=AIza...

# Security (Required)
VITE_ENCRYPTION_KEY=your-32-char-key
VITE_AUDIT_WEBHOOK=https://your-webhook.com

# EMR Integration
VITE_HL7_ENDPOINT=https://your-hl7-api.com
VITE_FHIR_ENDPOINT=https://your-fhir-api.com

# Monitoring
VITE_SENTRY_DSN=https://your-sentry-dsn
```

### Development vs Production

| Variable | Development | Production |
|----------|-------------|------------|
| `VITE_TEMPO` | `true` | `false` |
| `NODE_ENV` | `development` | `production` |
| API Keys | Optional | Required |
| HTTPS | Optional | Required |
| Error Tracking | Optional | Required |

## 🔒 Security Considerations

### HTTPS Configuration

- **Vercel/Netlify**: HTTPS enabled by default
- **Custom domains**: Configure SSL certificates
- **Docker**: Use reverse proxy (nginx) with SSL

### Content Security Policy

The application includes CSP headers for security:

```
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.tempolabs.ai; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https:;
```

### HIPAA Compliance

- Enable `VITE_HIPAA_MODE=true` in production
- Configure audit logging webhook
- Ensure data encryption at rest and in transit
- Regular security audits and penetration testing

## 📊 Monitoring & Logging

### Error Tracking

```bash
# Add Sentry for error tracking
npm install @sentry/react @sentry/tracing
```

### Performance Monitoring

- Use Vercel Analytics or Netlify Analytics
- Configure Google Analytics or similar
- Monitor Core Web Vitals

### Health Checks

- `/health` endpoint available in Docker deployment
- Configure uptime monitoring (Pingdom, UptimeRobot)
- Set up alerts for downtime

## 🚀 Performance Optimization

### Build Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-analyzer dist

# Optimize images
npm install -D vite-plugin-imagemin
```

### CDN Configuration

- Static assets automatically cached on Vercel/Netlify
- Configure CloudFront for AWS deployments
- Use appropriate cache headers

### Database Optimization

- Use connection pooling for database connections
- Implement caching strategies (Redis)
- Optimize queries and indexes

## 🔄 CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

## 🧪 Testing & Quality Assurance

### Pre-Deployment Testing Checklist

1. **Component Testing**:
   ```bash
   # Test all components render correctly
   npm run dev
   # Navigate to each tab and verify functionality
   # Test AI assistance panel interactions
   # Verify MCP status dashboard updates
   ```

2. **Build Testing**:
   ```bash
   # Test production build
   npm run build
   npm run preview
   
   # Verify no console errors
   # Check all routes work correctly
   # Test responsive design
   ```

3. **Environment Testing**:
   ```bash
   # Test with different environment variables
   VITE_TEMPO=false npm run build
   # Verify production optimizations
   ```

4. **Performance Testing**:
   - Lighthouse audit (aim for 90+ scores)
   - Bundle size analysis
   - Load time optimization
   - Memory leak detection

### Automated Testing Setup

```bash
# Add testing dependencies
npm install -D @testing-library/react @testing-library/jest-dom vitest jsdom

# Create test configuration
echo 'import { defineConfig } from "vitest/config"
export default defineConfig({
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"]
  }
})' > vitest.config.ts
```

## 🆘 Troubleshooting

### Common Deployment Issues

1. **Build Failures**:
   - Check Node.js version (18+ required)
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
   - Verify environment variables are properly set
   - Check for TypeScript errors: `npm run build`

2. **Runtime Errors**:
   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check CORS configuration
   - Ensure all required dependencies are installed
   - Verify Tempo DevTools configuration

3. **Performance Issues**:
   - Optimize bundle size with `npm run build && npx vite-bundle-analyzer dist`
   - Enable compression (gzip/brotli)
   - Use CDN for static assets
   - Implement code splitting for large components

4. **Tempo-Specific Issues**:
   - Ensure `VITE_TEMPO=true` for development
   - Set `VITE_TEMPO=false` for production
   - Verify tempo-devtools is properly installed
   - Check storyboard routing configuration

### Support Resources

- 📧 Email: support@emr-ai-system.com
- 💬 Discord: [Join our community](https://discord.gg/emr-ai)
- 📖 Documentation: [Full docs](https://docs.emr-ai-system.com)
- 🐛 Issues: [GitHub Issues](https://github.com/your-username/emr-ai-enhancement-system/issues)

---

**Need help with deployment? Contact our support team for assistance with enterprise deployments and custom configurations.**
