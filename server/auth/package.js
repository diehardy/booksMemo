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

exports.checkUser = async (id_user) =>
    knex("public.users").select().where('google_id', id_user)

exports.addUser = async (id_user, name, email, icon) =>
    knex("public.users").insert({
        google_id: id_user, name: name, email: email, icon: icon
    })

exports.updateUser = async (id_user, name, email, icon) =>
    knex("public.users").update({
        name: name, email: email, icon: icon
    }).where('google_id', id_user)