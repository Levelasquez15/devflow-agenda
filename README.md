# DevFlow Agenda — Notion-Style Learning Planner & Roadmaps Desktop

Una aplicación de escritorio para computadora diseñada específicamente para **organizar, planificar y contabilizar tu tiempo de estudio** siguiendo rutas de aprendizaje inspiradas en [roadmap.sh](https://roadmap.sh).

---

## 🚀 Características Principales

### 1. 🗺️ Rutas de Aprendizaje Integradas (roadmap.sh)
- **Go (Golang) Developer Roadmap**: Fundamentos, sintaxis básica, tipos primitivos, bucles `for`, sentencias condicionales, funciones y `defer`, punteros, gestión de memoria, estructuras, slices dinámicos y concurrencia avanzada con Goroutines y Canales (`channels`).
- **Ciberseguridad & Hacking Ético**: Redes de computadoras, modelo OSI vs TCP/IP, análisis de puertos, escaneo con Nmap, OWASP Top 10 (SQL Injection, XSS) y defensa en servidores.
- **PostgreSQL Database Engineer**: Arquitectura de base de datos, tipos de datos nativos, consultas complejas con CTEs (`WITH`) y Window Functions (`OVER, PARTITION BY`), datos semiestructurados con `JSONB` e índices GIN.
- **Generador Inteligente de Rutas**: Permite crear rutas de estudio para cualquier otra habilidad (ej. *Inglés Técnico para Programadores*, *Docker*, *Rust*, etc.) con desglose semanal, diario, videos y ejercicios prácticos.

---

### 2. 📅 Agenda & Planificador Estilo Notion
- **Agenda Semanal (7 Días)**: Distribución de lunes a domingo con bloques de tiempo, duración asignada, estado (*Pendiente*, *En curso*, *Completado*) y botón directo de estudio.
- **Enfoque de Hoy & Planear para Mañana**:
  - **Metas de Hoy**: Muestra los temas programados para el día y contabilizador de tiempo en vivo.
  - **Planear para Mañana**: Selector inteligente en 1 clic para asignar temas de Ciberseguridad, Go o Postgres para el día siguiente.
- **Calendario Mensual**: Visualización de 35 días con mapa de constancia, días completados y progreso hacia la meta mensual de horas.

---

### 3. 🎯 Focus Study Studio (Reproductor de YouTube Integrado)
- **Reproductor de YouTube Embebido**: Visualización de videos directamente dentro de la aplicación mediante la API oficial de YouTube IFrame (`window.YT`).
- **Contabilizador de Tiempo Real**: Rastrea con exactitud los minutos y segundos reales de estudio. Si el video se pausa, el temporizador de sesión se detiene para evitar distracciones.
- **Modos de Temporizador**:
  - **🍅 Modo Pomodoro**: Intervalos configurables de enfoque (ej. 25 min) alternados con descansos (5 min) y notificaciones de escritorio al finalizar cada bloque.
  - **⏱️ Modo Continuo**: Cronómetro continuo sin interrupciones para sesiones de flujo prolongado.
- **Apuntes Estilo Notion**: Área de notas integrada junto al video con autoguardado automático en tiempo real.
- **Desafíos & Práctica Guiada**: Checklists interactivos de ejercicios prácticos y snippets de código con botón de copia rápida.
- **Celebración de Logros**: Animación de confeti y actualización automática de la racha al completar cada sesión.

---

### 4. 📊 Contabilidad & Métricas de Rendimiento
- **Horas Hoy & Esta Semana**: Contabilización exacta de las horas dedicadas.
- **Rachas Activas (Streaks)**: Contador de días consecutivos estudiando.
- **Gráfico Semanal de Barras**: Distribución visual de horas dedicadas por cada día de la semana.
- **Porcentaje de Dominio por Roadmap**: Seguimiento del % de módulos completados por tecnología.
- **Copia de Seguridad**: Exportación e importación instantánea de todos tus datos en formato JSON.

---

## 🛠️ Tecnologías Utilizadas
- **React 19 & Vite 8**: Interfaz reactiva ultra veloz.
- **Electron 44**: Entorno nativo de escritorio para Windows.
- **Lucide Icons**: Iconografía moderna y minimalista.
- **Canvas Confetti**: Microanimaciones de celebración.
- **YouTube IFrame Player API**: Integración y control de reproducción.
- **CSS Design Tokens**: Tema oscuro profundo (*obsidian*), degradados sutiles y efectos glassmorphism.

---

## 💻 Instrucciones de Ejecución

### Modo Desarrollo Web (Navegador):
```bash
npm run dev
```
Abre en tu navegador en `http://localhost:5173`.

### Modo Aplicación de Escritorio (Electron):
```bash
npm run electron:dev
```
O ejecuta la versión empaquetada:
```bash
npm run electron:start
```

### Compilar para Producción:
```bash
npm run build
```
