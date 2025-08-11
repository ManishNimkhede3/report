




// const Report = require('../models/report.model');
// const jwt = require('jsonwebtoken');
// const sequelize = require('../config/database');

// // Create a new report
// exports.create = async (req, res) => {
//     try {
//         // Extract token from Authorization header
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         // Decode token to get user ID
//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         // Validate required fields
//         const { report_name, sql_query, graph_type } = req.body;
//         if (!report_name || !sql_query || !graph_type) {
//             return res.status(400).send({
//                 message: `Missing required fields: ${[!report_name && 'report_name', !sql_query && 'sql_query', !graph_type && 'graph_type'].filter(Boolean).join(', ')}.`
//             });
//         }

//         // Create report with created_by set to userId
//         const report = await Report.create({
//             ...req.body,
//             created_by: userId
//         });
//         res.status(201).send(report);
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while creating the Report." });
//     }
// };

// // Retrieve all reports
// exports.findAll = async (req, res) => {
//     try {
//         const reports = await Report.findAll();
//         res.status(200).send(reports);
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while retrieving reports." });
//     }
// };

// // Find a single report by ID
// exports.findOne = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const report = await Report.findByPk(id);
//         if (report) {
//             res.status(200).send(report);
//         } else {
//             res.status(404).send({ message: `Cannot find Report with id=${id}.` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Error retrieving Report with id=" + req.params.id });
//     }
// };

// // Update a report by ID
// exports.update = async (req, res) => {
//     try {
//         // Extract token from Authorization header
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         // Decode token to get user ID
//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const id = req.params.id;
//         // Validate required fields for update (only if provided)
//         if (req.body.report_name === undefined || req.body.report_name === null) {
//             return res.status(400).send({ message: "Report name is required." });
//         }
//         if (req.body.sql_query === undefined || req.body.sql_query === null) {
//             return res.status(400).send({ message: "SQL query is required." });
//         }
//         if (req.body.graph_type === undefined || req.body.graph_type === null) {
//             return res.status(400).send({ message: "Graph type is required." });
//         }

//         // Update report with updated_by set to userId
//         const [num] = await Report.update(
//             {
//                 ...req.body,
//                 updated_by: userId
//             },
//             {
//                 where: { id: id }
//             }
//         );

//         if (num === 1) {
//             res.send({ message: "Report was updated successfully." });
//         } else {
//             res.send({ message: `Cannot update Report with id=${id}. Maybe Report was not found or req.body is empty!` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Error updating Report with id=" + req.params.id });
//     }
// };

// // Delete a report by ID
// exports.delete = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const num = await Report.destroy({
//             where: { id: id }
//         });

//         if (num === 1) {
//             res.send({ message: "Report was deleted successfully!" });
//         } else {
//             res.send({ message: `Cannot delete Report with id=${id}. Maybe Report was not found!` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Could not delete Report with id=" + req.params.id });
//     }
// };

// // Run SQL query from report on specified table
// exports.runQuery = async (req, res) => {
//     try {
//         // Extract token from Authorization header
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         // Decode token to get user ID
//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { report_name, table_name } = req.body;

//         // Validate required fields
//         if (!report_name || !table_name) {
//             return res.status(400).send({
//                 message: `Missing required fields: ${[!report_name && 'report_name', !table_name && 'table_name'].filter(Boolean).join(', ')}.`
//             });
//         }

//         // Find the report by report_name
//         const report = await Report.findOne({ where: { report_name } });
//         if (!report) {
//             return res.status(404).send({ message: `Report with name "${report_name}" not found.` });
//         }

//         // Verify user has access to the report
//         if (report.user_id && !report.user_id.includes(userId)) {
//             return res.status(403).send({ message: "User does not have access to this report." });
//         }

//         // Validate table name (basic check to prevent SQL injection)
//         if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table_name)) {
//             return res.status(400).send({ message: "Invalid table name." });
//         }

//         // Check if the table exists in the database
//         try {
//             const tableExists = await sequelize.query(
//                 `SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)`,
//                 {
//                     replacements: { table_name },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             if (!tableExists[0].exists) {
//                 return res.status(404).send({ message: `Table "${table_name}" does not exist in the database.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking table existence: ${error.message}` });
//         }

//         // Replace {{table_name}} placeholder in the SQL query
//         let finalQuery = report.sql_query;
//         if (finalQuery.includes('{{table_name}}')) {
//             finalQuery = finalQuery.replace(/{{table_name}}/g, table_name);
//         } else {
//             // If the query doesn't use the placeholder, assume the table_name should be used directly
//             finalQuery = finalQuery.replace(/FROM\s+\w+/i, `FROM ${table_name}`);
//         }

//         // Execute the SQL query
//         try {
//             const queryResult = await sequelize.query(finalQuery, {
//                 type: sequelize.QueryTypes.SELECT
//             });
//             res.status(200).send({
//                 message: "Query executed successfully.",
//                 data: queryResult
//             });
//         } catch (queryError) {
//             return res.status(400).send({ message: `Invalid SQL query: ${queryError.message}` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while executing the query." });
//     }
// };






// const Report = require('../models/report.model');
// const jwt = require('jsonwebtoken');
// const sequelize = require('../config/database');

// // Create a new report
// exports.create = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { report_name, sql_query, graph_type } = req.body;
//         if (!report_name || !sql_query || !graph_type) {
//             return res.status(400).send({
//                 message: `Missing required fields: ${[!report_name && 'report_name', !sql_query && 'sql_query', !graph_type && 'graph_type'].filter(Boolean).join(', ')}.`
//             });
//         }

//         const report = await Report.create({
//             ...req.body,
//             created_by: userId
//         });
//         res.status(201).send(report);
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while creating the Report." });
//     }
// };

// // Retrieve all reports
// exports.findAll = async (req, res) => {
//     try {
//         const reports = await Report.findAll();
//         res.status(200).send(reports);
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while retrieving reports." });
//     }
// };

// // Find a single report by ID
// exports.findOne = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const report = await Report.findByPk(id);
//         if (report) {
//             res.status(200).send(report);
//         } else {
//             res.status(404).send({ message: `Cannot find Report with id=${id}.` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Error retrieving Report with id=" + req.params.id });
//     }
// };

// // Update a report by ID
// exports.update = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const id = req.params.id;
//         if (req.body.report_name === undefined || req.body.report_name === null) {
//             return res.status(400).send({ message: "Report name is required." });
//         }
//         if (req.body.sql_query === undefined || req.body.sql_query === null) {
//             return res.status(400).send({ message: "SQL query is required." });
//         }
//         if (req.body.graph_type === undefined || req.body.graph_type === null) {
//             return res.status(400).send({ message: "Graph type is required." });
//         }

//         const [num] = await Report.update(
//             {
//                 ...req.body,
//                 updated_by: userId
//             },
//             {
//                 where: { id: id }
//             }
//         );

//         if (num === 1) {
//             res.send({ message: "Report was updated successfully." });
//         } else {
//             res.send({ message: `Cannot update Report with id=${id}. Maybe Report was not found or req.body is empty!` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Error updating Report with id=" + req.params.id });
//     }
// };

// // Delete a report by ID
// exports.delete = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const num = await Report.destroy({
//             where: { id: id }
//         });

//         if (num === 1) {
//             res.send({ message: "Report was deleted successfully!" });
//         } else {
//             res.send({ message: `Cannot delete Report with id=${id}. Maybe Report was not found!` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Could not delete Report with id=" + req.params.id });
//     }
// };

// // Run SQL query from report on specified table
// exports.runQuery = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { report_name, table_name } = req.body;

//         if (!report_name || !table_name) {
//             return res.status(400).send({
//                 message: `Missing required fields: ${[!report_name && 'report_name', !table_name && 'table_name'].filter(Boolean).join(', ')}.`
//             });
//         }

