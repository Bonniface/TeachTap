# FrontendSkills.md

## Overview
This skill provides comprehensive frontend development and design guidance for production-ready web applications. Use this when building user interfaces, interactive components, responsive layouts, or client-side applications with modern design principles.

## When to Use This Skill
- Building responsive web applications or mobile-first interfaces
- Creating React, Vue, or vanilla JavaScript applications
- Implementing complex UI components and interactions
- Designing user flows and information architecture
- Optimizing frontend performance and accessibility
- Creating design systems and component libraries
- Any task involving HTML, CSS, JavaScript, or modern frontend frameworks

## Core Principles

### 1. Design-First Approach
- **User-Centered**: Design for the end user's needs and context
- **Accessibility**: WCAG 2.1 AA compliance minimum (semantic HTML, ARIA labels, keyboard navigation)
- **Performance**: Optimize for Core Web Vitals (LCP, FID, CLS)
- **Responsive**: Mobile-first approach, fluid layouts, adaptive components
- **Consistency**: Design systems, reusable components, standardized patterns

### 2. Modern Tech Stack Selection
- **React**: Complex applications, component reusability, rich ecosystem
- **Vue**: Progressive enhancement, simpler learning curve, excellent docs
- **Svelte**: Performance-critical apps, minimal bundle size
- **TypeScript**: Type safety, better DX, fewer runtime errors
- **Tailwind CSS**: Rapid prototyping, utility-first, consistent design
- **Next.js/Nuxt**: SSR/SSG requirements, SEO, full-stack capabilities

## Project Structure

### Standard Frontend Architecture
```
frontend/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   ├── manifest.json
│   └── robots.txt
├── src/
│   ├── assets/           # Images, fonts, static files
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   ├── components/       # Reusable UI components
│   │   ├── common/       # Button, Input, Card, Modal
│   │   ├── layout/       # Header, Footer, Sidebar
│   │   └── features/     # Feature-specific components
│   ├── pages/            # Page components/views
│   ├── hooks/            # Custom React hooks
│   ├── contexts/         # React Context providers
│   ├── services/         # API calls and external services
│   ├── utils/            # Helper functions
│   ├── styles/           # Global styles, theme
│   ├── constants/        # Constants and configuration
│   ├── types/            # TypeScript type definitions
│   └── App.jsx
├── tests/
├── .env.example
├── .eslintrc.js
├── .prettierrc
├── package.json
├── tailwind.config.js
└── README.md
```

## Essential Design Patterns

### 1. Color System
```javascript
// tailwind.config.js or theme.js
const theme = {
  colors: {
    // Brand colors
    primary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',  // Main brand color
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },
    
    // Semantic colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Neutral colors
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    
    // Background colors
    'background-light': '#f7f5f8',
    'background-dark': '#191022',
  }
};
```

### 2. Typography System
```css
/* Global typography styles */
:root {
  /* Font families */
  --font-display: 'Space Grotesk', -apple-system, sans-serif;
  --font-body: 'Noto Sans', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;
  
  /* Font sizes - Mobile first */
  --text-xs: 0.75rem;      /* 12px */
  --text-sm: 0.875rem;     /* 14px */
  --text-base: 1rem;       /* 16px */
  --text-lg: 1.125rem;     /* 18px */
  --text-xl: 1.25rem;      /* 20px */
  --text-2xl: 1.5rem;      /* 24px */
  --text-3xl: 1.875rem;    /* 30px */
  --text-4xl: 2.25rem;     /* 36px */
  --text-5xl: 3rem;        /* 48px */
  
  /* Line heights */
  --leading-tight: 1.25;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
  
  /* Font weights */
  --font-light: 300;
  --font-normal: 400;
  --font-medium: 500;
  --font-semibold: 600;
  --font-bold: 700;
}
```

### 3. Spacing & Layout System
```javascript
// Consistent spacing scale (Tailwind default)
const spacing = {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
};
```

## Component Library

### 1. Button Component
```jsx
// src/components/common/Button.jsx
import React from 'react';
import { cn } from '../../utils/classNames';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  onClick,
  type = 'button',
  className,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 focus:ring-primary shadow-lg shadow-primary/20',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-400 dark:text-gray-300 dark:hover:bg-gray-800',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
    xl: 'px-8 py-4 text-xl gap-3',
  };
  
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
```

