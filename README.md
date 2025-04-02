# 🎥 KidsTube API

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

## 📝 Descripción

KidsTube API es el backend de una plataforma que permite a los padres controlar el contenido que sus hijos pueden ver. La API proporciona endpoints para la gestión de usuarios, perfiles, videos y playlists, implementando autenticación JWT para asegurar la seguridad de los datos.

### 🎯 Características Principales

- 🔐 Autenticación segura con JWT
- 👥 Gestión de múltiples perfiles de usuario
- 📺 Sistema de gestión de videos
- 📋 Creación y gestión de playlists
- 🛡️ Protección de rutas y datos
- 📱 API RESTful optimizada

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express.js** - Framework web
- **MongoDB** - Base de datos
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Multer** - Manejo de archivos
- **CORS** - Seguridad
- **Bcrypt** - Encriptación

## 📁 Estructura del Proyecto

```
├── config/         # ⚙️ Configuraciones de la aplicación
├── controllers/    # 🎮 Controladores de la lógica de negocio
├── middlewares/    # 🔄 Middlewares personalizados
├── models/         # 📊 Modelos de MongoDB
├── routes/         # 🛣️ Rutas de la API
├── Images/         # 🖼️ Almacenamiento de imágenes
├── .env           # 🔑 Variables de entorno
└── index.js       # 🚀 Punto de entrada de la aplicación
```

## ⚙️ Requisitos Previos

- Node.js (versión 14 o superior)
- MongoDB
- npm o yarn

## 🚀 Instalación

1. **Clonar el repositorio:**
```bash
git clone https://github.com/Chirivisco/KidsTube-API.git
cd KidsTube-API
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Crear archivo .env con las siguientes variables:**
```env
PORT=5000
MONGODB_URI=tu_uri_de_mongodb
JWT_SECRET=tu_secreto_jwt
```

4. **Iniciar el servidor:**
```bash
npm start
```

## 🔌 Endpoints Principales

### 🔐 Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/register` | Registro de usuario |
| POST | `/api/auth/login` | Inicio de sesión |

### 👥 Perfiles
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/profiles` | Obtener perfiles |
| POST | `/api/profiles` | Crear perfil |
| PUT | `/api/profiles/:id` | Actualizar perfil |
| DELETE | `/api/profiles/:id` | Eliminar perfil |

### 📺 Videos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/videos` | Obtener videos |
| POST | `/api/videos` | Subir video |
| PUT | `/api/videos/:id` | Actualizar video |
| DELETE | `/api/videos/:id` | Eliminar video |

### 📋 Playlists
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/playlists` | Obtener playlists |
| POST | `/api/playlists` | Crear playlist |
| PUT | `/api/playlists/:id` | Actualizar playlist |
| DELETE | `/api/playlists/:id` | Eliminar playlist |

## 🔒 Seguridad

- 🔐 Autenticación mediante JWT
- 🔑 Encriptación de contraseñas con bcrypt
- 🌐 Protección CORS
- ✅ Validación de datos en todas las rutas

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia ISC. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👥 Autores

- **Chirivisco** - *Trabajo Inicial* - [Chirivisco](https://github.com/Chirivisco)

## 🙏 Agradecimientos

- Express.js por su excelente framework
- MongoDB por su potente base de datos
- La comunidad de Node.js por sus valiosas herramientas 