//         const report = await Report.findOne({ where: { report_name } });
//         if (!report) {
//             return res.status(404).send({ message: `Report with name "${report_name}" not found.` });
//         }

//         if (report.user_id && !report.user_id.includes(userId)) {
//             return res.status(403).send({ message: "User does not have access to this report." });
//         }

//         // Validate table name
//         if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table_name)) {
//             return res.status(400).send({ message: "Invalid table name." });
//         }

//         // Check if the table exists
//         try {
//             const tableExists = await sequelize.query(
//                 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)',
//                 {
//                     replacements: { table_name: table_name.toLowerCase() },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             if (!tableExists[0].exists) {
//                 return res.status(404).send({ message: `Table "${table_name}" does not exist in the database.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking table existence: ${error.message}` });
//         }

//         // Prepare the final query
//         let finalQuery = report.sql_query.trim();
//         if (finalQuery.includes('{{table_name}}')) {
//             finalQuery = finalQuery.replace(/{{table_name}}/g, table_name);
//         } else {
//             // Replace the table name in the FROM clause
//             const fromMatch = finalQuery.match(/FROM\s+(\w+)/i);
//             if (fromMatch) {
//                 finalQuery = finalQuery.replace(new RegExp(fromMatch[1], 'i'), table_name);
//             } else {
//                 return res.status(400).send({ message: "SQL query must contain a FROM clause or {{table_name}} placeholder." });
//             }
//         }

//         // Debug log to verify the query
//         console.log('Executing query:', finalQuery);

//         // Execute the SQL query
//         try {
//             const queryResult = await sequelize.query(finalQuery, {
//                 type: sequelize.QueryTypes.SELECT,
//                 raw: true
//             });
//             console.log('Query result:', queryResult);
//             res.status(200).send({
//                 message: "Query executed successfully.",
//                 data: queryResult
//             });
//         } catch (queryError) {
//             return res.status(400).send({ message: `Invalid SQL query: ${queryError.message}` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while executing the query." });
//     }
// };











// const Report = require('../models/report.model');
// const jwt = require('jsonwebtoken');
// const sequelize = require('../config/database');

// // Create a new report
// exports.create = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { report_name, sql_query, graph_type } = req.body;
//         if (!report_name || !sql_query || !graph_type) {
//             return res.status(400).send({
//                 message: `Missing required fields: ${[!report_name && 'report_name', !sql_query && 'sql_query', !graph_type && 'graph_type'].filter(Boolean).join(', ')}.`
//             });
//         }

//         const report = await Report.create({
//             ...req.body,
//             created_by: userId
//         });
//         res.status(201).send(report);
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while creating the Report." });
//     }
// };

// // Retrieve all reports
// exports.findAll = async (req, res) => {
//     try {
//         const reports = await Report.findAll();
//         res.status(200).send(reports);
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while retrieving reports." });
//     }
// };

// // Find a single report by ID
// exports.findOne = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const report = await Report.findByPk(id);
//         if (report) {
//             res.status(200).send(report);
//         } else {
//             res.status(404).send({ message: `Cannot find Report with id=${id}.` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Error retrieving Report with id=" + req.params.id });
//     }
// };

// // Update a report by ID
// exports.update = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const id = req.params.id;
//         if (req.body.report_name === undefined || req.body.report_name === null) {
//             return res.status(400).send({ message: "Report name is required." });
//         }
//         if (req.body.sql_query === undefined || req.body.sql_query === null) {
//             return res.status(400).send({ message: "SQL query is required." });
//         }
//         if (req.body.graph_type === undefined || req.body.graph_type === null) {
//             return res.status(400).send({ message: "Graph type is required." });
//         }

//         const [num] = await Report.update(
//             {
//                 ...req.body,
//                 updated_by: userId
//             },
//             {
//                 where: { id: id }
//             }
//         );

//         if (num === 1) {
//             res.send({ message: "Report was updated successfully." });
//         } else {
//             res.send({ message: `Cannot update Report with id=${id}. Maybe Report was not found or req.body is empty!` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Error updating Report with id=" + req.params.id });
//     }
// };

// // Delete a report by ID
// exports.delete = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const num = await Report.destroy({
//             where: { id: id }
//         });

//         if (num === 1) {
//             res.send({ message: "Report was deleted successfully!" });
//         } else {
//             res.send({ message: `Cannot delete Report with id=${id}. Maybe Report was not found!` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Could not delete Report with id=" + req.params.id });
//     }
// };

// // Run SQL query from report for a specified module
// exports.runQuery = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { report_name, module_name } = req.body;

//         if (!report_name || !module_name) {
//             return res.status(400).send({
//                 message: `Missing required fields: ${[!report_name && 'report_name', !module_name && 'module_name'].filter(Boolean).join(', ')}.`
//             });
//         }

//         const report = await Report.findOne({ where: { report_name, module_name } });
//         if (!report) {
//             return res.status(404).send({ message: `Report with name "${report_name}" and module "${module_name}" not found.` });
//         }

//         if (report.user_id && !report.user_id.includes(userId)) {
//             return res.status(403).send({ message: "User does not have access to this report." });
//         }

//         // Extract table name from the SQL query's FROM clause
//         const fromMatch = report.sql_query.match(/FROM\s+(\w+)/i);
//         if (!fromMatch) {
//             return res.status(400).send({ message: "SQL query must contain a valid FROM clause." });
//         }
//         const table_name = fromMatch[1];

//         // Validate table name
//         if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table_name)) {
//             return res.status(400).send({ message: "Invalid table name in SQL query." });
//         }

//         // Check if the table exists
//         try {
//             const tableExists = await sequelize.query(
//                 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)',
//                 {
//                     replacements: { table_name: table_name.toLowerCase() },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             if (!tableExists[0].exists) {
//                 return res.status(404).send({ message: `Table "${table_name}" does not exist in the database.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking table existence: ${error.message}` });
//         }

//         // Use the SQL query as is, since the table name is embedded
//         const finalQuery = report.sql_query.trim();

//         // Debug log to verify the query
//         console.log('Executing query:', finalQuery);

//         // Execute the SQL query
//         try {
//             const queryResult = await sequelize.query(finalQuery, {
//                 type: sequelize.QueryTypes.SELECT,
//                 raw: true
//             });
//             console.log('Query result:', queryResult);
//             res.status(200).send({
//                 message: "Query executed successfully.",
//                 data: queryResult
//             });
//         } catch (queryError) {
//             return res.status(400).send({ message: `Invalid SQL query: ${queryError.message}` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while executing the query." });
//     }
// };












// const Report = require('../models/report.model');
// const jwt = require('jsonwebtoken');
// const sequelize = require('../config/database');

// // Create a new report
// exports.create = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { report_name, sql_query, graph_type } = req.body;
//         if (!report_name || !sql_query || !graph_type) {
//             return res.status(400).send({
//                 message: `Missing required fields: ${[!report_name && 'report_name', !sql_query && 'sql_query', !graph_type && 'graph_type'].filter(Boolean).join(', ')}.`
//             });
//         }

//         const report = await Report.create({
//             ...req.body,
//             created_by: userId
//         });
//         res.status(201).send(report);
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while creating the Report." });
//     }
// };

// // Retrieve all reports
// exports.findAll = async (req, res) => {
//     try {
//         const reports = await Report.findAll();
//         res.status(200).send(reports);
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while retrieving reports." });
//     }
// };

// // Find a single report by ID
// exports.findOne = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const report = await Report.findByPk(id);
//         if (report) {
//             res.status(200).send(report);
//         } else {
//             res.status(404).send({ message: `Cannot find Report with id=${id}.` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Error retrieving Report with id=" + req.params.id });
//     }
// };

