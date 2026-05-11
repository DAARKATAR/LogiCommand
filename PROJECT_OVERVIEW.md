# 🏗️ LogiCommand: Documentación Técnica del Proyecto

**LogiCommand** es una arquitectura de microservicios de vanguardia diseñada para la gestión logística avanzada, orquestación de flotas y seguimiento en tiempo real.

---

## 🗺️ Arquitectura del Sistema

El sistema utiliza un patrón de **Microservicios con Comunicación Híbrida** (REST para operaciones síncronas y RabbitMQ para eventos asíncronos).

### 🏗️ Diagrama de Componentes
- **Frontend (React):** Interfaz de usuario "Executive Command" con estética Glassmorphism.
- **API Gateway (Spring Cloud Gateway):** Punto de entrada único que gestiona el enrutamiento y CORS.
- **Order Service:** Núcleo de la lógica de negocio para pedidos (PostgreSQL).
- **Dispatch Service:** Gestión de asignación de conductores y vehículos (PostgreSQL).
- **Tracking Service:** Almacenamiento masivo de coordenadas GPS (MongoDB).
- **Notification Service:** Sistema de registro de eventos y alertas (RabbitMQ).

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
| :--- | :--- |
| **Frontend** | React 18, Tailwind/Vanilla CSS, Lucide Icons, Framer Motion. |
| **Backend** | Java 17, Spring Boot 3.x, Spring Data JPA/MongoDB. |
| **Mensajería** | RabbitMQ (Topic Exchange: `logistics.exchange`). |
| **Bases de Datos** | PostgreSQL (Relacional), MongoDB (NoSQL/Documental). |
| **Infraestructura** | Docker & Docker Compose. |

---

## 🔌 Especificaciones de Servicios

### 1. API Gateway (Puerto 8080)
Centraliza todas las solicitudes.
- `/api/orders/**` ➡️ `order-service:8081`
- `/api/dispatch/**` ➡️ `dispatch-service:8082`
- `/api/tracking/**` ➡️ `tracking-service:8084`
- `/api/notifications/**` ➡️ `notification-service:8083`

### 2. Order Service (Puerto 8081)
Gestiona el ciclo de vida de los pedidos.
- **Entidad:** `Order` (id, customerName, destinationAddress, status, createdAt).
- **Eventos:** Publica en `order.*` cuando se crea o actualiza un pedido.
- **Base de Datos:** PostgreSQL.

### 3. Tracking Service (Puerto 8084)
Optimizado para alta escritura de datos GPS.
- **Entidad:** `Location` (orderId, latitude, longitude, timestamp).
- **Base de Datos:** MongoDB (colección `locations`).

### 4. Notification Service (Puerto 8083)
Consumidor de eventos para auditoría y alertas.
- **Cola:** `notification.queue` vinculada a `logistics.exchange` con patrón `order.*`.
- **Funcionalidad:** Registra cada cambio de estado de los pedidos.

---

## 🚀 Cómo Ejecutar el Proyecto

### Requisitos Previos
- Docker Desktop instalado.
- Node.js (opcional para desarrollo local del frontend).

### Pasos para Iniciar
1. **Levantar Infraestructura y Servicios:**
   ```powershell
   docker-compose up -d --build
   ```
2. **Acceso a Herramientas de Administración:**
   - **Frontend:** [http://localhost:3000](http://localhost:3000)
   - **RabbitMQ Management:** [http://localhost:15672](http://localhost:15672) (admin/adminpassword)
   - **API Gateway:** [http://localhost:8080](http://localhost:8080)

---

## 🔄 Flujo de Trabajo a Nivel de Código

1. **Frontend (`App.jsx`):** Realiza llamadas al Gateway usando `OrderService` (servicios definidos en `src/services/api.js`).
2. **Gateway:** Redirige la petición al microservicio correspondiente basado en el prefijo de la URL.
3. **Microservicio:** Procesa la lógica, persiste en la DB y, si es necesario, envía un mensaje a RabbitMQ.
4. **Consumidores:** Otros servicios reaccionan al mensaje de forma asíncrona (ej. `notification-service`).

---

## 📌 Estado Actual y Próximos Pasos
- [x] CRUD de Pedidos funcional.
- [x] Integración de API Gateway estable.
- [x] Dashboard visual con métricas en tiempo real.
- [ ] **Fase 6:** Implementación del historial de envíos.
- [ ] **Fase 7:** Optimización de rutas mediante algoritmos de grafos.
