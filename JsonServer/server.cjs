const jsonServer = require("json-server");
const path = require("path");
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

// Base de datos en memoria para tokens
const tokens = new Map();

// Generar token simple
function generateToken() {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// Middleware de autenticación personalizado
server.use(jsonServer.bodyParser);
server.use(middlewares);

// Endpoint de login
server.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const db = router.db;

    const user = db.get("users").find({ email, password }).value();

    if (!user) {
        return res.status(401).json({
            message: "Credenciales incorrectas",
            errors: {
                email: ["Las credenciales no coinciden con nuestros registros"],
            },
        });
    }

    // Generar token
    const token = generateToken();
    tokens.set(token, user.id);

    // Respuesta similar a Laravel
    res.json({
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    });
});

// Endpoint de logout
server.post("/api/logout", (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (token) {
        tokens.delete(token);
    }

    res.json({ message: "Sesión cerrada correctamente" });
});

// Endpoint para obtener usuario actual
server.get("/api/user", (req, res) => {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token || !tokens.has(token)) {
        return res.status(401).json({ message: "No autenticado" });
    }

    const userId = tokens.get(token);
    const db = router.db;
    const user = db.get("users").find({ id: userId }).value();

    if (!user) {
        return res.status(401).json({ message: "Usuario no encontrado" });
    }

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    });
});

// Middleware para verificar autenticación en rutas protegidas
server.use((req, res, next) => {
    // Rutas públicas
    if (req.method === "GET" && req.path === "/api/material") {
        return next();
    }

    // Verificar token para rutas protegidas
    if (req.path.startsWith("/api") && !req.path.includes("/login")) {
        const token = req.headers.authorization?.replace("Bearer ", "");

        if (!token || !tokens.has(token)) {
            return res.status(401).json({ message: "No autenticado" });
        }
    }

    next();
});

// Búsqueda de material
server.get("/api/material/search", (req, res) => {
    const query = req.query.q?.toLowerCase() || "";
    const db = router.db;

    const results = db
        .get("material")
        .filter(
            (item) =>
                item.nombre.toLowerCase().includes(query) ||
                item.codigo.toLowerCase().includes(query) ||
                item.categoria.toLowerCase().includes(query),
        )
        .value();

    res.json(results);
});

// Búsqueda por código de barras
server.get("/api/material/barcode/:barcode", (req, res) => {
    const { barcode } = req.params;
    const db = router.db;

    const material = db.get("material").find({ barcode }).value();

    if (!material) {
        return res.status(404).json({ message: "Material no encontrado" });
    }

    res.json(material);
});

// Devolver reserva
server.post("/api/reservas/:id/devolver", (req, res) => {
    const db = router.db;
    const reserva = db
        .get("reservas")
        .find({ id: parseInt(req.params.id) })
        .value();

    if (!reserva) {
        return res.status(404).json({ message: "Reserva no encontrada" });
    }

    // Actualizar estado
    db.get("reservas")
        .find({ id: parseInt(req.params.id) })
        .assign({ estado: "devuelta" })
        .write();

    // Actualizar disponibilidad del material
    db.get("material")
        .find({ id: reserva.material_id })
        .assign({ disponible: true })
        .write();

    res.json({ message: "Material devuelto correctamente" });
});

// Reescribir rutas para que /api/* funcione
server.use(
    jsonServer.rewriter({
        "/api/reservas": "/reservas",
        "/api/reservas/:id": "/reservas/:id",
        "/api/material": "/material",
        "/api/material/:id": "/material/:id",
        "/api/aulas": "/aulas",
        "/api/aulas/:id": "/aulas/:id",
        "/api/users": "/users",
        "/api/users/:id": "/users/:id",
    }),
);

// Usar el router por defecto
server.use(router);

// Función para iniciar el servidor con manejo de puertos ocupados
function startServer(port, maxAttempts = 10) {
    const initialPort = port;
    const maxPort = port + maxAttempts;

    const tryListen = (currentPort) => {
        const serverInstance = server
            .listen(currentPort)
            .on("listening", () => {
                console.log(
                    `🚀 JSON Server corriendo en http://localhost:${currentPort}`,
                );
                console.log(
                    `📚 API disponible en http://localhost:${currentPort}/api`,
                );
                console.log("\n👤 Usuarios de prueba:");
                console.log("   Admin: admin@classy.com / admin123");
                console.log("   Profesor: profesor@classy.com / profesor123");
                console.log("   Alumno: alumno@classy.com / alumno123");

                if (currentPort !== initialPort) {
                    console.log(
                        `\n⚠️  Puerto ${initialPort} estaba ocupado, usando puerto ${currentPort}`,
                    );
                    console.log(
                        `   Actualiza tu .env: VITE_API_URL=http://localhost:${currentPort}/api`,
                    );
                }
            })
            .on("error", (err) => {
                if (err.code === "EADDRINUSE") {
                    const nextPort = currentPort + 1;
                    if (nextPort <= maxPort) {
                        console.log(
                            `⚠️  Puerto ${currentPort} ocupado, intentando ${nextPort}...`,
                        );
                        tryListen(nextPort);
                    } else {
                        console.error(
                            `\n❌ Error: No se pudo encontrar un puerto disponible entre ${initialPort} y ${maxPort}`,
                        );
                        console.error(
                            "   Por favor, libera alguno de estos puertos o detén otros servicios.",
                        );
                        process.exit(1);
                    }
                } else {
                    console.error("❌ Error al iniciar el servidor:", err);
                    process.exit(1);
                }
            });
    };

    tryListen(port);
}

// Iniciar servidor
const PORT = 8000;
startServer(PORT);