// // Update a report by ID
// exports.update = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const id = req.params.id;
//         if (req.body.report_name === undefined || req.body.report_name === null) {
//             return res.status(400).send({ message: "Report name is required." });
//         }
//         if (req.body.sql_query === undefined || req.body.sql_query === null) {
//             return res.status(400).send({ message: "SQL query is required." });
//         }
//         if (req.body.graph_type === undefined || req.body.graph_type === null) {
//             return res.status(400).send({ message: "Graph type is required." });
//         }

//         const [num] = await Report.update(
//             {
//                 ...req.body,
//                 updated_by: userId
//             },
//             {
//                 where: { id: id }
//             }
//         );

//         if (num === 1) {
//             res.send({ message: "Report was updated successfully." });
//         } else {
//             res.send({ message: `Cannot update Report with id=${id}. Maybe Report was not found or req.body is empty!` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Error updating Report with id=" + req.params.id });
//     }
// };

// // Delete a report by ID
// exports.delete = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const num = await Report.destroy({
//             where: { id: id }
//         });

//         if (num === 1) {
//             res.send({ message: "Report was deleted successfully!" });
//         } else {
//             res.send({ message: `Cannot delete Report with id=${id}. Maybe Report was not found!` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Could not delete Report with id=" + req.params.id });
//     }
// };

// // Run SQL query from report for a specified module
// exports.runQuery = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { report_name, module_name } = req.body;

//         if (!report_name || !module_name) {
//             return res.status(400).send({
//                 message: `Missing required fields: ${[!report_name && 'report_name', !module_name && 'module_name'].filter(Boolean).join(', ')}.`
//             });
//         }

//         const report = await Report.findOne({ where: { report_name, module_name } });
//         if (!report) {
//             return res.status(404).send({ message: `Report with name "${report_name}" and module "${module_name}" not found.` });
//         }

//         if (report.user_id && !report.user_id.includes(userId)) {
//             return res.status(403).send({ message: "User does not have access to this report." });
//         }

//         // Extract table name from the SQL query's FROM clause
//         const fromMatch = report.sql_query.match(/FROM\s+(\w+)/i);
//         if (!fromMatch) {
//             return res.status(400).send({ message: "SQL query must contain a valid FROM clause." });
//         }
//         const table_name = fromMatch[1];

//         // Validate table name
//         if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table_name)) {
//             return res.status(400).send({ message: "Invalid table name in SQL query." });
//         }

//         // Check if the table exists
//         try {
//             const tableExists = await sequelize.query(
//                 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)',
//                 {
//                     replacements: { table_name: table_name.toLowerCase() },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             if (!tableExists[0].exists) {
//                 return res.status(404).send({ message: `Table "${table_name}" does not exist in the database.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking table existence: ${error.message}` });
//         }

//         // Use the SQL query as is, since the table name is embedded
//         const finalQuery = report.sql_query.trim();

//         // Debug log to verify the query
//         console.log('Executing query:', finalQuery);

//         // Execute the SQL query
//         try {
//             const queryResult = await sequelize.query(finalQuery, {
//                 type: sequelize.QueryTypes.SELECT,
//                 raw: true
//             });
//             console.log('Query result:', queryResult);
//             res.status(200).send({
//                 message: "Query executed successfully.",
//                 data: queryResult
//             });
//         } catch (queryError) {
//             return res.status(400).send({ message: `Invalid SQL query: ${queryError.message}` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while executing the query." });
//     }
// };

// // Retrieve specific columns from a table
// exports.getColumns = async (req, res) => {
//     try {
//         // Extract token from Authorization header
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         // Decode token to get user ID
//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { table_name, column_names } = req.body;

//         // Validate required fields
//         if (!table_name || !column_names || !Array.isArray(column_names) || column_names.length === 0) {
//             return res.status(400).send({
//                 message: `Missing or invalid required fields: ${[!table_name && 'table_name', (!column_names || !Array.isArray(column_names) || column_names.length === 0) && 'column_names'].filter(Boolean).join(', ')}.`
//             });
//         }

//         // Validate table name
//         if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table_name)) {
//             return res.status(400).send({ message: "Invalid table name." });
//         }

//         // Check if the table exists
//         try {
//             const tableExists = await sequelize.query(
//                 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)',
//                 {
//                     replacements: { table_name: table_name.toLowerCase() },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             if (!tableExists[0].exists) {
//                 return res.status(404).send({ message: `Table "${table_name}" does not exist in the database.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking table existence: ${error.message}` });
//         }

//         // Validate column names and check if they exist in the table
//         const invalidColumns = column_names.filter(col => !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(col));
//         if (invalidColumns.length > 0) {
//             return res.status(400).send({ message: `Invalid column names: ${invalidColumns.join(', ')}.` });
//         }

//         // Check if the columns exist in the table
//         try {
//             const columnsExist = await sequelize.query(
//                 'SELECT column_name FROM information_schema.columns WHERE table_name = :table_name AND column_name IN (:column_names)',
//                 {
//                     replacements: { table_name: table_name.toLowerCase(), column_names },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             const existingColumns = columnsExist.map(col => col.column_name);
//             const missingColumns = column_names.filter(col => !existingColumns.includes(col));
//             if (missingColumns.length > 0) {
//                 return res.status(404).send({ message: `Columns not found in table "${table_name}": ${missingColumns.join(', ')}.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking column existence: ${error.message}` });
//         }

//         // Check if the table has an 'id' column
//         try {
//             const idColumnExists = await sequelize.query(
//                 'SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = :table_name AND column_name = \'id\')',
//                 {
//                     replacements: { table_name: table_name.toLowerCase() },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             if (!idColumnExists[0].exists) {
//                 return res.status(400).send({ message: `Table "${table_name}" does not have an 'id' column.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking 'id' column existence: ${error.message}` });
//         }

//         // Construct the SQL query
//         const sanitizedColumns = column_names.map(col => `"${col}"`).join(', ');
//         const finalQuery = `SELECT id, ${sanitizedColumns} FROM ${table_name}`;

//         // Debug log to verify the query
//         console.log('Executing query:', finalQuery);

//         // Execute the SQL query
//         try {
//             const queryResult = await sequelize.query(finalQuery, {
//                 type: sequelize.QueryTypes.SELECT,
//                 raw: true
//             });
//             console.log('Query result:', queryResult);
//             res.status(200).send({
//                 message: "Columns retrieved successfully.",
//                 data: queryResult
//             });
//         } catch (queryError) {
//             return res.status(400).send({ message: `Invalid SQL query: ${queryError.message}` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while retrieving columns." });
//     }
// };



















// const Report = require('../models/report.model');
// const jwt = require('jsonwebtoken');
// const sequelize = require('../config/database');

// // Create a new report
// exports.create = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { report_name, sql_query, graph_type } = req.body;
//         if (!report_name || !sql_query || !graph_type) {
//             return res.status(400).send({
//                 message: `Missing required fields: ${[!report_name && 'report_name', !sql_query && 'sql_query', !graph_type && 'graph_type'].filter(Boolean).join(', ')}`
//             });
//         }

//         const report = await Report.create({
//             ...req.body,
//             created_by: userId
//         });
//         res.status(201).send(report);
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while creating the Report." });
//     }
// };

// // Retrieve all reports
// exports.findAll = async (req, res) => {
//     try {
//         const reports = await Report.findAll();
//         res.status(200).send(reports);
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while retrieving reports." });
//     }
// };

// // Find a single report by ID
// exports.findOne = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const report = await Report.findByPk(id);
//         if (report) {
//             res.status(200).send(report);
//         } else {
//             res.status(404).send({ message: `Cannot find Report with id=${id}.` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Error retrieving Report with id=" + req.params.id });
//     }
// };