### 2. Input Component
```jsx
// src/components/common/Input.jsx
import React, { forwardRef } from 'react';
import { cn } from '../../utils/classNames';

const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className,
  ...props
}, ref) => {
  return (
    <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-lg border transition-all duration-200',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-white',
            'placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            error 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 dark:border-gray-600',
            leftIcon && 'pl-10',
            rightIcon && 'pr-10',
            props.disabled && 'opacity-50 cursor-not-allowed bg-gray-50',
            className
          )}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={cn(
          'text-sm',
          error ? 'text-red-500' : 'text-gray-500'
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
```

### 3. Modal Component
```jsx
// src/components/common/Modal.jsx
import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/classNames';

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
  closeOnOverlayClick = true,
  showCloseButton = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  
  if (!isOpen) return null;
  
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };
  
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal */}
      <div
        className={cn(
          'relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full',
          'transform transition-all duration-200',
          'animate-in fade-in zoom-in-95',
          sizes[size]
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            {title && (
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
              </h2>
            )}
            
            {showCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        
        {/* Content */}
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
```

### 4. Card Component
```jsx
// src/components/common/Card.jsx
import React from 'react';
import { cn } from '../../utils/classNames';

const Card = ({
  children,
  className,
  hoverable = false,
  padding = 'md',
  ...props
}) => {
  const paddings = {
    none: 'p-0',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
    xl: 'p-8',
  };
  
  return (
    <div
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm',
        hoverable && 'transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5',
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
```

## Production-Ready Pages for TeachTap Learning App

### Page Structure Overview
```
src/pages/
├── Landing.jsx              # Marketing landing page
├── Auth/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── ForgotPassword.jsx
│   └── ResetPassword.jsx
├── Onboarding/
│   ├── Welcome.jsx
│   ├── SelectInterests.jsx
│   └── CreateProfile.jsx
├── Home/
│   ├── Feed.jsx             # Main learning feed (TikTok-style)
│   └── ForYouFeed.jsx
├── Discover/
│   ├── Explore.jsx          # Browse topics
│   ├── TopicDetail.jsx
│   └── SearchResults.jsx
├── Learn/
│   ├── VideoPlayer.jsx      # Full-screen video player
│   ├── Quiz.jsx
│   └── Progress.jsx
├── Profile/
│   ├── UserProfile.jsx
│   ├── EditProfile.jsx
│   ├── Settings.jsx
│   └── SavedContent.jsx
├── Create/
│   ├── UploadVideo.jsx
│   ├── Studio.jsx
│   └── Analytics.jsx
├── Community/
│   ├── Following.jsx
│   ├── Followers.jsx
│   └── Comments.jsx
└── Static/
    ├── About.jsx
    ├── Privacy.jsx
    ├── Terms.jsx
    └── Help.jsx
```

### 1. Landing Page
```jsx
// src/pages/Landing.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background-light to-purple-50 dark:from-background-dark dark:via-gray-900 dark:to-purple-950">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-2xl">school</span>
            </div>
            <span className="text-2xl font-bold font-display">TeachTap</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold font-display mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Learn Anything,<br />One Tap at a Time
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Bite-sized lessons from expert educators. Swipe to discover, tap to learn, and quiz yourself to master new skills.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/signup">
            <Button size="lg" className="min-w-[200px]">
              Start Learning Free
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="min-w-[200px]">
            Watch Demo
          </Button>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-3xl mx-auto">
          <div>
            <div className="text-4xl font-bold text-primary">10M+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Active Learners</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">500K+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Video Lessons</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary">1000+</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Expert Teachers</div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-12">Why TeachTap?</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon="swipe"
            title="Swipe to Learn"
            description="Discover personalized content tailored to your interests. Just like your favorite social app, but educational."
          />
          <FeatureCard
            icon="quiz"
            title="Interactive Quizzes"
            description="Test your knowledge with built-in quizzes after each lesson. Track progress and earn achievements."
          />
          <FeatureCard
            icon="school"
            title="Expert Educators"
            description="Learn from verified professionals, academics, and industry experts worldwide."
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-primary to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 opacity-90">Join millions of learners today. It's free to get started.</p>
          <Link to="/signup">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">TeachTap</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Making education accessible, engaging, and fun for everyone.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/features" className="text-gray-600 hover:text-primary">Features</Link></li>
                <li><Link to="/pricing" className="text-gray-600 hover:text-primary">Pricing</Link></li>
                <li><Link to="/educators" className="text-gray-600 hover:text-primary">For Educators</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/about" className="text-gray-600 hover:text-primary">About</Link></li>
                <li><Link to="/careers" className="text-gray-600 hover:text-primary">Careers</Link></li>
                <li><Link to="/contact" className="text-gray-600 hover:text-primary">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="text-gray-600 hover:text-primary">Privacy</Link></li>
                <li><Link to="/terms" className="text-gray-600 hover:text-primary">Terms</Link></li>
                <li><Link to="/cookies" className="text-gray-600 hover:text-primary">Cookies</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-600">
            © 2024 TeachTap. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
      <span className="material-symbols-outlined text-primary text-3xl">{icon}</span>
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400">{description}</p>
  </div>
);

export default Landing;
```

