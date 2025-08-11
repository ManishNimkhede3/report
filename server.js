const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

// Load environment variables from .env file
dotenv.config();

// Set up the port, reading from .env or defaulting to 3000
const PORT = process.env.PORT || 3000;

const app = express();

// Standard middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection and table creation
const sequelize = require('./config/database');
require('./models/report.model'); // This ensures the Report model is loaded by Sequelize

// The `sync()` method will create the 'tbl_report' table if it does not exist.
// It will not touch any other existing tables.
sequelize.sync({ force: false }).then(() => {
    console.log('Database synced successfully.');
    console.log('Table `tbl_report` is ready.');
}).catch(err => {
    console.error('Unable to sync database:', err);
});

// --- Swagger Configuration ---
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Report API Module',
            version: '1.0.0',
            description: 'API for managing reports with JWT authentication and query execution on specified tables.',
        },
        servers: [
            {
                url: 'https://report-q885.onrender.com',
                description: 'Production Server'
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Enter JWT token for authentication.'
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    // Path to the API docs files
    apis: ['./routes/report.routes.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// API Routes
const reportRoutes = require('./routes/report.routes');
app.use('/api/reports', reportRoutes);

// Simple root route for a basic health check / welcome message
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Report API module. Go to /api-docs for documentation.' });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
    console.log(`API documentation available at https://report-q885.onrender.com/api-docs`);
});
