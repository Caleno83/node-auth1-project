exports.up = async function(knex) {
    await knex.schema.createTable("users", (table) => {
		table.increments("id")
        table.text("username", 128).notNull().unique()
        table.text("password", 128).notNull()
    })
};

exports.down = async function(knex) {
    await knex.schema.dropTableIfExists("users")
};