### 2. Login Page
```jsx
// src/pages/Auth/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    
    try {
      await login(formData.email, formData.password);
      navigate('/feed');
    } catch (error) {
      setErrors({ general: error.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };
  
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-3xl">school</span>
            </div>
            <span className="text-3xl font-bold font-display">TeachTap</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-gray-600 dark:text-gray-400">Log in to continue learning</p>
        </div>
        
        {/* Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.general && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                {errors.general}
              </div>
            )}
            
            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              fullWidth
              leftIcon={<span className="material-symbols-outlined text-lg">mail</span>}
              error={errors.email}
            />
            
            <Input
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              fullWidth
              leftIcon={<span className="material-symbols-outlined text-lg">lock</span>}
              error={errors.password}
            />
            
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                <span className="text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              
              <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                Forgot password?
              </Link>
            </div>
            
            <Button
              type="submit"
              fullWidth
              size="lg"
              loading={loading}
              disabled={loading}
            >
              Log In
            </Button>
          </form>
          
          {/* Social Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-3">
              <Button variant="outline" fullWidth>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </Button>
              
              <Button variant="outline" fullWidth>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z"/>
                </svg>
                GitHub
              </Button>
            </div>
          </div>
          
          {/* Sign Up Link */}
          <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

### 3. Main Feed Page (TikTok-Style)
```jsx
// src/pages/Home/Feed.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import VideoCard from '../../components/features/VideoCard';
import BottomPanel from '../../components/features/BottomPanel';
import { useVideoFeed } from '../../hooks/useVideoFeed';