// // Update a report by ID
// exports.update = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const id = req.params.id;
//         if (req.body.report_name === undefined || req.body.report_name === null) {
//             return res.status(400).send({ message: "Report name is required." });
//         }
//         if (req.body.sql_query === undefined || req.body.sql_query === null) {
//             return res.status(400).send({ message: "SQL query is required." });
//         }
//         if (req.body.graph_type === undefined || req.body.graph_type === null) {
//             return res.status(400).send({ message: "Graph type is required." });
//         }

//         const [num] = await Report.update(
//             {
//                 ...req.body,
//                 updated_by: userId
//             },
//             {
//                 where: { id: id }
//             }
//         );

//         if (num === 1) {
//             res.send({ message: "Report was updated successfully." });
//         } else {
//             res.send({ message: `Cannot update Report with id=${id}. Maybe Report was not found or req.body is empty!` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Error updating Report with id=" + req.params.id });
//     }
// };

// // Delete a report by ID
// exports.delete = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const num = await Report.destroy({
//             where: { id: id }
//         });

//         if (num === 1) {
//             res.send({ message: "Report was deleted successfully!" });
//         } else {
//             res.send({ message: `Cannot delete Report with id=${id}. Maybe Report was not found!` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Could not delete Report with id=" + req.params.id });
//     }
// };

// // Run SQL query from report for a specified module
// exports.runQuery = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { report_name, module_name } = req.body;

//         if (!report_name || !module_name) {
//             return res.status(400).send({
//                 message: `Missing required fields: ${[!report_name && 'report_name', !module_name && 'module_name'].filter(Boolean).join(', ')}`
//             });
//         }

//         const report = await Report.findOne({ where: { report_name, module_name } });
//         if (!report) {
//             return res.status(404).send({ message: `Report with name "${report_name}" and module "${module_name}" not found.` });
//         }

//         if (report.user_id && !report.user_id.includes(userId)) {
//             return res.status(403).send({ message: "User does not have access to this report." });
//         }

//         // Extract table name from the SQL query's FROM clause
//         const fromMatch = report.sql_query.match(/FROM\s+(\w+)/i);
//         if (!fromMatch) {
//             return res.status(400).send({ message: "SQL query must contain a valid FROM clause." });
//         }
//         const table_name = fromMatch[1];

//         // Validate table name
//         if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table_name)) {
//             return res.status(400).send({ message: "Invalid table name in SQL query." });
//         }

//         // Check if the table exists
//         try {
//             const tableExists = await sequelize.query(
//                 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)',
//                 {
//                     replacements: { table_name: table_name.toLowerCase() },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             if (!tableExists[0].exists) {
//                 return res.status(404).send({ message: `Table "${table_name}" does not exist in the database.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking table existence: ${error.message}` });
//         }

//         // Use the SQL query as is, since the table name is embedded
//         const finalQuery = report.sql_query.trim();

//         // Debug log to verify the query
//         console.log('Executing query:', finalQuery);

//         // Execute the SQL query
//         try {
//             const queryResult = await sequelize.query(finalQuery, {
//                 type: sequelize.QueryTypes.SELECT,
//                 raw: true
//             });
//             console.log('Query result:', queryResult);
//             res.status(200).send({
//                 message: "Query executed successfully.",
//                 data: queryResult
//             });
//         } catch (queryError) {
//             return res.status(400).send({ message: `Invalid SQL query: ${queryError.message}` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while executing the query." });
//     }
// };

// // Retrieve specific columns from a table, excluding null values
// exports.getColumns = async (req, res) => {
//     try {
//         // Extract token from Authorization header
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         // Decode token to get user ID
//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { table_name, column_names } = req.body;

//         // Validate required fields
//         if (!table_name || !column_names || !Array.isArray(column_names) || column_names.length === 0) {
//             return res.status(400).send({
//                 message: `Missing or invalid required fields: ${[!table_name && 'table_name', (!column_names || !Array.isArray(column_names) || column_names.length === 0) && 'column_names'].filter(Boolean).join(', ')}`
//             });
//         }

//         // Validate table name
//         if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table_name)) {
//             return res.status(400).send({ message: "Invalid table name." });
//         }

//         // Check if the table exists
//         try {
//             const tableExists = await sequelize.query(
//                 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)',
//                 {
//                     replacements: { table_name: table_name.toLowerCase() },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             if (!tableExists[0].exists) {
//                 return res.status(404).send({ message: `Table "${table_name}" does not exist in the database.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking table existence: ${error.message}` });
//         }

//         // Validate column names and check if they exist in the table
//         const invalidColumns = column_names.filter(col => !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(col));
//         if (invalidColumns.length > 0) {
//             return res.status(400).send({ message: `Invalid column names: ${invalidColumns.join(', ')}.` });
//         }

//         // Check if the columns exist in the table
//         try {
//             const columnsExist = await sequelize.query(
//                 'SELECT column_name FROM information_schema.columns WHERE table_name = :table_name AND column_name IN (:column_names)',
//                 {
//                     replacements: { table_name: table_name.toLowerCase(), column_names },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             const existingColumns = columnsExist.map(col => col.column_name);
//             const missingColumns = column_names.filter(col => !existingColumns.includes(col));
//             if (missingColumns.length > 0) {
//                 return res.status(404).send({ message: `Columns not found in table "${table_name}": ${missingColumns.join(', ')}.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking column existence: ${error.message}` });
//         }

//         // Check if the table has an 'id' column
//         try {
//             const idColumnExists = await sequelize.query(
//                 'SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = :table_name AND column_name = \'id\')',
//                 {
//                     replacements: { table_name: table_name.toLowerCase() },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             if (!idColumnExists[0].exists) {
//                 return res.status(400).send({ message: `Table "${table_name}" does not have an 'id' column.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking 'id' column existence: ${error.message}` });
//         }

//         // Construct the SQL query with WHERE clause to exclude null values
//         const sanitizedColumns = column_names.map(col => `"${col}"`).join(', ');
//         const whereClause = column_names.map(col => `"${col}" IS NOT NULL`).join(' AND ');
//         const finalQuery = `SELECT id, ${sanitizedColumns} FROM ${table_name} WHERE ${whereClause}`;

//         // Debug log to verify the query
//         console.log('Executing query:', finalQuery);

//         // Execute the SQL query
//         try {
//             const queryResult = await sequelize.query(finalQuery, {
//                 type: sequelize.QueryTypes.SELECT,
//                 raw: true
//             });
//             console.log('Query result:', queryResult);
//             res.status(200).send({
//                 message: "Columns retrieved successfully.",
//                 data: queryResult
//             });
//         } catch (queryError) {
//             return res.status(400).send({ message: `Invalid SQL query: ${queryError.message}` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while retrieving columns." });
//     }
// };


















// const Report = require('../models/report.model');
// const jwt = require('jsonwebtoken');
// const sequelize = require('../config/database');

// // Create a new report
// exports.create = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { report_name, sql_query } = req.body;
//         if (!report_name || !sql_query ) {
//             return res.status(400).send({
//                 message: `Missing required fields: ${[!report_name && 'report_name', !sql_query && 'sql_query'].filter(Boolean).join(', ')}`
//             });
//         }

//         const report = await Report.create({
//             ...req.body,
//             created_by: userId
//         });
//         res.status(201).send(report);
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while creating the Report." });
//     }
// };

// // Retrieve all reports
// exports.findAll = async (req, res) => {
//     try {
//         const reports = await Report.findAll();
//         res.status(200).send(reports);
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while retrieving reports." });
//     }
// };

// // Find a single report by ID
// exports.findOne = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const report = await Report.findByPk(id);
//         if (report) {
//             res.status(200).send(report);
//         } else {
//             res.status(404).send({ message: `Cannot find Report with id=${id}.` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Error retrieving Report with id=" + req.params.id });
//     }
// };

