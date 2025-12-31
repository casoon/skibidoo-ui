# NPM Publish Checklist for @casoon/skibidoo-ui v1.0.0

## ✅ Pre-Publish Checklist

- [x] All components implemented (11/11)
- [x] Registry updated with all components
- [x] README.md with comprehensive documentation
- [x] CHANGELOG.md created
- [x] Version bumped to 1.0.0
- [x] Build successful (`pnpm build`)
- [x] Git commit created
- [ ] Git push to GitHub
- [ ] Create GitHub Release
- [ ] npm publish

## 📦 Publishing Steps

### 1. Verify Build Output

```bash
cd ~/GitHub/skibidoo-ui
pnpm build
ls -la dist/
```

**Expected Output:**
```
dist/
├── client/
│   ├── index.js
│   └── index.d.ts
├── runtime/
│   ├── index.js
│   └── index.d.ts
├── types/
│   ├── index.js
│   └── index.d.ts
├── styles/
│   ├── index.css
│   └── themes/
├── index.js
└── index.d.ts
```

### 2. Test Package Locally

```bash
# Pack the package
pnpm pack

# This creates: casoon-skibidoo-ui-1.0.0.tgz

# Test install in another project
cd /path/to/test-project
npm install /Users/jseidel/GitHub/skibidoo-ui/casoon-skibidoo-ui-1.0.0.tgz
```

### 3. Push to GitHub

```bash
cd ~/GitHub/skibidoo-ui
git push origin main
git tag v1.0.0
git push origin v1.0.0
```

### 4. Create GitHub Release

Go to: https://github.com/casoon/skibidoo-ui/releases/new

**Tag:** v1.0.0  
**Title:** v1.0.0 - Complete UI Component Library  
**Description:** (Copy from CHANGELOG.md)

### 5. Login to npm

```bash
npm login
# Enter credentials for casoon account
```

### 6. Publish to npm

```bash
cd ~/GitHub/skibidoo-ui

# Dry run (check what will be published)
npm publish --dry-run

# Actual publish (public access)
npm publish --access public
```

### 7. Verify Publication

```bash
# Check npm page
open https://www.npmjs.com/package/@casoon/skibidoo-ui

# Test installation
npm install @casoon/skibidoo-ui@1.0.0
```

## 📊 Package Contents

**Total Size:** ~50 KB (estimated)

**Included:**
- dist/ (compiled JS + TS definitions)
- src/components/**/*.astro (source components)
- src/registry.ts (registry system)
- src/styles/ (CSS files)
- README.md
- CHANGELOG.md
- LICENSE

**Excluded:**
- node_modules/
- .git/
- examples/
- *.test.ts

## 🔍 Post-Publish Verification

### Test Installation in skibidoo-admin

```bash
cd ~/GitHub/skibidoo-admin
pnpm add @casoon/skibidoo-ui@1.0.0
```

### Test Import

```astro
---
import { Button, Input, Toast, ToastContainer } from '@casoon/skibidoo-ui';
---

<Button variant="primary">Test Button</Button>
<Input name="test" label="Test Input" />
<ToastContainer position="top-right" />
```

### Test Registry

```typescript
import { createUIRegistry, listComponentIds } from '@casoon/skibidoo-ui/registry';

const registry = createUIRegistry();
console.log(listComponentIds());
// Expected: ['ui-button', 'ui-input', ..., 'ui-toast-container']
```

## 🎉 Success Criteria

- [ ] Package visible on npmjs.com
- [ ] README renders correctly
- [ ] Can install in test project
- [ ] All components importable
- [ ] Registry works correctly
- [ ] TypeScript types available
- [ ] No console errors

## 🔄 Rollback (if needed)

```bash
# Unpublish (only within 72 hours of initial publish)
npm unpublish @casoon/skibidoo-ui@1.0.0

# Deprecate (if already in use)
npm deprecate @casoon/skibidoo-ui@1.0.0 "Deprecated due to critical bug. Use 1.0.1 instead."
```

## 📝 Next Steps After Publish

1. Update skibidoo-admin to use v1.0.0
2. Update skibidoo-storefront to use v1.0.0
3. Add npm badge to README
4. Tweet/announce release
5. Update skibidoo-concept/TODO-2025.md (mark UI Library as 100%)

---

**Created:** 2025-12-31  
**Status:** Ready to Publish  
**Version:** 1.0.0
