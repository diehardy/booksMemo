const knex = require("knex")({
    client: "pg",
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
    },
});
console.log(process.env.DB_HOST)
//
exports.all_select = async () =>
    knex("WorkGroups.5why").select()