// // Update a report by ID
// exports.update = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const id = req.params.id;
//         if (req.body.report_name === undefined || req.body.report_name === null) {
//             return res.status(400).send({ message: "Report name is required." });
//         }
//         if (req.body.sql_query === undefined || req.body.sql_query === null) {
//             return res.status(400).send({ message: "SQL query is required." });
//         }
//         if (req.body.graph_type === undefined || req.body.graph_type === null) {
//             return res.status(400).send({ message: "Graph type is required." });
//         }

//         const [num] = await Report.update(
//             {
//                 ...req.body,
//                 updated_by: userId
//             },
//             {
//                 where: { id: id }
//             }
//         );

//         if (num === 1) {
//             res.send({ message: "Report was updated successfully." });
//         } else {
//             res.send({ message: `Cannot update Report with id=${id}. Maybe Report was not found or req.body is empty!` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Error updating Report with id=" + req.params.id });
//     }
// };

// // Delete a report by ID
// exports.delete = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const num = await Report.destroy({
//             where: { id: id }
//         });

//         if (num === 1) {
//             res.send({ message: "Report was deleted successfully!" });
//         } else {
//             res.send({ message: `Cannot delete Report with id=${id}. Maybe Report was not found!` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Could not delete Report with id=" + req.params.id });
//     }
// };

// // Run SQL query from report for a specified module
// exports.runQuery = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { report_name, module_name } = req.body;

//         if (!report_name || !module_name) {
//             return res.status(400).send({
//                 message: `Missing required fields: ${[!report_name && 'report_name', !module_name && 'module_name'].filter(Boolean).join(', ')}`
//             });
//         }

//         const report = await Report.findOne({ where: { report_name, module_name } });
//         if (!report) {
//             return res.status(404).send({ message: `Report with name "${report_name}" and module "${module_name}" not found.` });
//         }

//         if (report.user_id && !report.user_id.includes(userId)) {
//             return res.status(403).send({ message: "User does not have access to this report." });
//         }

//         // Extract table name from the SQL query's FROM clause
//         const fromMatch = report.sql_query.match(/FROM\s+(\w+)/i);
//         if (!fromMatch) {
//             return res.status(400).send({ message: "SQL query must contain a valid FROM clause." });
//         }
//         const table_name = fromMatch[1];

//         // Validate table name
//         if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table_name)) {
//             return res.status(400).send({ message: "Invalid table name in SQL query." });
//         }

//         // Check if the table exists
//         try {
//             const tableExists = await sequelize.query(
//                 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)',
//                 {
//                     replacements: { table_name: table_name.toLowerCase() },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             if (!tableExists[0].exists) {
//                 return res.status(404).send({ message: `Table "${table_name}" does not exist in the database.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking table existence: ${error.message}` });
//         }

//         // Extract selected columns from the SQL query (e.g., SELECT name, id FROM tasks)
//         const selectMatch = report.sql_query.match(/SELECT\s+(.+?)\s+FROM/i);
//         let column_names = [];
//         if (selectMatch && selectMatch[1].trim() !== '*') {
//             // Split the SELECT clause by commas and trim each column name
//             column_names = selectMatch[1].split(',').map(col => col.trim().replace(/"/g, ''));
//         } else {
//             // If SELECT * is used, fetch all columns from the table
//             try {
//                 const columns = await sequelize.query(
//                     'SELECT column_name FROM information_schema.columns WHERE table_name = :table_name',
//                     {
//                         replacements: { table_name: table_name.toLowerCase() },
//                         type: sequelize.QueryTypes.SELECT
//                     }
//                 );
//                 column_names = columns.map(col => col.column_name);
//             } catch (error) {
//                 return res.status(500).send({ message: `Error fetching column names: ${error.message}` });
//             }
//         }

//         // Validate column names
//         const invalidColumns = column_names.filter(col => !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(col));
//         if (invalidColumns.length > 0) {
//             return res.status(400).send({ message: `Invalid column names: ${invalidColumns.join(', ')}.` });
//         }

//         // Use the SQL query as is, since the table name is embedded
//         const finalQuery = report.sql_query.trim();

//         // Debug log to verify the query
//         console.log('Executing query:', finalQuery);

//         // Execute the SQL query
//         try {
//             const queryResult = await sequelize.query(finalQuery, {
//                 type: sequelize.QueryTypes.SELECT,
//                 raw: true
//             });
//             console.log('Query result:', queryResult);
//             res.status(200).send({
//                 message: "Query executed successfully.",
//                 columns: column_names,
//                 data: queryResult
//             });
//         } catch (queryError) {
//             return res.status(400).send({ message: `Invalid SQL query: ${queryError.message}` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while executing the query." });
//     }
// };

// // Retrieve specific columns from a table, excluding null values
// exports.getColumns = async (req, res) => {
//     try {
//         // Extract token from Authorization header
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         // Decode token to get user ID
//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { table_name, column_names } = req.body;

//         // Validate required fields
//         if (!table_name || !column_names || !Array.isArray(column_names) || column_names.length === 0) {
//             return res.status(400).send({
//                 message: `Missing or invalid required fields: ${[!table_name && 'table_name', (!column_names || !Array.isArray(column_names) || column_names.length === 0) && 'column_names'].filter(Boolean).join(', ')}`
//             });
//         }

//         // Validate table name
//         if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table_name)) {
//             return res.status(400).send({ message: "Invalid table name." });
//         }

//         // Check if the table exists
//         try {
//             const tableExists = await sequelize.query(
//                 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)',
//                 {
//                     replacements: { table_name: table_name.toLowerCase() },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             if (!tableExists[0].exists) {
//                 return res.status(404).send({ message: `Table "${table_name}" does not exist in the database.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking table existence: ${error.message}` });
//         }

//         // Validate column names and check if they exist in the table
//         const invalidColumns = column_names.filter(col => !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(col));
//         if (invalidColumns.length > 0) {
//             return res.status(400).send({ message: `Invalid column names: ${invalidColumns.join(', ')}.` });
//         }

//         // Check if the columns exist in the table
//         try {
//             const columnsExist = await sequelize.query(
//                 'SELECT column_name FROM information_schema.columns WHERE table_name = :table_name AND column_name IN (:column_names)',
//                 {
//                     replacements: { table_name: table_name.toLowerCase(), column_names },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             const existingColumns = columnsExist.map(col => col.column_name);
//             const missingColumns = column_names.filter(col => !existingColumns.includes(col));
//             if (missingColumns.length > 0) {
//                 return res.status(404).send({ message: `Columns not found in table "${table_name}": ${missingColumns.join(', ')}.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking column existence: ${error.message}` });
//         }

//         // Check if the table has an 'id' column
//         try {
//             const idColumnExists = await sequelize.query(
//                 'SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = :table_name AND column_name = \'id\')',
//                 {
//                     replacements: { table_name: table_name.toLowerCase() },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             if (!idColumnExists[0].exists) {
//                 return res.status(400).send({ message: `Table "${table_name}" does not have an 'id' column.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking 'id' column existence: ${error.message}` });
//         }

//         // Construct the SQL query with WHERE clause to exclude null values
//         const sanitizedColumns = column_names.map(col => `"${col}"`).join(', ');
//         const whereClause = column_names.map(col => `"${col}" IS NOT NULL`).join(' AND ');
//         const finalQuery = `SELECT id, ${sanitizedColumns} FROM ${table_name} WHERE ${whereClause}`;

//         // Debug log to verify the query
//         console.log('Executing query:', finalQuery);

