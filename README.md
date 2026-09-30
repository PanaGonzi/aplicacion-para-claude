# aplicacion-para-claude

Aplicación básica: el frontend muestra un cuadro de texto con el mensaje que le devuelve el backend.

- `backend/`: Java 17 + Spring Boot. Endpoint `GET http://localhost:8080/api/status`.
- `frontend/`: Angular 19. Consulta el endpoint y muestra el resultado.

## Ejecutar

Backend (puerto 8080):

```
cd backend
./mvnw spring-boot:run
```

Frontend (puerto 4200):

```
cd frontend
npm install
npm start
```

Abre http://localhost:4200 y verás el cuadro con "Funciona".