const Feed = () => {
  const { videos, loading, fetchMore, hasMore } = useVideoFeed();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRefs = useRef([]);
  
  const handlers = useSwipeable({
    onSwipedUp: () => handleNext(),
    onSwipedDown: () => handlePrevious(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });
  
  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else if (hasMore) {
      fetchMore();
    }
  };
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };
  
  const handleVideoClick = () => {
    setIsPlaying(prev => !prev);
  };
  
  useEffect(() => {
    // Auto-play current video
    const currentVideo = videoRefs.current[currentIndex];
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.play().catch(console.error);
      } else {
        currentVideo.pause();
      }
    }
    
    // Pause other videos
    videoRefs.current.forEach((video, index) => {
      if (video && index !== currentIndex) {
        video.pause();
      }
    });
  }, [currentIndex, isPlaying]);
  
  if (loading && videos.length === 0) {
    return <LoadingScreen />;
  }
  
  const currentVideo = videos[currentIndex];
  
  return (
    <div {...handlers} className="h-screen w-full relative overflow-hidden bg-black">
      {/* Video Background */}
      <video
        ref={el => videoRefs.current[currentIndex] = el}
        className="absolute inset-0 w-full h-full object-cover"
        src={currentVideo?.videoUrl}
        loop
        playsInline
        onClick={handleVideoClick}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/20 pointer-events-none" />
      
      {/* Top Navigation */}
      <TopNav />
      
      {/* Video Info Overlay */}
      <VideoInfo video={currentVideo} />
      
      {/* Side Action Bar */}
      <SideActionBar video={currentVideo} />
      
      {/* Progress Bar */}
      <VideoProgress currentTime={0} duration={currentVideo?.duration || 90} />
      
      {/* Bottom Facts Panel */}
      <BottomPanel transcript={currentVideo?.transcript} quizAvailable={currentVideo?.hasQuiz} />
      
      {/* Play/Pause Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/40 rounded-full p-6 backdrop-blur-sm animate-in fade-in zoom-in">
            <span className="material-symbols-outlined text-white text-6xl">play_arrow</span>
          </div>
        </div>
      )}
    </div>
  );
};

const TopNav = () => (
  <div className="absolute top-0 inset-x-0 z-20 pt-12 pb-4 px-4 bg-gradient-to-b from-black/80 to-transparent">
    <div className="flex items-start justify-between">
      <button className="flex items-center justify-center size-10 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10">
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      
      <div className="flex h-9 items-center justify-center rounded-lg bg-black/40 backdrop-blur-md p-1 border border-white/10">
        <button className="flex h-full items-center justify-center px-4 rounded-md bg-white/20 text-white text-xs font-bold">
          For You
        </button>
        <button className="flex h-full items-center justify-center px-4 rounded-md text-white/60 text-xs font-medium">
          Following
        </button>
      </div>
      
      <button className="flex items-center justify-center size-10 rounded-full bg-black/20 backdrop-blur-md text-white border border-white/10">
        <span className="material-symbols-outlined">more_vert</span>
      </button>
    </div>
  </div>
);

const VideoInfo = ({ video }) => (
  <div className="absolute top-28 inset-x-0 z-10 px-4 text-center">
    <div className="px-3 py-1 bg-primary/80 backdrop-blur-md rounded-full text-xs font-bold uppercase inline-block mb-2">
      {video?.category}
    </div>
    <h1 className="text-xl font-bold text-white drop-shadow-md mb-1">{video?.title}</h1>
    <p className="text-sm text-gray-200 flex items-center justify-center gap-1">
      with {video?.educator}{' '}
      {video?.verified && (
        <span className="material-symbols-outlined text-blue-400 text-sm" style={{fontVariationSettings: "'FILL' 1"}}>
          verified
        </span>
      )}
    </p>
  </div>
);

const SideActionBar = ({ video }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  
  return (
    <div className="absolute right-4 bottom-[24%] z-20 flex flex-col gap-5 items-center">
      {/* Profile */}
      <div className="relative mb-2">
        <div className="size-12 rounded-full border-2 border-white p-0.5 overflow-hidden bg-black">
          <img src={video?.educator_avatar} alt="Educator" className="w-full h-full object-cover rounded-full" />
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary rounded-full size-5 flex items-center justify-center border border-black">
          <span className="material-symbols-outlined text-xs font-bold">add</span>
        </div>
      </div>
      
      {/* Like */}
      <ActionButton
        icon="favorite"
        label={formatCount(video?.likes || 0)}
        active={liked}
        onClick={() => setLiked(!liked)}
      />
      
      {/* Comments */}
      <ActionButton icon="chat_bubble" label={formatCount(video?.comments || 0)} />
      
      {/* Bookmark */}
      <ActionButton
        icon="bookmark"
        label="Save"
        active={saved}
        onClick={() => setSaved(!saved)}
      />
      
      {/* Share */}
      <ActionButton icon="share" label="Share" />
    </div>
  );
};