//         // Execute the SQL query
//         try {
//             const queryResult = await sequelize.query(finalQuery, {
//                 type: sequelize.QueryTypes.SELECT,
//                 raw: true
//             });
//             console.log('Query result:', queryResult);
//             res.status(200).send({
//                 message: "Columns retrieved successfully.",
//                 data: queryResult
//             });
//         } catch (queryError) {
//             return res.status(400).send({ message: `Invalid SQL query: ${queryError.message}` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while retrieving columns." });
//     }
// };























// const Report = require('../models/report.model');
// const jwt = require('jsonwebtoken');
// const sequelize = require('../config/database');

// // Create a new report
// exports.create = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { report_name, sql_query } = req.body;
//         if (!report_name || !sql_query ) {
//             return res.status(400).send({
//                 message: `Missing required fields: ${[!report_name && 'report_name', !sql_query && 'sql_query'].filter(Boolean).join(', ')}`
//             });
//         }

//         const report = await Report.create({
//             ...req.body,
//             created_by: userId
//         });
//         res.status(201).send(report);
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while creating the Report." });
//     }
// };

// // Retrieve all reports
// exports.findAll = async (req, res) => {
//     try {
//         const reports = await Report.findAll();
//         res.status(200).send(reports);
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while retrieving reports." });
//     }
// };

// // Find a single report by ID
// exports.findOne = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const report = await Report.findByPk(id);
//         if (report) {
//             res.status(200).send(report);
//         } else {
//             res.status(404).send({ message: `Cannot find Report with id=${id}.` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Error retrieving Report with id=" + req.params.id });
//     }
// };

// // Update a report by ID
// exports.update = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const id = req.params.id;
//         if (req.body.report_name === undefined || req.body.report_name === null) {
//             return res.status(400).send({ message: "Report name is required." });
//         }
//         if (req.body.sql_query === undefined || req.body.sql_query === null) {
//             return res.status(400).send({ message: "SQL query is required." });
//         }
//         if (req.body.graph_type === undefined || req.body.graph_type === null) {
//             return res.status(400).send({ message: "Graph type is required." });
//         }

//         const [num] = await Report.update(
//             {
//                 ...req.body,
//                 updated_by: userId
//             },
//             {
//                 where: { id: id }
//             }
//         );

//         if (num === 1) {
//             res.send({ message: "Report was updated successfully." });
//         } else {
//             res.send({ message: `Cannot update Report with id=${id}. Maybe Report was not found or req.body is empty!` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Error updating Report with id=" + req.params.id });
//     }
// };

// // Delete a report by ID
// exports.delete = async (req, res) => {
//     try {
//         const id = req.params.id;
//         const num = await Report.destroy({
//             where: { id: id }
//         });

//         if (num === 1) {
//             res.send({ message: "Report was deleted successfully!" });
//         } else {
//             res.send({ message: `Cannot delete Report with id=${id}. Maybe Report was not found!` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: "Could not delete Report with id=" + req.params.id });
//     }
// };

// // Run SQL query from report for a specified module
// exports.runQuery = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { report_name, module_name } = req.body;

//         if (!report_name || !module_name) {
//             return res.status(400).send({
//                 message: `Missing required fields: ${[!report_name && 'report_name', !module_name && 'module_name'].filter(Boolean).join(', ')}`
//             });
//         }

//         const report = await Report.findOne({ where: { report_name, module_name } });
//         if (!report) {
//             return res.status(404).send({ message: `Report with name "${report_name}" and module "${module_name}" not found.` });
//         }

//         if (report.user_id && !report.user_id.includes(userId)) {
//             return res.status(403).send({ message: "User does not have access to this report." });
//         }

//         // Extract table name from the SQL query's FROM clause
//         const fromMatch = report.sql_query.match(/FROM\s+(\w+)/i);
//         if (!fromMatch) {
//             return res.status(400).send({ message: "SQL query must contain a valid FROM clause." });
//         }
//         const table_name = fromMatch[1];

//         // Validate table name
//         if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table_name)) {
//             return res.status(400).send({ message: "Invalid table name in SQL query." });
//         }

//         // Check if the table exists
//         try {
//             const tableExists = await sequelize.query(
//                 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)',
//                 {
//                     replacements: { table_name: table_name.toLowerCase() },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             if (!tableExists[0].exists) {
//                 return res.status(404).send({ message: `Table "${table_name}" does not exist in the database.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking table existence: ${error.message}` });
//         }

//         // Use the SQL query as is, since the table name is embedded
//         const finalQuery = report.sql_query.trim();

//         // Debug log to verify the query
//         console.log('Executing query:', finalQuery);

//         // Execute the SQL query
//         try {
//             const results = await sequelize.query(finalQuery, {
//                 type: sequelize.QueryTypes.SELECT,
//                 raw: true
//             });
//             console.log('Query result:', results);

//             // Extract column names from the first result row if available
//             const column_names = results.length > 0 ? Object.keys(results[0]) : [];

//             res.status(200).send({
//                 message: "Query executed successfully.",
//                 columns: column_names,
//                 data: results
//             });
//         } catch (queryError) {
//             return res.status(400).send({ message: `Invalid SQL query: ${queryError.message}` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while executing the query." });
//     }
// };

// // Retrieve specific columns from a table, excluding null values
// exports.getColumns = async (req, res) => {
//     try {
//         // Extract token from Authorization header
//         let token = req.headers['authorization'];
//         if (!token) {
//             return res.status(403).send({ message: "No token provided!" });
//         }
//         if (token.startsWith('Bearer ')) {
//             token = token.slice(7, token.length);
//         }

//         // Decode token to get user ID
//         let userId;
//         try {
//             const token_parts = JSON.parse(atob(token.split('.')[1]));
//             userId = token_parts.claims.user_ID;
//             if (!userId) {
//                 return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
//             }
//         } catch (err) {
//             return res.status(401).send({ message: "Unauthorized! Invalid Token." });
//         }

//         const { table_name, column_names } = req.body;

//         // Validate required fields
//         if (!table_name || !column_names || !Array.isArray(column_names) || column_names.length === 0) {
//             return res.status(400).send({
//                 message: `Missing or invalid required fields: ${[!table_name && 'table_name', (!column_names || !Array.isArray(column_names) || column_names.length === 0) && 'column_names'].filter(Boolean).join(', ')}`
//             });
//         }

//         // Validate table name
//         if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table_name)) {
//             return res.status(400).send({ message: "Invalid table name." });
//         }

//         // Check if the table exists
//         try {
//             const tableExists = await sequelize.query(
//                 'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)',
//                 {
//                     replacements: { table_name: table_name.toLowerCase() },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             if (!tableExists[0].exists) {
//                 return res.status(404).send({ message: `Table "${table_name}" does not exist in the database.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking table existence: ${error.message}` });
//         }

//         // Validate column names and check if they exist in the table
//         const invalidColumns = column_names.filter(col => !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(col));
//         if (invalidColumns.length > 0) {
//             return res.status(400).send({ message: `Invalid column names: ${invalidColumns.join(', ')}.` });
//         }

//         // Check if the columns exist in the table
//         try {
//             const columnsExist = await sequelize.query(
//                 'SELECT column_name FROM information_schema.columns WHERE table_name = :table_name AND column_name IN (:column_names)',
//                 {
//                     replacements: { table_name: table_name.toLowerCase(), column_names },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             const existingColumns = columnsExist.map(col => col.column_name);
//             const missingColumns = column_names.filter(col => !existingColumns.includes(col));
//             if (missingColumns.length > 0) {
//                 return res.status(404).send({ message: `Columns not found in table "${table_name}": ${missingColumns.join(', ')}.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking column existence: ${error.message}` });
//         }

