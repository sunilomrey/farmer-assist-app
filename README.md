# Farmer Assist

Minimal README: development, build, and deployment steps for the web frontend.

Prerequisites
- Node.js and npm installed
- AWS CLI configured (credentials + region)

Quick start (development)

```bash
npm install
npx expo start --web
# or `npm run web`
```

TypeScript check

```bash
npx tsc --noEmit
```

Build (static web export)

```bash
# export static web assets to `dist/`
npm run export:web

# production build (uses production backend URL)
npm run build:prod
```

Deploy to S3 and invalidate CloudFront

```bash
# sync `dist/` to S3 (bucket used in this project)
npm run deploy:prod

# invalidate CloudFront distribution (example uses env var CF_DIST_ID)
# replace CF_DIST_ID or export it in your shell
export CF_DIST_ID=EBHMONH5OTIXZ
npm run invalidate:cloudfront
# OR directly with AWS CLI:
aws cloudfront create-invalidation --distribution-id EBHMONH5OTIXZ --paths '/*'
```

Deployment details
- S3 bucket used: `farmer-assist-app`
- Frontend CloudFront distribution: `EBHMONH5OTIXZ` (domain: `d1nn0a67vqzk27.cloudfront.net`)
- Frontend public URL: https://d1nn0a67vqzk27.cloudfront.net

Backend (production) URL configured for builds
- https://d193g30q9y2nj2.cloudfront.net

Useful package.json scripts
- `npm run export:web` — export static web to `dist/`
- `npm run build:prod` — production export (sets production backend URL)
- `npm run deploy:prod` — sync `dist/` to `s3://farmer-assist-app`
- `npm run invalidate:cloudfront` — runs invalidation (requires `CF_DIST_ID` env var)

If you want, I can add a small GitHub Actions workflow to automate build + deploy.
