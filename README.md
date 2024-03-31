## Getting Started
First, run the development server:

```bash
npm run dev
```

## Stripe Started
```bash
stripe listen --forward-to http://localhost:3000/api/webhooks
```

## How to Deploy
### Functions
```bash
 firebase deploy --only functions
```
### Hosting
Preview -> developへのマージ or Push 
Production -> mainへのマージ or Push