//         // Check if the table has an 'id' column
//         try {
//             const idColumnExists = await sequelize.query(
//                 'SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = :table_name AND column_name = \'id\')',
//                 {
//                     replacements: { table_name: table_name.toLowerCase() },
//                     type: sequelize.QueryTypes.SELECT
//                 }
//             );
//             if (!idColumnExists[0].exists) {
//                 return res.status(400).send({ message: `Table "${table_name}" does not have an 'id' column.` });
//             }
//         } catch (error) {
//             return res.status(500).send({ message: `Error checking 'id' column existence: ${error.message}` });
//         }

//         // Construct the SQL query with WHERE clause to exclude null values
//         const sanitizedColumns = column_names.map(col => `"${col}"`).join(', ');
//         const whereClause = column_names.map(col => `"${col}" IS NOT NULL`).join(' AND ');
//         const finalQuery = `SELECT id, ${sanitizedColumns} FROM ${table_name} WHERE ${whereClause}`;

//         // Debug log to verify the query
//         console.log('Executing query:', finalQuery);

//         // Execute the SQL query
//         try {
//             const queryResult = await sequelize.query(finalQuery, {
//                 type: sequelize.QueryTypes.SELECT,
//                 raw: true
//             });
//             console.log('Query result:', queryResult);
//             res.status(200).send({
//                 message: "Columns retrieved successfully.",
//                 data: queryResult
//             });
//         } catch (queryError) {
//             return res.status(400).send({ message: `Invalid SQL query: ${queryError.message}` });
//         }
//     } catch (error) {
//         res.status(500).send({ message: error.message || "Some error occurred while retrieving columns." });
//     }
// };















const Report = require('../models/report.model');
const jwt = require('jsonwebtoken');
const sequelize = require('../config/database');
const PDFDocument = require('pdfkit');

// Create a new report
exports.create = async (req, res) => {
    try {
        let token = req.headers['authorization'];
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        let userId;
        try {
            const token_parts = JSON.parse(atob(token.split('.')[1]));
            userId = token_parts.claims.user_ID;
            if (!userId) {
                return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
            }
        } catch (err) {
            return res.status(401).send({ message: "Unauthorized! Invalid Token." });
        }

        const { report_name, sql_query } = req.body;
        if (!report_name || !sql_query ) {
            return res.status(400).send({
                message: `Missing required fields: ${[!report_name && 'report_name', !sql_query && 'sql_query'].filter(Boolean).join(', ')}`
            });
        }

        const report = await Report.create({
            ...req.body,
            created_by: userId
        });
        res.status(201).send(report);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while creating the Report." });
    }
};

// Retrieve all reports
exports.findAll = async (req, res) => {
    try {
        const reports = await Report.findAll();
        res.status(200).send(reports);
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving reports." });
    }
};