const ActionButton = ({ icon, label, active, onClick }) => (
  <div className="flex flex-col items-center gap-1">
    <button
      onClick={onClick}
      className="flex items-center justify-center size-11 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-all active:scale-95"
    >
      <span
        className="material-symbols-outlined"
        style={{fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0"}}
      >
        {icon}
      </span>
    </button>
    <span className="text-xs font-bold drop-shadow-md">{label}</span>
  </div>
);

const VideoProgress = ({ currentTime, duration }) => {
  const progress = (currentTime / duration) * 100;
  
  return (
    <div className="absolute bottom-[20%] w-full z-20 px-2">
      <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
        <div
          className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(140,37,244,0.8)] transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between px-1 mt-1">
        <span className="text-[10px] font-medium text-white/80 drop-shadow-md">
          {formatTime(currentTime)}
        </span>
        <span className="text-[10px] font-medium text-white/80 drop-shadow-md">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
};

const LoadingScreen = () => (
  <div className="h-screen w-full flex items-center justify-center bg-background-dark">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
      <p className="text-gray-400">Loading amazing content...</p>
    </div>
  </div>
);

// Utility functions
const formatCount = (count) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
};

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default Feed;
```

### 4. User Profile Page
```jsx
// src/pages/Profile/UserProfile.jsx
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useProfile } from '../../hooks/useProfile';

