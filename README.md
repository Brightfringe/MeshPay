# MeshPay

MeshPay is a full-stack offline-first payment simulation system inspired by UPI architecture. The project demonstrates how secure digital payments can function without internet access using mesh networking concepts and encrypted packet routing.

The system allows transaction packets to travel across nearby devices until a bridge node with internet connectivity synchronizes the transaction with the backend server.

---

## Features

* Offline payment simulation
* Mesh-based packet propagation
* Secure encrypted transaction packets
* Bridge node synchronization
* Real-time transaction dashboard
* Mesh state visualization
* TTL-based packet forwarding
* Duplicate transaction prevention
* Modern responsive fintech interface

---

## Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Framer Motion
* Axios

### Backend

* Spring Boot
* Java
* REST APIs
* JPA / Hibernate
* H2 Database

---

## Project Structure

```bash
MeshPay/
│
├── frontend/
│
├── backend/
│
└── README.md
```

---

## How It Works

1. A user initiates a payment offline.
2. The backend creates an encrypted payment packet.
3. Nearby devices relay the packet through the mesh network.
4. A bridge node with internet access uploads the packet to the backend server.
5. The backend validates and settles the transaction.
6. Transaction history and mesh state update in real time.

---

## Installation

### Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/MeshPay.git
cd MeshPay
```

---

## Run Backend

```bash
cd backend
```

### Set JAVA_HOME (Windows)

```powershell
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot'
$env:Path="$env:JAVA_HOME\bin;$env:Path"
```

### Start Backend Server

```bash
mvn spring-boot:run
```

Backend runs on:

```text
http://localhost:8080
```

---

## Run Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```text
http://localhost:8081
```

---

## API Endpoints

| Endpoint            | Description                   |
| ------------------- | ----------------------------- |
| `/api/accounts`     | Fetch accounts                |
| `/api/transactions` | Fetch transactions            |
| `/api/server-key`   | Fetch server public key       |
| `/api/demo/send`    | Simulate payment              |
| `/api/mesh/state`   | Current mesh state            |
| `/api/mesh/gossip`  | Simulate packet propagation   |
| `/api/mesh/flush`   | Upload packets through bridge |
| `/api/mesh/reset`   | Reset mesh network            |

---

## Core Concepts

### Mesh Networking

Devices relay encrypted transaction packets across nearby nodes without requiring direct internet access.

### Bridge Nodes

Devices with internet access synchronize locally propagated packets with the backend server.

### TTL (Time To Live)

Controls how many hops a packet can travel before expiring.

---

## Deployment

### Frontend

Deploy on:

* Vercel

### Backend

Deploy on:

* Render
* Railway
* Koyeb

---

## Future Improvements

* Real device-to-device communication
* Bluetooth or WiFi Direct integration
* Authentication system
* Real-time WebSocket updates
* Mobile application support
* Production-grade database integration

---

## Author

Shubhangi Sharma