// Find a single report by ID
exports.findOne = async (req, res) => {
    try {
        const id = req.params.id;
        const report = await Report.findByPk(id);
        if (report) {
            res.status(200).send(report);
        } else {
            res.status(404).send({ message: `Cannot find Report with id=${id}.` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error retrieving Report with id=" + req.params.id });
    }
};

// Update a report by ID
exports.update = async (req, res) => {
    try {
        let token = req.headers['authorization'];
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        let userId;
        try {
            const token_parts = JSON.parse(atob(token.split('.')[1]));
            userId = token_parts.claims.user_ID;
            if (!userId) {
                return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
            }
        } catch (err) {
            return res.status(401).send({ message: "Unauthorized! Invalid Token." });
        }

        const id = req.params.id;
        if (req.body.report_name === undefined || req.body.report_name === null) {
            return res.status(400).send({ message: "Report name is required." });
        }
        if (req.body.sql_query === undefined || req.body.sql_query === null) {
            return res.status(400).send({ message: "SQL query is required." });
        }
        if (req.body.graph_type === undefined || req.body.graph_type === null) {
            return res.status(400).send({ message: "Graph type is required." });
        }

        const [num] = await Report.update(
            {
                ...req.body,
                updated_by: userId
            },
            {
                where: { id: id }
            }
        );

        if (num === 1) {
            res.send({ message: "Report was updated successfully." });
        } else {
            res.send({ message: `Cannot update Report with id=${id}. Maybe Report was not found or req.body is empty!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Error updating Report with id=" + req.params.id });
    }
};

// Delete a report by ID
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const num = await Report.destroy({
            where: { id: id }
        });

        if (num === 1) {
            res.send({ message: "Report was deleted successfully!" });
        } else {
            res.send({ message: `Cannot delete Report with id=${id}. Maybe Report was not found!` });
        }
    } catch (error) {
        res.status(500).send({ message: "Could not delete Report with id=" + req.params.id });
    }
};

// Run SQL query from report for a specified module
exports.runQuery = async (req, res) => {
    try {
        let token = req.headers['authorization'];
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        let userId;
        try {
            const token_parts = JSON.parse(atob(token.split('.')[1]));
            userId = token_parts.claims.user_ID;
            if (!userId) {
                return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
            }
        } catch (err) {
            return res.status(401).send({ message: "Unauthorized! Invalid Token." });
        }

        const { report_name, module_name } = req.body;

        if (!report_name || !module_name) {
            return res.status(400).send({
                message: `Missing required fields: ${[!report_name && 'report_name', !module_name && 'module_name'].filter(Boolean).join(', ')}`
            });
        }

        const report = await Report.findOne({ where: { report_name, module_name } });
        if (!report) {
            return res.status(404).send({ message: `Report with name "${report_name}" and module "${module_name}" not found.` });
        }

        if (report.user_id && !report.user_id.includes(userId)) {
            return res.status(403).send({ message: "User does not have access to this report." });
        }

        // Extract table name from the SQL query's FROM clause
        const fromMatch = report.sql_query.match(/FROM\s+(\w+)/i);
        if (!fromMatch) {
            return res.status(400).send({ message: "SQL query must contain a valid FROM clause." });
        }
        const table_name = fromMatch[1];

        // Validate table name
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table_name)) {
            return res.status(400).send({ message: "Invalid table name in SQL query." });
        }

        // Check if the table exists
        try {
            const tableExists = await sequelize.query(
                'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)',
                {
                    replacements: { table_name: table_name.toLowerCase() },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            if (!tableExists[0].exists) {
                return res.status(404).send({ message: `Table "${table_name}" does not exist in the database.` });
            }
        } catch (error) {
            return res.status(500).send({ message: `Error checking table existence: ${error.message}` });
        }

        // Use the SQL query as is, since the table name is embedded
        const finalQuery = report.sql_query.trim();

        // Debug log to verify the query
        console.log('Executing query:', finalQuery);

        // Execute the SQL query
        try {
            const results = await sequelize.query(finalQuery, {
                type: sequelize.QueryTypes.SELECT,
                raw: true
            });
            console.log('Query result:', results);

            // Extract column names from the first result row if available
            const column_names = results.length > 0 ? Object.keys(results[0]) : [];

            res.status(200).send({
                message: "Query executed successfully.",
                columns: column_names,
                data: results
            });
        } catch (queryError) {
            return res.status(400).send({ message: `Invalid SQL query: ${queryError.message}` });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while executing the query." });
    }
};

// Retrieve specific columns from a table, excluding null values
exports.getColumns = async (req, res) => {
    try {
        // Extract token from Authorization header
        let token = req.headers['authorization'];
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        // Decode token to get user ID
        let userId;
        try {
            const token_parts = JSON.parse(atob(token.split('.')[1]));
            userId = token_parts.claims.user_ID;
            if (!userId) {
                return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
            }
        } catch (err) {
            return res.status(401).send({ message: "Unauthorized! Invalid Token." });
        }

        const { table_name, column_names } = req.body;

        // Validate required fields
        if (!table_name || !column_names || !Array.isArray(column_names) || column_names.length === 0) {
            return res.status(400).send({
                message: `Missing or invalid required fields: ${[!table_name && 'table_name', (!column_names || !Array.isArray(column_names) || column_names.length === 0) && 'column_names'].filter(Boolean).join(', ')}`
            });
        }

        // Validate table name
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table_name)) {
            return res.status(400).send({ message: "Invalid table name." });
        }

        // Check if the table exists
        try {
            const tableExists = await sequelize.query(
                'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)',
                {
                    replacements: { table_name: table_name.toLowerCase() },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            if (!tableExists[0].exists) {
                return res.status(404).send({ message: `Table "${table_name}" does not exist in the database.` });
            }
        } catch (error) {
            return res.status(500).send({ message: `Error checking table existence: ${error.message}` });
        }

        // Validate column names and check if they exist in the table
        const invalidColumns = column_names.filter(col => !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(col));
        if (invalidColumns.length > 0) {
            return res.status(400).send({ message: `Invalid column names: ${invalidColumns.join(', ')}.` });
        }

        // Check if the columns exist in the table
        try {
            const columnsExist = await sequelize.query(
                'SELECT column_name FROM information_schema.columns WHERE table_name = :table_name AND column_name IN (:column_names)',
                {
                    replacements: { table_name: table_name.toLowerCase(), column_names },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            const existingColumns = columnsExist.map(col => col.column_name);
            const missingColumns = column_names.filter(col => !existingColumns.includes(col));
            if (missingColumns.length > 0) {
                return res.status(404).send({ message: `Columns not found in table "${table_name}": ${missingColumns.join(', ')}.` });
            }
        } catch (error) {
            return res.status(500).send({ message: `Error checking column existence: ${error.message}` });
        }

        // Check if the table has an 'id' column
        try {
            const idColumnExists = await sequelize.query(
                'SELECT EXISTS (SELECT FROM information_schema.columns WHERE table_name = :table_name AND column_name = \'id\')',
                {
                    replacements: { table_name: table_name.toLowerCase() },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            if (!idColumnExists[0].exists) {
                return res.status(400).send({ message: `Table "${table_name}" does not have an 'id' column.` });
            }
        } catch (error) {
            return res.status(500).send({ message: `Error checking 'id' column existence: ${error.message}` });
        }

        // Construct the SQL query with WHERE clause to exclude null values
        const sanitizedColumns = column_names.map(col => `"${col}"`).join(', ');
        const whereClause = column_names.map(col => `"${col}" IS NOT NULL`).join(' AND ');
        const finalQuery = `SELECT id, ${sanitizedColumns} FROM ${table_name} WHERE ${whereClause}`;

        // Debug log to verify the query
        console.log('Executing query:', finalQuery);

        // Execute the SQL query
        try {
            const queryResult = await sequelize.query(finalQuery, {
                type: sequelize.QueryTypes.SELECT,
                raw: true
            });
            console.log('Query result:', queryResult);
            res.status(200).send({
                message: "Columns retrieved successfully.",
                data: queryResult
            });
        } catch (queryError) {
            return res.status(400).send({ message: `Invalid SQL query: ${queryError.message}` });
        }
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while retrieving columns." });
    }
};

// Generate PDF from report query results
exports.generatePDF = async (req, res) => {
    try {
        // Extract token from Authorization header
        let token = req.headers['authorization'];
        if (!token) {
            return res.status(403).send({ message: "No token provided!" });
        }
        if (token.startsWith('Bearer ')) {
            token = token.slice(7, token.length);
        }

        // Decode token to get user ID
        let userId;
        try {
            const token_parts = JSON.parse(atob(token.split('.')[1]));
            userId = token_parts.claims.user_ID;
            if (!userId) {
                return res.status(401).send({ message: "Unauthorized! Token is missing user ID." });
            }
        } catch (err) {
            return res.status(401).send({ message: "Unauthorized! Invalid Token." });
        }

        const { report_name, module_name } = req.body;

        // Validate required fields
        if (!report_name || !module_name) {
            return res.status(400).send({
                message: `Missing required fields: ${[!report_name && 'report_name', !module_name && 'module_name'].filter(Boolean).join(', ')}`
            });
        }

        // Find the report
        const report = await Report.findOne({ where: { report_name, module_name } });
        if (!report) {
            return res.status(404).send({ message: `Report with name "${report_name}" and module "${module_name}" not found.` });
        }

        // Check user access
        if (report.user_id && !report.user_id.includes(userId)) {
            return res.status(403).send({ message: "User does not have access to this report." });
        }

        // Check if user has print permission
        if (report.print && !report.print.includes(userId)) {
            return res.status(403).send({ message: "User does not have permission to generate PDF for this report." });
        }

        // Extract table name from the SQL query's FROM clause
        const fromMatch = report.sql_query.match(/FROM\s+(\w+)/i);
        if (!fromMatch) {
            return res.status(400).send({ message: "SQL query must contain a valid FROM clause." });
        }
        const table_name = fromMatch[1];

        // Validate table name
        if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table_name)) {
            return res.status(400).send({ message: "Invalid table name in SQL query." });
        }

        // Check if the table exists
        try {
            const tableExists = await sequelize.query(
                'SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = :table_name)',
                {
                    replacements: { table_name: table_name.toLowerCase() },
                    type: sequelize.QueryTypes.SELECT
                }
            );
            if (!tableExists[0].exists) {
                return res.status(404).send({ message: `Table "${table_name}" does not exist in the database.` });
            }
        } catch (error) {
            return res.status(500).send({ message: `Error checking table existence: ${error.message}` });
        }

        // Use the SQL query as is
        const finalQuery = report.sql_query.trim();

        // Debug log to verify the query
        console.log('Executing query for PDF:', finalQuery);

        // Execute the SQL query
        let results;
        try {
            results = await sequelize.query(finalQuery, {
                type: sequelize.QueryTypes.SELECT,
                raw: true
            });
            console.log('Query result for PDF:', results);
        } catch (queryError) {
            return res.status(400).send({ message: `Invalid SQL query: ${queryError.message}` });
        }

        // Extract column names from the first result row if available
        const column_names = results.length > 0 ? Object.keys(results[0]) : [];

        // Create PDF document
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=${report_name}_report.pdf`);
        doc.pipe(res);

        // Add title
        doc.fontSize(20).text(`${report_name} Report`, { align: 'center' });
        doc.moveDown();

        // Add module name and date
        doc.fontSize(12).text(`Module: ${module_name}`, { align: 'left' });
        doc.text(`Generated on: ${new Date().toLocaleString()}`, { align: 'left' });
        doc.moveDown();

        if (results.length === 0) {
            doc.fontSize(12).text('No data available for this report.', { align: 'center' });
        } else {
            // Calculate column widths (distribute evenly across page width)
            const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
            const colWidth = pageWidth / column_names.length;

            // Draw table headers
            doc.fontSize(10).font('Helvetica-Bold');
            let x = doc.page.margins.left;
            column_names.forEach(col => {
                doc.text(col, x, doc.y, { width: colWidth, align: 'left' });
                x += colWidth;
            });
            doc.moveDown(0.5);

            // Draw header underline
            doc.lineWidth(1);
            doc.moveTo(doc.page.margins.left, doc.y).lineTo(doc.page.width - doc.page.margins.right, doc.y).stroke();
            doc.moveDown(0.5);

            // Draw table rows
            doc.font('Helvetica').fontSize(10);
            results.forEach(row => {
                x = doc.page.margins.left;
                column_names.forEach(col => {
                    const value = row[col] !== null ? row[col].toString() : '';
                    doc.text(value, x, doc.y, { width: colWidth, align: 'left' });
                    x += colWidth;
                });
                doc.moveDown(0.5);
            });
        }

        // Finalize PDF
        doc.end();
    } catch (error) {
        res.status(500).send({ message: error.message || "Some error occurred while generating the PDF." });
    }
};