const UserProfile = () => {
  const { userId } = useParams();
  const { profile, loading } = useProfile(userId);
  const [activeTab, setActiveTab] = useState('videos');
  
  if (loading) return <LoadingScreen />;
  
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-primary to-purple-600 h-48 relative">
        <div className="absolute top-4 left-4">
          <Link to="/feed">
            <button className="p-2 rounded-full bg-black/20 backdrop-blur-sm text-white">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
          </Link>
        </div>
      </div>
      
      {/* Profile Info */}
      <div className="container max-w-4xl mx-auto px-4 -mt-20">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden mb-4 shadow-xl">
            <img
              src={profile?.avatar || 'https://via.placeholder.com/128'}
              alt={profile?.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-3xl font-bold">{profile?.name}</h1>
            {profile?.verified && (
              <span className="material-symbols-outlined text-blue-500 text-2xl" style={{fontVariationSettings: "'FILL' 1"}}>
                verified
              </span>
            )}
          </div>
          
          <p className="text-gray-600 dark:text-gray-400 mb-1">@{profile?.username}</p>
          <p className="text-gray-700 dark:text-gray-300 max-w-md mb-4">{profile?.bio}</p>
          
          {/* Stats */}
          <div className="flex gap-8 mb-6">
            <Stat label="Videos" value={profile?.videoCount || 0} />
            <Stat label="Followers" value={formatCount(profile?.followers || 0)} />
            <Stat label="Following" value={formatCount(profile?.following || 0)} />
          </div>
          
          {/* Action Buttons */}
          {profile?.isOwnProfile ? (
            <div className="flex gap-3">
              <Link to="/profile/edit">
                <Button variant="outline">Edit Profile</Button>
              </Link>
              <Link to="/settings">
                <Button variant="ghost">
                  <span className="material-symbols-outlined">settings</span>
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button>
                {profile?.isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button variant="outline">Message</Button>
            </div>
          )}
        </div>
        
        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
          <TabButton
            active={activeTab === 'videos'}
            onClick={() => setActiveTab('videos')}
            icon="play_circle"
            label="Videos"
          />
          <TabButton
            active={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
            icon="bookmark"
            label="Saved"
          />
          <TabButton
            active={activeTab === 'achievements'}
            onClick={() => setActiveTab('achievements')}
            icon="emoji_events"
            label="Achievements"
          />
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {profile?.videos?.map((video) => (
            <VideoThumbnail key={video.id} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
};

const Stat = ({ label, value }) => (
  <div>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-sm text-gray-600 dark:text-gray-400">{label}</div>
  </div>
);

const TabButton = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex-1 flex items-center justify-center gap-2 py-3 border-b-2 transition-colors ${
      active
        ? 'border-primary text-primary font-semibold'
        : 'border-transparent text-gray-600 dark:text-gray-400'
    }`}
  >
    <span className="material-symbols-outlined text-xl">{icon}</span>
    <span>{label}</span>
  </button>
);

const VideoThumbnail = ({ video }) => (
  <Link to={`/video/${video.id}`}>
    <div className="relative aspect-[9/16] rounded-xl overflow-hidden group cursor-pointer">
      <img
        src={video.thumbnail}
        alt={video.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 p-3">
          <h3 className="text-white font-semibold text-sm line-clamp-2">{video.title}</h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-white/90">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">visibility</span>
              {formatCount(video.views)}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">favorite</span>
              {formatCount(video.likes)}
            </span>
          </div>
        </div>
      </div>
    </div>
  </Link>
);

const LoadingScreen = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const formatCount = (count) => {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}k`;
  return count.toString();
};

export default UserProfile;
```

### 5. Quiz Page
```jsx
// src/pages/Learn/Quiz.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button';
import { useQuiz } from '../../hooks/useQuiz';

const Quiz = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const { quiz, loading } = useQuiz(videoId);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  
  if (loading) return <LoadingScreen />;
  
  const question = quiz?.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz?.questions.length) * 100;
  
  const handleAnswerSelect = (optionIndex) => {
    if (isAnswered) return;
    
    setSelectedAnswer(optionIndex);
    setIsAnswered(true);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: optionIndex
    }));
    
    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      handleNext();
    }, 1500);
  };
  
  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setShowResults(true);
    }
  };
  
  const calculateScore = () => {
    let correct = 0;
    quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: quiz.questions.length,
      percentage: Math.round((correct / quiz.questions.length) * 100)
    };
  };
  
  if (showResults) {
    const score = calculateScore();
    return <QuizResults score={score} onRetry={() => window.location.reload()} onClose={() => navigate(-1)} />;
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-purple-50 dark:from-background-dark dark:to-purple-950/20 p-4">
      <div className="container max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="material-symbols-outlined">close</span>
          </button>
          
          <div className="flex-1 mx-4">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
              Question {currentQuestion + 1} of {quiz?.questions.length}
            </p>
          </div>
          
          <div className="text-primary font-bold text-lg">
            {answers && Object.keys(answers).length}/{quiz?.questions.length}
          </div>
        </div>
        
        {/* Question Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4">
              <span className="material-symbols-outlined text-primary text-sm">quiz</span>
              <span className="text-sm font-semibold text-primary">Multiple Choice</span>
            </div>
            
            <h2 className="text-2xl font-bold mb-2">{question?.question}</h2>
            {question?.hint && !isAnswered && (
              <p className="text-gray-600 dark:text-gray-400 text-sm">💡 {question.hint}</p>
            )}
          </div>
          
          {/* Options */}
          <div className="space-y-3">
            {question?.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === question.correctAnswer;
              const showFeedback = isAnswered;
              
              let optionStyle = 'border-gray-300 dark:border-gray-600 hover:border-primary';
              
              if (showFeedback) {
                if (isCorrect) {
                  optionStyle = 'border-green-500 bg-green-50 dark:bg-green-900/20';
                } else if (isSelected && !isCorrect) {
                  optionStyle = 'border-red-500 bg-red-50 dark:bg-red-900/20';
                }
              } else if (isSelected) {
                optionStyle = 'border-primary bg-primary/5';
              }
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 ${optionStyle} ${
                    !isAnswered && 'hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      showFeedback && isCorrect
                        ? 'bg-green-500 border-green-500'
                        : showFeedback && isSelected && !isCorrect
                        ? 'bg-red-500 border-red-500'
                        : isSelected
                        ? 'bg-primary border-primary'
                        : 'border-gray-300'
                    }`}>
                      {showFeedback && isCorrect ? (
                        <span className="material-symbols-outlined text-white text-lg">check</span>
                      ) : showFeedback && isSelected && !isCorrect ? (
                        <span className="material-symbols-outlined text-white text-lg">close</span>
                      ) : (
                        <span className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-gray-400'}`}>
                          {String.fromCharCode(65 + index)}
                        </span>
                      )}
                    </div>
                    
                    <span className="font-medium">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>
          
          {/* Explanation */}
          {isAnswered && question?.explanation && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex gap-2">
                <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">info</span>
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Explanation</p>
                  <p className="text-sm text-blue-800 dark:text-blue-400">{question.explanation}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Navigation */}
        {!isAnswered && (
          <Button
            variant="outline"
            fullWidth
            size="lg"
            onClick={handleNext}
            disabled={selectedAnswer === null}
          >
            Skip Question
          </Button>
        )}
      </div>
    </div>
  );
};

