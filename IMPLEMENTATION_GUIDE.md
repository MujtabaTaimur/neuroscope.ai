# NeuroScope Implementation Guide

## Developer-Ready Implementation Guidelines

This guide provides step-by-step instructions for implementing the NeuroScope cross-domain integration system and design system.

---

## Table of Contents

1. [Setup](#setup)
2. [Design System Integration](#design-system-integration)
3. [Cross-Domain Integration](#cross-domain-integration)
4. [Module Development](#module-development)
5. [Component Implementation](#component-implementation)
6. [Testing](#testing)
7. [Best Practices](#best-practices)

---

## Setup

### 1. Install Dependencies

```bash
# If using npm
npm install

# If using a bundler, ensure you have:
# - A module system (ES6 modules or CommonJS)
# - CSS preprocessing (optional but recommended)
```

### 2. File Structure

```
neuroscope.ai-main/
├── DesignSystem/
│   ├── global-tokens.json
│   ├── module-tokens.json
│   ├── component-library.json
│   ├── micro-interactions.json
│   └── ui-philosophy.md
├── Integration/
│   ├── cross-domain-api.js
│   └── integration-flows.md
├── Modules/
│   ├── cad/
│   ├── math/
│   ├── biology/
│   ├── code/
│   ├── medical/
│   └── protein/
└── IMPLEMENTATION_GUIDE.md
```

### 3. Load Design Tokens

#### Option A: Direct JSON Import (Modern Bundlers)

```javascript
import globalTokens from './DesignSystem/global-tokens.json';
import moduleTokens from './DesignSystem/module-tokens.json';

// Convert to CSS variables
function applyTokens(tokens) {
  const root = document.documentElement;
  Object.entries(tokens.tokens.color.base.background).forEach(([key, value]) => {
    root.style.setProperty(`--color-bg-${key}`, value);
  });
  // ... apply all tokens
}

applyTokens(globalTokens);
```

#### Option B: CSS Variables (Recommended)

```css
/* styles/tokens.css */
:root {
  /* Colors */
  --color-bg-primary: #0f0f14;
  --color-bg-secondary: #1a1a24;
  --color-accent-primary: #2b59ff;
  --color-accent-secondary: #7b3eff;
  
  /* Typography */
  --font-primary: 'Sora', sans-serif;
  --font-secondary: 'Inter', sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* Spacing */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  /* ... */
  
  /* Border Radius */
  --radius-sm: 0.5rem;
  --radius-md: 1rem;
  --radius-lg: 1.5rem;
  
  /* Shadows */
  --shadow-glow-primary: 0 0 20px rgba(43, 89, 255, 0.2);
  --shadow-glow-hover: 0 0 30px rgba(43, 89, 255, 0.4);
}
```

---

## Design System Integration

### 1. Load Global Tokens

```javascript
// utils/tokens.js
import globalTokens from '../DesignSystem/global-tokens.json';

export function getToken(path) {
  const keys = path.split('.');
  let value = globalTokens.tokens;
  
  for (const key of keys) {
    value = value[key];
    if (!value) return null;
  }
  
  return value;
}

// Usage
const primaryColor = getToken('color.accent.primary.500'); // #2b59ff
```

### 2. Create Token Helper Functions

```javascript
// utils/designTokens.js
export const tokens = {
  color: {
    bg: {
      primary: '#0f0f14',
      secondary: '#1a1a24',
      elevated: 'rgba(255, 255, 255, 0.02)'
    },
    accent: {
      primary: '#2b59ff',
      secondary: '#7b3eff',
      gradient: 'linear-gradient(90deg, #2b59ff, #7b3eff)'
    }
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '2rem'
  },
  borderRadius: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem'
  }
};
```

### 3. Apply Module-Specific Tokens

```javascript
// modules/cad/styles.js
import moduleTokens from '../../DesignSystem/module-tokens.json';

const cadTokens = moduleTokens.modules.cad;

export const cadStyles = {
  primary: cadTokens.color.primary, // #00d4ff
  background: cadTokens.color.background,
  // ... use module tokens
};
```

---

## Cross-Domain Integration

### 1. Initialize Integration System

```javascript
// app.js or main.js
import crossDomainIntegration from './Integration/cross-domain-api.js';

// Auto-initializes on import, but you can also:
crossDomainIntegration.initialize();

// Check available modules
const modules = crossDomainIntegration.getModules();
console.log('Available modules:', modules);
```

### 2. Register Your Module

```javascript
// modules/my-module/index.js
import crossDomainIntegration from '../../Integration/cross-domain-api.js';

crossDomainIntegration.registerModule('myModule', {
  name: 'My Module',
  version: '1.0.0',
  functions: {
    myFunction: {
      handler: async (params) => {
        // Your function logic
        return { result: 'success', data: params };
      },
      description: 'Does something useful',
      parameters: ['param1', 'param2'],
      returns: 'object'
    }
  }
});
```

### 3. Request Functions from Other Modules

```javascript
// In your module
try {
  const result = await crossDomainIntegration.requestFunction(
    'math',
    'solveEquation',
    {
      equation: 'x^2 + 5x + 6 = 0',
      variables: ['x']
    }
  );
  
  console.log('Solution:', result.result);
} catch (error) {
  console.error('Request failed:', error);
}
```

### 4. Use Helper Methods

```javascript
// CAD to Math
const volume = await crossDomainIntegration.cadToMath('calculateVolume', {
  geometry: myGeometry,
  bounds: myBounds
});

// Math to CAD
const visualization = await crossDomainIntegration.mathToCad('visualizeEquation', {
  equation: myEquation
});
```

---

## Module Development

### 1. Module Structure

```
modules/cad/
├── index.js          # Module entry, register with API
├── components/       # Module-specific components
│   ├── Viewport3D.js
│   ├── Toolbar.js
│   └── PropertyPanel.js
├── styles/           # Module styles
│   ├── tokens.js     # Module token references
│   └── components.css
├── utils/           # Module utilities
└── README.md        # Module documentation
```

### 2. Module Entry Point

```javascript
// modules/cad/index.js
import crossDomainIntegration from '../../Integration/cross-domain-api.js';
import { Viewport3D } from './components/Viewport3D.js';
import { Toolbar } from './components/Toolbar.js';

// Register module
crossDomainIntegration.registerModule('cad', {
  name: 'CAD Module',
  version: '1.0.0',
  functions: {
    exportGeometry: {
      handler: async (params) => {
        // Implementation
        return { format: params.format, data: params.geometry };
      },
      description: 'Export 3D geometry',
      parameters: ['format', 'geometry'],
      returns: 'object'
    }
    // ... more functions
  }
});

// Export components
export { Viewport3D, Toolbar };
```

### 3. Module Component Example

```javascript
// modules/cad/components/Viewport3D.js
import { cadStyles } from '../styles/tokens.js';
import crossDomainIntegration from '../../../Integration/cross-domain-api.js';

export class Viewport3D {
  constructor(container) {
    this.container = container;
    this.setup();
  }

  setup() {
    // Apply module-specific styles
    this.container.style.background = cadStyles.background;
    this.container.style.border = `1px solid ${cadStyles.border}`;
  }

  async calculateVolume(geometry) {
    // Use cross-domain integration
    const result = await crossDomainIntegration.cadToMath('calculateVolume', {
      geometry: geometry
    });
    return result.result.volume;
  }
}
```

---

## Component Implementation

### 1. Base Button Component

```javascript
// components/Button.js
import { tokens } from '../utils/designTokens.js';

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md',
  onClick 
}) {
  const buttonStyles = {
    padding: tokens.spacing[size],
    borderRadius: tokens.borderRadius.md,
    background: variant === 'primary' 
      ? tokens.color.accent.gradient 
      : tokens.color.bg.elevated,
    color: '#ffffff',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
    fontSize: tokens.fontSize[size]
  };

  return (
    <button
      style={buttonStyles}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.target.style.transform = 'translateY(-2px)';
        e.target.style.boxShadow = tokens.shadow.glow.hover;
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }}
    >
      {children}
    </button>
  );
}
```

### 2. Module-Specific Card

```javascript
// modules/math/components/SolutionCard.js
import { moduleTokens } from '../../../DesignSystem/module-tokens.json';

const mathTokens = moduleTokens.modules.math;

export function SolutionCard({ solution }) {
  return (
    <div
      style={{
        background: mathTokens.color.background,
        border: `1px solid ${mathTokens.color.border}`,
        borderRadius: '1rem',
        padding: '2rem'
      }}
    >
      <h3 style={{ color: mathTokens.color.primary }}>
        Solution
      </h3>
      <pre>{JSON.stringify(solution, null, 2)}</pre>
    </div>
  );
}
```

### 3. Cross-Domain Button

```javascript
// components/CrossDomainButton.js
import crossDomainIntegration from '../Integration/cross-domain-api.js';

export function CrossDomainButton({ 
  targetModule, 
  functionName, 
  parameters,
  children 
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleClick = async () => {
    setLoading(true);
    try {
      const response = await crossDomainIntegration.requestFunction(
        targetModule,
        functionName,
        parameters
      );
      setResult(response.result);
    } catch (error) {
      console.error('Cross-domain request failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        background: 'rgba(43, 89, 255, 0.1)',
        border: '1px solid rgba(43, 89, 255, 0.3)',
        borderRadius: '0.75rem',
        padding: '0.75rem 1.5rem',
        color: '#2b59ff',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.6 : 1
      }}
    >
      {loading ? 'Loading...' : children}
    </button>
  );
}
```

---

## Testing

### 1. Test Module Registration

```javascript
// tests/modules.test.js
import crossDomainIntegration from '../Integration/cross-domain-api.js';

test('registers module correctly', () => {
  crossDomainIntegration.registerModule('test', {
    name: 'Test Module',
    functions: {
      testFunction: {
        handler: async () => ({ success: true }),
        description: 'Test function'
      }
    }
  });

  const modules = crossDomainIntegration.getModules();
  expect(modules.find(m => m.id === 'test')).toBeDefined();
});
```

### 2. Test Cross-Domain Requests

```javascript
// tests/integration.test.js
test('handles cross-domain request', async () => {
  const result = await crossDomainIntegration.requestFunction(
    'math',
    'solveEquation',
    { equation: 'x = 5' }
  );

  expect(result.success).toBe(true);
  expect(result.module).toBe('math');
});
```

### 3. Test Component Rendering

```javascript
// tests/components.test.js
import { render } from '@testing-library/react';
import { Button } from '../components/Button';

test('renders button with correct styles', () => {
  const { container } = render(<Button>Click me</Button>);
  const button = container.querySelector('button');
  
  expect(button).toHaveStyle({
    background: expect.stringContaining('2b59ff')
  });
});
```

---

## Best Practices

### 1. Error Handling

```javascript
// Always wrap cross-domain requests in try-catch
try {
  const result = await crossDomainIntegration.requestFunction(
    'targetModule',
    'functionName',
    params
  );
} catch (error) {
  // Handle specific error types
  if (error.message.includes('not found')) {
    // Show user-friendly message
  } else {
    // Log and show generic error
  }
}
```

### 2. Loading States

```javascript
// Always show loading states for async operations
const [loading, setLoading] = useState(false);

const handleRequest = async () => {
  setLoading(true);
  try {
    await crossDomainIntegration.requestFunction(...);
  } finally {
    setLoading(false);
  }
};
```

### 3. Caching

```javascript
// Cache frequently requested data
const cache = new Map();

async function getCachedResult(module, functionName, params) {
  const key = `${module}.${functionName}.${JSON.stringify(params)}`;
  
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const result = await crossDomainIntegration.requestFunction(
    module,
    functionName,
    params
  );
  
  cache.set(key, result);
  return result;
}
```

### 4. Type Safety

```javascript
// Use TypeScript or JSDoc for type safety
/**
 * @param {string} targetModule
 * @param {string} functionName
 * @param {Object} parameters
 * @returns {Promise<{success: boolean, result: any}>}
 */
async function requestFunction(targetModule, functionName, parameters) {
  // ...
}
```

### 5. Performance

```javascript
// Debounce rapid requests
import { debounce } from 'lodash';

const debouncedRequest = debounce(async (params) => {
  await crossDomainIntegration.requestFunction(...);
}, 300);
```

### 6. Security

```javascript
// Validate and sanitize inputs
function sanitizeParams(params) {
  // Remove dangerous properties
  const { __proto__, constructor, ...safe } = params;
  return safe;
}

// Use validated params
const safeParams = sanitizeParams(userParams);
await crossDomainIntegration.requestFunction(module, func, safeParams);
```

---

## Quick Start Checklist

- [ ] Load design tokens (global and module-specific)
- [ ] Initialize cross-domain integration system
- [ ] Register your module with functions
- [ ] Create module components using tokens
- [ ] Implement cross-domain requests where needed
- [ ] Add loading and error states
- [ ] Test module registration and requests
- [ ] Apply micro-interactions
- [ ] Ensure accessibility (keyboard nav, focus states)
- [ ] Test responsive behavior

---

## Resources

- **Design Tokens**: `DesignSystem/global-tokens.json`
- **Module Tokens**: `DesignSystem/module-tokens.json`
- **Component Library**: `DesignSystem/component-library.json`
- **Micro Interactions**: `DesignSystem/micro-interactions.json`
- **Integration API**: `Integration/cross-domain-api.js`
- **Integration Flows**: `Integration/integration-flows.md`
- **UI Philosophy**: `DesignSystem/ui-philosophy.md`

---

## Support

For questions or issues:
- Review the UI Philosophy document
- Check Integration Flows documentation
- Examine example implementations in modules
- Consult the component library JSON for styling reference

---

**Happy Coding! 🚀**

