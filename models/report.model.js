// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Report = sequelize.define('tbl_report', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     print: {
//         type: DataTypes.STRING
//     },
//     export: {
//         type: DataTypes.STRING
//     },
//     email: {
//         type: DataTypes.STRING
//     },
//     sql_query: {
//         type: DataTypes.TEXT,
//         allowNull: false
//     },
//     graph: {
//         type: DataTypes.TEXT
//     },
//     active: {
//         type: DataTypes.ENUM('yes', 'no'),
//         defaultValue: 'yes'
//     },
//     created_by: {
//         type: DataTypes.INTEGER
//     },
//     updated_by: {
//         type: DataTypes.INTEGER
//     },
//     user_id: {
//         type: DataTypes.ARRAY(DataTypes.INTEGER),
//         comment: "Array of user IDs who can access this report"
//     }
// }, {
//     // Sequelize automatically adds createdAt and updatedAt.
//     // We are mapping them to your desired column names.
//     timestamps: true,
//     createdAt: 'created_date_and_time',
//     updatedAt: 'updated_date_and_time',
//     tableName: 'tbl_report' // Explicitly set the table name
// });

// module.exports = Report;



// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Report = sequelize.define('tbl_report', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     // --- NEW COLUMN ADDED HERE ---
//     report_name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         comment: "The user-defined name for the report."
//     },
//     // --- End of new column ---
//     print: {
//         type: DataTypes.STRING
//     },
//     export: {
//         type: DataTypes.STRING
//     },
//     email: {
//         type: DataTypes.STRING
//     },
//     sql_query: {
//         type: DataTypes.TEXT,
//         allowNull: false
//     },
//     graph: {
//         type: DataTypes.TEXT
//     },
//     active: {
//         type: DataTypes.ENUM('yes', 'no'),
//         defaultValue: 'yes'
//     },
//     created_by: {
//         type: DataTypes.INTEGER
//     },
//     updated_by: {
//         type: DataTypes.INTEGER
//     },
//     user_id: {
//         type: DataTypes.ARRAY(DataTypes.INTEGER),
//         comment: "Array of user IDs who can access this report"
//     }
// }, {
//     timestamps: true,
//     createdAt: 'created_date_and_time',
//     updatedAt: 'updated_date_and_time',
//     tableName: 'tbl_report'
// });

// module.exports = Report;














// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database');

// const Report = sequelize.define('tbl_report', {
//     id: {
//         type: DataTypes.INTEGER,
//         primaryKey: true,
//         autoIncrement: true
//     },
//     report_name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         comment: "The user-defined name for the report."
//     },
//     module_name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         comment: "The name of the module this report belongs to"
//     },
//     print: {
//         type: DataTypes.ARRAY(DataTypes.INTEGER),
//         comment: "Array of user IDs who can access print feature"
//     },
//     export: {
//         type: DataTypes.ARRAY(DataTypes.INTEGER),
//         comment: "Array of user IDs who can access export feature"
//     },
//     email: {
//         type: DataTypes.ARRAY(DataTypes.INTEGER),
//         comment: "Array of user IDs who can access email feature"
//     },
//     sql_query: {
//         type: DataTypes.TEXT,
//         allowNull: false
//     },
//     graph: {
//         type: DataTypes.ENUM('yes', 'no'),
//         defaultValue: 'no',
//         comment: "Whether the report includes a graph"
//     },
//     graph_type: {
//         type: DataTypes.STRING,
//         allowNull: false,
//         comment: "The type of graph for the report (e.g., bar, line, pie)"
//     },
//     active: {
//         type: DataTypes.ENUM('yes', 'no'),
//         defaultValue: 'yes'
//     },
//     created_by: {
//         type: DataTypes.INTEGER
//     },
//     updated_by: {
//         type: DataTypes.INTEGER
//     },
//     user_id: {
//         type: DataTypes.ARRAY(DataTypes.INTEGER),
//         comment: "Array of user IDs who can access this report"
//     }
// }, {
//     timestamps: true,
//     createdAt: 'created_date_and_time',
//     updatedAt: 'updated_date_and_time',
//     tableName: 'tbl_report'
// });

// module.exports = Report;
















const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Report = sequelize.define('tbl_report', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    report_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "The user-defined name for the report."
    },
    module_name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "The name of the module this report belongs to"
    },
    print: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        comment: "Array of user IDs who can access print feature"
    },
    export: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        comment: "Array of user IDs who can access export feature"
    },
    email: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        comment: "Array of user IDs who can access email feature"
    },
    sql_query: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    graph: {
        type: DataTypes.ENUM('yes', 'no'),
        defaultValue: 'no',
        comment: "Whether the report includes a graph"
    },
    graph_type: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "The type of graph for the report (e.g., bar, line, pie)"
    },
    active: {
        type: DataTypes.ENUM('yes', 'no'),
        defaultValue: 'yes'
    },
    created_by: {
        type: DataTypes.INTEGER
    },
    updated_by: {
        type: DataTypes.INTEGER
    },
    user_id: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        comment: "Array of user IDs who can access this report"
    }
}, {
    timestamps: true,
    createdAt: 'created_date_and_time',
    updatedAt: 'updated_date_and_time',
    tableName: 'tbl_report'
});

module.exports = Report;