# MEPROC Platform - Plataforma Educativa Principal

## 🚀 Funcionalidades Incluidas

- ✅ **Sistema de módulos educativos completo**
- ✅ **Sistema de exámenes**: Después del módulo 5 y 10
- ✅ **Preguntas de examen**: 10 múltiple opción + 5 emparejamiento
- ✅ **Certificados corregidos**: Sin letras pegadas, tipografía mejorada
- ✅ **Dashboard de estudiantes**
- ✅ **Seguimiento de progreso**
- ✅ **vercel.json incluido**: Sin error 404

## 🔑 Variables de Entorno Requeridas

```env
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key
```

### ¿Dónde encontrar las variables?

1. Ve a [Supabase Dashboard](https://app.supabase.com)
2. **Settings** → **API**
3. Copia:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

## 📁 Estructura del Proyecto

```
meproc_platform/
├── src/
│   ├── pages/
│   │   ├── ExamPage.tsx          # Nueva página de exámenes
│   │   ├── ModulePage.tsx        # Módulos con botones de examen
│   │   ├── StudentDashboard.tsx  # Dashboard actualizado
│   │   └── ...
│   ├── components/
│   └── ...
├── supabase/
│   └── functions/
│       └── generate-certificate/
│           └── index.ts          # Función corregida
├── public/
├── package.json
├── vercel.json                   # Configuración de rutas
└── README.md
```

## 🗄️ Base de Datos Requerida

**Tablas necesarias en Supabase:**
- `module_exams`
- `exam_questions`
- `matching_questions`
- `student_exam_results`

**Edge Functions requeridas:**
- `generate-certificate` (con CSS corregido)

## 📱 Deployment en Vercel

### Configuración:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: 18.x

### Variables de Entorno:
```
VITE_SUPABASE_URL = [tu_url_supabase]
VITE_SUPABASE_ANON_KEY = [tu_clave_supabase]
```

## ✅ Funcionalidades del Sistema de Exámenes

1. **Activación automática**: Los exámenes aparecen después de completar módulos 5 y 10
2. **Tipos de preguntas**:
   - 10 preguntas de opción múltiple
   - 5 preguntas de emparejamiento (drag & drop)
3. **Calificación**: Mínimo 70% para aprobar
4. **Resultados**: Muestra puntaje y estado (aprobado/reprobado)
5. **Persistencia**: Los resultados se guardan en la base de datos

## 🎯 Correcciones Implementadas

- **Certificados**: Solucionado problema de "letras pegadas"
- **CSS mejorado**: `letter-spacing`, `font-family` optimizados
- **Rutas**: Archivo `vercel.json` para evitar error 404
- **Responsive**: Interfaz adaptable a móviles

---

**Autor**: MiniMax Agent  
**Fecha**: 2025-08-30