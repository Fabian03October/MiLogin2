# Sistema de Login con Pokédex

Este es un sistema de autenticación funcional desarrollado en Angular 20 que incluye:

## Características

### 🔐 Sistema de Autenticación
- **Login y Registro**: Formularios funcionales con validación
- **API de Usuarios**: Integración con https://api.escuelajs.co/api/v1/users
- **Almacenamiento Local**: Persistencia de sesión usando localStorage
- **Guards de Ruta**: Protección de rutas autenticadas
- **SSR Compatible**: Manejo correcto de localStorage en server-side rendering

### 👤 Perfil de Usuario
- **Información Completa**: Muestra todos los datos del usuario de la API
- **Tabla Detallada**: ID, nombre, email, rol, fechas de creación/actualización
- **Avatar**: Imagen de perfil desde la API
- **Interfaz Moderna**: Diseño responsivo y atractivo

### 🎮 Pokédex Interactiva
- **API de Pokémon**: Integración con https://pokeapi.co/api/v2/pokemon
- **151 Pokémon**: Región de Kanto completa
- **Filtros por Tipo**: Organización por categorías (fire, water, grass, etc.)
- **Tarjetas Pokémon**: Diseño tipo Trading Card Game
- **Modal Detallado**: Información completa de cada Pokémon
- **Estadísticas Visuales**: Barras de progreso para stats
- **Tipos y Habilidades**: Información completa de cada Pokémon

## Instalación y Ejecución

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Ejecutar en modo desarrollo**:
   ```bash
   npm start
   ```

3. **Abrir en el navegador**:
   ```
   http://localhost:4200
   ```

## Uso de la Aplicación

### Inicio de Sesión

**Opción 1: Usuarios de la API**
- Usa cualquier email de un usuario de la API: https://api.escuelajs.co/api/v1/users
- Cualquier contraseña será aceptada para usuarios de la API

**Opción 2: Crear Usuario Local**
1. Ve a "Registro"
2. Ingresa email y contraseña
3. Se creará un usuario local
4. Inicia sesión con esas credenciales
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
