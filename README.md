# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Front

1. Introducción

- El sistema se desarrollará utilizando React.js en el frontend.

2. Requerimientos Funcionales

2.1 Consulta de Inventarios (Perfil Cliente)

- Visualización en tiempo real de productos disponibles, precios y cantidad restante.
- Búsqueda y filtrado de productos por categoría, disponibilidad y precio.
- Visualización de la ubicación del punto de venta.
- (Bonus) Implementación de caché para reducir tiempos de carga y mejorar la experiencia del usuario.

2.2 Gestión de Pedidos

- Creación de pedidos por parte de los clientes.

2.3 Diseño Responsive y Accesibilidad

- Adaptabilidad total de la interfaz para dispositivos móviles, tabletas y escritorio.
- Interfaz intuitiva con navegación clara y rápida para ambos perfiles.
- Uso de buenas prácticas de accesibilidad (contrastes adecuados, etiquetas ARIA, navegación por teclado, etc.).

3. Requerimientos No Funcionales

3.1 Tecnologías y Herramientas

- Frontend: React.js con Vite y Tailwind CSS.
- Despliegue: Vercel.

3.2 Experiencia de Usuario

- Interfaz intuitiva y responsive para facilitar la navegación en dispositivos móviles y escritorio.
- (Bonus) Sistema de notificaciones en tiempo real para actualizaciones de inventario y pedidos.
- Nota: El bonus es solo para el "tiempo real" de las notificaciones, sin embargo son obligatorias y deben implementarse con o sin "tiempo real".

4. Funcionalidades Adicionales

- Historial de pedidos para que los clientes puedan ver sus compras anteriores.
- Sistema de reseñas y calificaciones para evaluar la calidad de los productos y tiempos de entrega.
- (Opcional) Integración con pasarela de pagos para permitir compras directas dentro de la aplicación.

5. Criterios de Evaluación

- Experiencia de usuario fluida y sin errores críticos.
