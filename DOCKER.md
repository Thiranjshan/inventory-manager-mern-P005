# 🐳 Docker Setup Guide

This guide explains how to run the Inventory Manager application using Docker and Docker Compose.

## Prerequisites

- **Docker** - [Download Docker Desktop](https://www.docker.com/products/docker-desktop)
- **Docker Compose** - Usually included with Docker Desktop

### Verify Installation

```bash
docker --version
docker compose version
```

---

## Quick Start

### 1. Build and Start All Services

```bash
docker compose up --build
```

This will:

- Build the backend image
- Build the frontend image
- Start MongoDB container
- Start backend service
- Start frontend service

**Wait for all services to be healthy** (typically 30-60 seconds)

### 2. Access the Application

- **Frontend**: http://localhost
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017 (internal, not exposed for connection)

### 3. Stop Services

```bash
docker compose down
```

### 4. Stop and Remove Data

```bash
docker compose down -v
```

The `-v` flag removes all volumes (including MongoDB data).

---

## What's Included

### Services

#### MongoDB (Port: 27017 internal)

- Image: `mongo:7.0-alpine`
- Container: `inventory-mongodb`
- Database: `inventory-manager`
- Credentials: `admin / admin123`
- Health Check: Enabled

#### Backend (Port: 5000)

- Image: Built from `./backend/dockerfile`
- Container: `inventory-backend`
- Environment: Production
- Depends on: MongoDB (waits for health check)
- Health Check: Enabled

#### Frontend (Port: 80)

- Image: Built from `./frontend/dockerfile`
- Container: `inventory-frontend`
- Serves: Nginx on port 80
- Depends on: Backend (waits for health check)
- Health Check: Enabled

---

## Configuration

### Environment Variables

Edit `.env.docker` before running `docker compose up`:

```env
# MongoDB
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=admin123
MONGO_INITDB_DATABASE=inventory-manager

# Backend
NODE_ENV=production
JWT_SECRET=change-this-to-random-string-in-production
PORT=5000

# Frontend
VITE_API_URL=http://localhost:5000
```

### Change Ports

Edit `docker-compose.yml` to change exposed ports:

```yaml
# Frontend - change first number (host port)
ports:
  - "8080:80"  # Access at http://localhost:8080

# Backend - change first number (host port)
ports:
  - "5001:5000"  # Access at http://localhost:5001

# MongoDB - change first number (host port)
ports:
  - "27018:27017"  # Connect to localhost:27018
```

---

## Useful Commands

### View Running Containers

```bash
docker compose ps
```

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f mongodb
```

### Execute Command in Container

```bash
# Backend
docker compose exec backend npm list

# MongoDB
docker compose exec mongodb mongosh -u admin -p admin123
```

### Rebuild Images

```bash
# Rebuild all
docker compose build

# Rebuild specific service
docker compose build backend
```

### Remove Everything

```bash
# Stop and remove containers
docker compose down

# Remove volumes too
docker compose down -v

# Remove images
docker rmi inventory-backend inventory-frontend
```

---

## Troubleshooting

### Service Won't Start

**Check logs:**

```bash
docker compose logs backend
docker compose logs frontend
docker compose logs mongodb
```

**Common Issues:**

- Port already in use: Change port in docker-compose.yml
- Out of disk space: Free up disk space
- Old containers: Run `docker compose down -v` first

### MongoDB Connection Error

**Check MongoDB health:**

```bash
docker compose ps
```

Look for MongoDB status. If it's not "healthy", wait a moment and try again.

**Verify connection:**

```bash
docker compose exec mongodb mongosh -u admin -p admin123
```

### Frontend Shows Blank Page

**Check logs:**

```bash
docker compose logs frontend
```

**Verify API URL:**

- Frontend should connect to `http://backend:5000` (internal Docker network)
- Browser should connect to `http://localhost:5000` (host machine)

### Backend Can't Connect to MongoDB

**Verify the connection string:**

- Should be: `mongodb://admin:admin123@mongodb:27017/inventory-manager?authSource=admin`
- Service name `mongodb` works inside Docker network
- Username/password must match MONGO credentials

---

## Advanced Usage

### Custom Network

Containers communicate via `inventory-network` bridge network:

```bash
# Inspect network
docker network inspect inventory-manager_inventory-network
```

### Volume Management

Two volumes persist data:

- `mongodb_data` - Database files
- `mongodb_config` - MongoDB configuration

```bash
# List volumes
docker volume ls | grep inventory

# Inspect volume
docker volume inspect inventory-manager_mongodb_data

# Remove volume
docker volume rm inventory-manager_mongodb_data
```

### Build Args

Customize build arguments:

```bash
docker compose build --build-arg VITE_API_URL=https://api.example.com
```

---

## Performance Tips

### Reduce Build Time

Use `.dockerignore` (already included) to exclude unnecessary files.

### Reduce Memory Usage

```bash
# Run in background
docker compose up -d

# Limit resources
docker compose run --memory 512m backend npm start
```

### Speed Up Initial Build

```bash
# Use BuildKit (faster builder)
DOCKER_BUILDKIT=1 docker compose build
```

---

## Deployment

### Production Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a random string
- [ ] Change MongoDB password to a strong password
- [ ] Update `NODE_ENV` to `production`
- [ ] Update `VITE_API_URL` to your domain
- [ ] Use proper SSL certificates
- [ ] Set up proper backups for MongoDB volumes
- [ ] Configure persistent volumes on server
- [ ] Set resource limits
- [ ] Set up monitoring and logging

### Example Production docker-compose.yml

```yaml
version: "3.8"

services:
  mongodb:
    image: mongo:7.0-alpine
    container_name: inventory-mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USER}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
    volumes:
      - /data/mongodb:/data/db
    networks:
      - inventory-network

  backend:
    image: inventory-backend:latest
    container_name: inventory-backend
    restart: always
    environment:
      NODE_ENV: production
      MONGO_URI: mongodb://${MONGO_USER}:${MONGO_PASSWORD}@mongodb:27017/inventory-manager
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - mongodb
    networks:
      - inventory-network

  frontend:
    image: inventory-frontend:latest
    container_name: inventory-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - inventory-network

networks:
  inventory-network:
    driver: bridge
```

---

## Docker Hub Deployment

### Push Images to Registry

```bash
# Login to Docker Hub
docker login

# Tag images
docker tag inventory-backend:latest yourusername/inventory-backend:latest
docker tag inventory-frontend:latest yourusername/inventory-frontend:latest

# Push images
docker push yourusername/inventory-backend:latest
docker push yourusername/inventory-frontend:latest
```

### Pull and Run

```bash
docker compose -f docker-compose.prod.yml up
```

---

## Monitoring

### Check Container Status

```bash
docker compose ps
```

### Monitor Resource Usage

```bash
docker stats
```

### View Container Logs with Timestamps

```bash
docker compose logs --timestamps -f
```

---

## Clean Up

### Remove Unused Resources

```bash
# Remove unused containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Clean everything
docker system prune -a --volumes
```

---

## Useful Links

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Image](https://hub.docker.com/_/mongo)
- [Node.js Docker Image](https://hub.docker.com/_/node)
- [Nginx Docker Image](https://hub.docker.com/_/nginx)

---

## Support

For issues or questions about Docker setup:

1. Check logs: `docker compose logs -f`
2. Verify prerequisites are installed
3. Ensure ports are not in use
4. Try: `docker compose down -v && docker compose up --build`

---

**Happy containerizing! 🐳**
