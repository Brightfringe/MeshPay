<div align="center">

<!-- Animated Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,50:203a43,100:2c5364&height=200&section=header&text=MeshPay&fontSize=80&fontColor=00f5d4&fontAlignY=38&desc=Offline-First%20Mesh%20Payment%20System&descAlignY=58&descColor=ffffff&animation=fadeIn" width="100%"/>

<br/>

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-mesh--pay--4o6k.vercel.app-00f5d4?style=for-the-badge&logo=vercel&logoColor=white)](https://mesh-pay-4o6k.vercel.app/)
[![Backend](https://img.shields.io/badge/⚙️%20Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)
[![Frontend](https://img.shields.io/badge/🚀%20Frontend-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://mesh-pay-4o6k.vercel.app/)

<br/>

> **MeshPay** is a full-stack offline-first payment simulation system inspired by UPI architecture —  
> demonstrating how secure digital payments can function **without internet access** using mesh networking and encrypted packet routing.

</div>

---

## ✨ Features

<div align="center">

| 🔌 Offline Payments | 🔐 Encrypted Packets | 🌐 Mesh Propagation |
|:---:|:---:|:---:|
| Payments work without internet via mesh relay | RSA-encrypted transaction packets | TTL-based multi-hop packet forwarding |

| 🌉 Bridge Sync | 📊 Live Dashboard | ♻️ Duplicate Prevention |
|:---:|:---:|:---:|
| Bridge nodes sync to backend when online | Real-time transaction & mesh state view | Each packet ID is tracked to prevent replay |

</div>

---

## 🎬 How It Works

```
  📱 User                🔗 Mesh Node A          🔗 Mesh Node B         🌐 Bridge Node          ☁️ Backend
    │                        │                       │                       │                      │
    │── Initiate Payment ──▶ │                       │                       │                      │
    │                        │── Relay Packet ──────▶│                       │                      │
    │                        │                       │── Forward Packet ────▶│                      │
    │                        │                       │                       │── Sync to Server ───▶│
    │                        │                       │                       │                      │── Validate & Settle
    │◀─────────────────────────────────── Transaction Confirmed ─────────────────────────────────── │
```

1. 🧾 A user initiates a payment **offline**
2. 🔒 The backend creates an **encrypted payment packet**
3. 📡 Nearby devices **relay the packet** through the mesh network
4. 🌉 A **bridge node** with internet access uploads it to the server
5. ✅ The backend **validates and settles** the transaction
6. 📊 Dashboard and mesh state **update in real time**

---

## 🛠️ Tech Stack

<div align="center">

### Frontend
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-black?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com)

### Backend
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com)
[![H2 Database](https://img.shields.io/badge/H2_Database-1B6AC6?style=for-the-badge&logo=amazondynamodb&logoColor=white)](https://www.h2database.com)
[![JPA Hibernate](https://img.shields.io/badge/JPA%20%2F%20Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white)](https://hibernate.org)

### Deployment
[![Vercel](https://img.shields.io/badge/Vercel-Frontend-black?style=for-the-badge&logo=vercel&logoColor=white)](https://mesh-pay-4o6k.vercel.app/)
[![Render](https://img.shields.io/badge/Render-Backend-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://render.com)

</div>

---

## 🌐 Live Deployment

| Layer | Platform | URL |
|-------|----------|-----|
| 🖥️ **Frontend** | Vercel | [https://mesh-pay-4o6k.vercel.app/](https://mesh-pay-4o6k.vercel.app/) |
| ⚙️ **Backend** | Render | Auto-deployed Spring Boot REST API |

> **Note:** The backend is hosted on Render's free tier. On first load, the server may take **~30–60 seconds** to spin up from sleep. Please wait a moment if the dashboard shows a loading state.

---

## 🗂️ Project Structure

```
MeshPay/
│
├── 📁 frontend/          # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/   # UI components (Dashboard, MeshView, etc.)
│   │   ├── pages/        # Page-level views
│   │   └── api/          # Axios API calls
│   └── vite.config.ts
│
├── 📁 backend/           # Spring Boot REST API
│   ├── src/main/java/
│   │   ├── controller/   # REST controllers
│   │   ├── service/      # Business logic
│   │   ├── model/        # JPA entities
│   │   └── repository/   # Data access
│   └── pom.xml
│
└── 📄 README.md
```

---

## 🚀 Local Installation

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/MeshPay.git
cd MeshPay
```

### 2. Run the Backend
```bash
cd backend

# Set JAVA_HOME (Windows PowerShell)
$env:JAVA_HOME='C:\Program Files\Eclipse Adoptium\jdk-17.0.18.8-hotspot'
$env:Path="$env:JAVA_HOME\bin;$env:Path"

# Start the server
mvn spring-boot:run
```
> Backend runs at: `http://localhost:8080`

### 3. Run the Frontend
```bash
# Open a new terminal
cd frontend
npm install
npm run dev
```
> Frontend runs at: `http://localhost:8081`

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/accounts` | Fetch all accounts |
| `GET` | `/api/transactions` | Fetch transaction history |
| `GET` | `/api/server-key` | Fetch server public key |
| `POST` | `/api/demo/send` | Simulate a payment |
| `GET` | `/api/mesh/state` | Get current mesh state |
| `POST` | `/api/mesh/gossip` | Simulate packet propagation |
| `POST` | `/api/mesh/flush` | Upload packets via bridge node |
| `POST` | `/api/mesh/reset` | Reset the mesh network |

---

## 🧠 Core Concepts

### 📡 Mesh Networking
Devices relay encrypted transaction packets across nearby nodes without requiring direct internet access — enabling payments in low-connectivity or zero-connectivity environments.

### 🌉 Bridge Nodes
Devices with internet access act as bridge nodes that collect locally propagated packets and synchronize them with the backend server when a connection is available.

### ⏳ TTL (Time To Live)
Each packet carries a TTL counter that decrements with every hop. Once TTL reaches zero, the packet expires — preventing infinite loops across the mesh.

### 🔐 Encrypted Packets
Transaction data is RSA-encrypted before being broadcast across the mesh, ensuring that intermediate nodes relay packets without being able to read the contents.

---

## 🔮 Future Improvements

- [ ] 📶 Real device-to-device communication via **Bluetooth / WiFi Direct**
- [ ] 🔑 Full **authentication system** (JWT / OAuth)
- [ ] ⚡ **WebSocket** real-time updates
- [ ] 📱 **Mobile application** (React Native / Flutter)
- [ ] 🗄️ Production-grade **PostgreSQL** integration
- [ ] 🗺️ Animated live **mesh topology map**
- [ ] 🌍 Multi-currency & multi-region support

---

## 👩‍💻 Author

<div align="center">

**Shubhangi Sharma**

[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/YOUR_USERNAME)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/YOUR_PROFILE)

*Built with ❤️ to explore the frontier of offline-first fintech systems.*

</div>

---

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:2c5364,50:203a43,100:0f2027&height=120&section=footer&animation=fadeIn" width="100%"/>
</div>
