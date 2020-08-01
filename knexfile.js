const baseConfig = {
    client: 'postgresql',
    connection: process.env.PG_CONNECTION,
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations',
        directory: 'dist/database/migrations',
        loadExtensions: ['.js'],
    },
}

module.exports = {

    development: {
        ...baseConfig,
        connection: 'postgresql://tracker:tracker@35.192.114.206:5432/tracker',
        debug: false,
    },

    production: {
        ...baseConfig,
        debug: false,
    },

};