const QuizResults = ({ score, onRetry, onClose }) => {
  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: 'text-green-600', emoji: '🎉' };
    if (percentage >= 80) return { grade: 'A', color: 'text-green-500', emoji: '🌟' };
    if (percentage >= 70) return { grade: 'B', color: 'text-blue-500', emoji: '👍' };
    if (percentage >= 60) return { grade: 'C', color: 'text-yellow-500', emoji: '📚' };
    return { grade: 'D', color: 'text-red-500', emoji: '💪' };
  };
  
  const result = getGrade(score.percentage);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-purple-50 dark:from-background-dark dark:to-purple-950/20 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">{result.emoji}</div>
        
        <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Here's how you did</p>
        
        <div className="relative w-48 h-48 mx-auto mb-8">
          <svg className="transform -rotate-90" width="192" height="192">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 88}`}
              strokeDashoffset={`${2 * Math.PI * 88 * (1 - score.percentage / 100)}`}
              className="text-primary transition-all duration-1000"
              strokeLinecap="round"
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className={`text-5xl font-bold ${result.color}`}>{score.percentage}%</div>
            <div className="text-2xl font-bold text-gray-700 dark:text-gray-300 mt-1">{result.grade}</div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-3xl font-bold text-green-600">{score.correct}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-400">{score.total - score.correct}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Incorrect</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button fullWidth size="lg" onClick={onRetry}>
            <span className="material-symbols-outlined mr-2">replay</span>
            Retry Quiz
          </Button>
          <Button fullWidth size="lg" variant="outline" onClick={onClose}>
            Continue Learning
          </Button>
        </div>
      </div>
    </div>
  );
};

const LoadingScreen = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

export default Quiz;
```

## Performance Optimization

### 1. Code Splitting
```javascript
// src/App.jsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Eager loading for critical pages
import Landing from './pages/Landing';
import Login from './pages/Auth/Login';

// Lazy loading for other pages
const Feed = lazy(() => import('./pages/Home/Feed'));
const Profile = lazy(() => import('./pages/Profile/UserProfile'));
const Quiz = lazy(() => import('./pages/Learn/Quiz'));

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/quiz/:videoId" element={<Quiz />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);
```

### 2. Image Optimization
```javascript
// src/components/common/OptimizedImage.jsx
import React, { useState } from 'react';

const OptimizedImage = ({ src, alt, className, placeholder }) => {
  const [loaded, setLoaded] = useState(false);
  
  return (
    <div className="relative">
      {!loaded && placeholder && (
        <div className={`absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse ${className}`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setLoaded(true)}
        loading="lazy"
      />
    </div>
  );
};

export default OptimizedImage;
```

### 3. Debounce Search
```javascript
// src/hooks/useDebounce.js
import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};
```

## Accessibility Features

### 1. Keyboard Navigation
```javascript
// Add to all interactive components
onKeyDown={(e) => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    handleClick();
  }
}}
tabIndex={0}
role="button"
aria-label="Descriptive label"
```

### 2. Screen Reader Support
```jsx
// Hidden text for screen readers
<span className="sr-only">
  Play video about {videoTitle}
</span>

// CSS for sr-only
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### 3. Focus Indicators
```css
/* Global focus styles */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

button:focus-visible {
  ring: 2px;
  ring-color: var(--color-primary);
}
```

## Production Checklist

### Pre-Launch Requirements
- [ ] All pages responsive (mobile, tablet, desktop)
- [ ] Dark mode fully implemented
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Performance metrics meet targets (LCP < 2.5s, FID < 100ms, CLS < 0.1)
- [ ] Cross-browser testing complete (Chrome, Safari, Firefox, Edge)
- [ ] Error boundaries implemented
- [ ] Loading states for all async operations
- [ ] Empty states for all data-dependent views
- [ ] 404 and error pages designed
- [ ] SEO meta tags implemented
- [ ] Social share images configured
- [ ] Analytics tracking set up
- [ ] Forms have proper validation
- [ ] Images optimized (WebP, lazy loading)
- [ ] Bundle size analyzed and optimized
- [ ] PWA manifest configured
- [ ] Service worker for offline support
- [ ] Security headers configured
- [ ] Environment variables properly set
- [ ] Build process tested

---

**Remember**: Great frontend development balances aesthetics, performance, and accessibility. Always test on real devices, prioritize user experience, and iterate based on feedback.