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

// exports.deleteVideoNote = async (id_note) =>
//     knex("public.video_notes").where('id_note', id_note).delete()