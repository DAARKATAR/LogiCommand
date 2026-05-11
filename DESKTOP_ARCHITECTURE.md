# Arquitectura de Escritorio para Aplicaciones con Licencia

Esta documentación describe el modelo arquitectónico "Monolito Local + Electron" creado para transformar un sistema de microservicios en un software de escritorio distribuible (.exe) de bajo costo y alta eficiencia.

## Componentes del Stack

### 1. Backend (Motor Interno)
- **Tecnología:** Spring Boot 3.x.
- **Base de Datos:** SQLite (Embebida). Los datos se guardan en un archivo `logistics.db` en la carpeta raíz.
- **Comunicación Interna:** `Spring ApplicationEvents`. Sustituye a RabbitMQ, permitiendo que los módulos se hablen en memoria de forma asíncrona usando `@EventListener` y `@Async`.
- **Servicios:** Unificados en un solo proceso para reducir el consumo de RAM de 4GB+ a menos de 500MB.

### 2. Frontend (Interfaz Gráfica)
- **Tecnología:** React + Vite.
- **Navegación:** No requiere navegador externo (Chrome/Edge).
- **Contenedor:** **Electron**. Provee la ventana nativa de Windows, maneja el ciclo de vida del proceso y permite el empaquetado final.

### 3. Motor de Mapas (OSRM Local)
- **Estrategia:** En lugar de Docker, se utiliza el binario nativo `osrm-routed.exe` para Windows.
- **Mapas:** El archivo `.osm.pbf` se procesa previamente y los grafos resultantes se distribuyen con el instalador.

## Guía de Empaquetado (.exe)

Para generar el instalador final para el cliente:

1. **Compilar Backend:**
   ```powershell
   cd backend/logistics-monolith
   ./mvnw.cmd clean package
   ```
2. **Compilar Frontend:**
   ```powershell
   cd frontend/web-app
   npm run build
   ```
3. **Generar Instalador:**
   ```powershell
   cd frontend/web-app
   npm run electron:build
   ```
   *El archivo resultante aparecerá en `frontend/web-app/dist-electron/`.*

## Beneficios para el Modelo de Licencias
- **Instalación:** "Siguiente, Siguiente, Finalizar". No requiere instalar Docker, Postgres o Mongo.
- **Desinstalación:** Limpia y estándar desde el Panel de Control de Windows.
- **Costos:** 0% de costo en servidores mensuales. El software corre 100% en la máquina del cliente.
- **Seguridad:** Los datos nunca salen de la PC del cliente a menos que se configure un backup en la nube.
