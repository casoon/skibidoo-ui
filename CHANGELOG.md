# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-12-31

### Added

#### New Components
- **Toast** - Auto-dismiss notification component with variants (info, success, warning, error)
- **ToastContainer** - Queue manager for multiple toast notifications with positioning

#### Component Improvements
- **Button** - Complete implementation with variants, sizes, loading states, and link support
- **Input** - Full-featured text input with validation states, hints, and error messages
- **Select** - Custom-styled dropdown with options and validation
- **Card** - Container component with variants (default, bordered, elevated)
- **Alert** - Alert box with dismiss functionality and variants
- **Grid** - Data table with sorting, filtering, and pagination (existing)
- **Form** - Dynamic form with Zod validation (existing)
- **Modal** - Dialog component with backdrop (existing)
- **DatePicker** - Calendar popup component (existing)

#### Registry Enhancements
- Added all 11 components to central registry
- Improved component metadata with better descriptions
- Added category-based filtering (general, form, layout, feedback, data, overlay)
- Added `listComponentIds()`, `listCategories()`, `getComponentDef()` utility functions
- Export all components for direct import

#### Documentation
- Comprehensive README with all component examples
- Component API documentation with TypeScript types
- Usage examples for registry patterns
- Tailwind CSS configuration guide
- Alpine.js setup instructions
- HTMX integration examples

### Changed
- Reorganized component categories for better discoverability
- Updated registry to support 11 components (previously 9)
- Improved component prop interfaces with better TypeScript types

### Technical Details
- **Total Components**: 11 production-ready components
- **TypeScript**: Full type safety across all components
- **Alpine.js**: Used in 7 components for interactivity
- **HTMX**: Compatible with Grid and Form components
- **License**: LGPL-3.0
- **Peer Dependencies**: Astro >=5.0.0, Alpine.js >=3.14.0, HTMX >=2.0.0, Tailwind CSS >=4.0.0

## [0.1.9] - 2024-12-02

### Added
- Initial component library structure
- Grid component with sorting and pagination
- Form component with Zod validation
- Modal component
- DatePicker component
- Basic registry system

### Changed
- Updated to Astro 5.0.0
- Migrated to Tailwind CSS 4.0.0

---

[1.0.0]: https://github.com/casoon/skibidoo-ui/compare/v0.1.9...v1.0.0
[0.1.9]: https://github.com/casoon/skibidoo-ui/releases/tag/v0.1.9
