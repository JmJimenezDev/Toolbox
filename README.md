# JmJimenezTools 🛠️

[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat&logo=vite)

**JmJimenezTools** es una **web multiusos modular**, construida con **React 19 + TypeScript + React Router Data Mode** y un **sistema de plugins**. Cada herramienta se carga **bajo demanda (lazy loading)**, lo que permite una app ligera, escalable y fácil de extender.

---

## 🚀 Instalación y ejecución

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev

# Construir para producción
npm run build

# Previsualizar build
npm run preview

# Linting
npm run lint

# typecheck
npm run typecheck
```

---

## 📦 Stack tecnológico

| Capa | Tecnología |
|------|------------|
| **Framework** | React 19 |
| **Lenguaje** | TypeScript 5.7 |
| **Build** | Vite 5 |
| **Routing** | React Router DOM 7 |
| **Estilos** | Tailwind CSS 4 |
| **UI Icons** | react-icons |
| **i18n** | i18next + react-i18next |
| **Fechas** | dayjs |
| **Editor** | Monaco Editor |
| **Markdown** | react-markdown + remark-gfm |

---

## 🛠️ Herramientas disponibles

### 🔧 Desarrollo
| Herramienta | Descripción |
|------------|-------------|
| JWT Decoder | Decodifica y visualiza tokens JWT |
| JSON Formatter | Formatea, minifica y valida JSON |
| QR Generator | Genera códigos QR |
| Directory Tree Generator | Genera árboles ASCII desde texto indentado |

### 📝 Texto
| Herramienta | Descripción |
|------------|-------------|
| Markdown Viewer | Previsualiza y renderiza Markdown |
| Word Counter | Cuenta palabras, caracteres y líneas |

### 📅 Fechas
| Herramienta | Descripción |
|------------|-------------|
| Time Zone Converter | Convierte entre zonas horarias |
| Date Converter | Convierte entre formatos de fecha |

### 🔐 Utilidades
| Herramienta | Descripción |
|------------|-------------|
| Password Generator | Generador de contraseñas seguras |  

---

## 🔹 Características principales

- Sistema de **plugins modular**, cada herramienta es independiente.  
- **Lazy loading** de cada herramienta para mejorar el rendimiento.  
- Menú y rutas generados automáticamente a partir de los plugins.  
- Compatible con **React Router Data Mode** (`createBrowserRouter`).  
- Soporta iconos usando **react-icons**.  
- Categorías, tags y descripciones para cada herramienta.  
- Dark mode + animaciones simples de transición.  

---

## 📂 Estructura del proyecto
```
├── 📁 assets
├── 📁 core
│   ├── 📁 layout
│   └── 📁 router
├── 📁 css
├── 📁 tools
│   └── 📄 App.tsx
├── 📁 types
├── 📁 utils
└── 📄 main.tsx
```

---

## ⚡ Sistema de plugins

Cada herramienta debe exportar un objeto que cumpla la interfaz `IPlugin`:

```ts
import { IPlugin } from '../../types/plugin';
import { FaJson } from 'react-icons/fa';

const JsonFormatterPlugin: IPlugin = {
  path: "/json-formatter",
  name: "JSON Formatter",
  icon: FaJson,
  category: "developer",
  description: "Format and beautify JSON quickly",
  tags: ["json", "formatter", "developer"],
  component: () => import("./JsonFormatterPage")
};

export default JsonFormatterPlugin;
```

---

## 📝 Añadir nuevas herramientas

1. Crear carpeta dentro de src/tools/:

```
├── 📁 nombre-tool
|   ├── 📄 ToolPage.tsx
│   └── 📄 plugin.ts
```

2. Crear plugin.ts siguiendo la interfaz IPlugin.

3. Importante: no es necesario tocar rutas ni App.tsx.

4. La nueva herramienta aparecerá automáticamente en el menú y se cargará lazy.

