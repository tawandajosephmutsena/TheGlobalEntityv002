# Technical Specification: OttoStart Web Application

## 1. Executive Summary
**OttoStart** is a high-performance, enterprise-grade content management system (CMS) and application framework built on the **Laravel 12** ecosystem. It leverages a modern, decoupled architecture using **React 19** and **Inertia.js** to provide a seamless SPA (Single Page Application) experience while maintaining the robust backend security and SEO capabilities of a traditional server-side application.

The platform is designed for scalability, security, and exceptional user experience, featuring a block-based page builder, advanced media management, and integrated analytics.

---

## 2. Technology Stack

### Backend (The Core)
- **Framework**: Laravel 12.x (Bleeding edge PHP framework)
- **PHP Version**: 8.2+ (Optimized for 8.3/8.4)
- **Authentication**: Laravel Fortify (Headless authentication backbone)
- **Database**: SQLite (Default production-ready) / MySQL compatible
- **Package Management**: Composer 2.x
- **Media Handling**: Intervention Image 3.x
- **Error Tracking**: Sentry Laravel Integration
- **Monitoring**: Laravel Pail (Real-time logging)

### Frontend (The Interface)
- **Core Library**: React 19.x (Utilizing concurrent rendering)
- **State Bridge**: Inertia.js 2.x
- **CSS Framework**: Tailwind CSS 4.x (Utility-first, high performance)
- **Animations**: Framer Motion 12.x & GSAP 3.x
- **Interactive Elements**: Radix UI (Primitives for accessibility)
- **Asset Bundler**: Vite 7.x
- **Routing**: Ziggy-js (Laravel routes in JavaScript)
- **Types**: TypeScript 5.x

---

## 3. Core Capabilities & Features

### 3.1. Advanced Page Builder
- **Block-Based Architecture**: Modular, draggable components (Gallery, Hero, FAQ, CTA, Features, Stats, etc.).
- **Content Versioning**: Integrated versioning system for audit trails and one-click restores.
- **Dynamic SEO**: Per-page metadata injection (Titles, Descriptions, OpenGraph).
- **Preview System**: Secure preview links for draft content.

### 3.2. Media Management
- **Professional Library**: Unified interface for images, documents, and videos.
- **Transformation Engine**: Automatic conversion to modern formats (WebP) on-the-fly.
- **Performance**: Lazy-loading and pre-loading strategies integrated.

### 3.3. Security & Compliance
- **RBAC**: Multi-tier Role-Based Access Control (Super Admin, Admin, Editor, Viewer).
- **Hardened Headers**: Automated CSP (Content Security Policy) with nonces for Vite.
- **Account Protection**: Built-in 2FA support and account lockout mechanics.
- **XSS/CSRF**: Multi-layered sanitization and site-wide CSRF protection.

### 3.4. Performance & Performance
- **Client-Side Navigation**: No full-page refreshes during navigation.
- **Server-Side SEO**: Full server-side rendering support for search crawlers.
- **Optimized Caching**: Integrated cache strategies for routes and configurations.

---

## 4. Technical Architecture

### 4.1. The Hybrid Model
OttoStart utilizes a hybrid approach. It feels like a React app but is driven by Laravel. This eliminates the need for a separate REST/GraphQL API layer, as Inertia.js directly passes data from Laravel controllers to React components.

### 4.2. Database & Storage
- **SQLite Optimization**: Pre-configured for high-concurrency environments using WAL mode.
- **Filesystem**: Polymorphic storage support (Local, S3, or Public).
- **Automated Sitemaps**: Dynamic `sitemap.xml` generation via Spatie.

### 4.3. Developer Experience (DX)
- **Wayfinder**: Specialized Vite plugin that bridges Laravel routes and actions to TypeScript types.
- **Modular Design**: Uses `nwidart/laravel-modules` to separate core logic from optional features.

---

## 5. Deployment Flexibility
The system supports two primary deployment modes:
- **Standard**: Mapping the `/public` directory to the server root.
- **Flat (Subdomain)**: A specialized configuration for restricted environments (like cPanel subdomains) where all assets and core files live in the same root folder.

---
*Last Updated: 2026-01-27*
*Engineered for: fountainconstruction.co.zw*
