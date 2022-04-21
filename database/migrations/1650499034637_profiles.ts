import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Profiles extends BaseSchema {
    protected tableName = 'profiles'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary().unique()
            table
                .uuid('user_id')
                .unique()
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('CASCADE')
            table.string('first_name').nullable()
            table.string('last_name').nullable()
            table.string('email').nullable()
            table.text('description').nullable()
            table.jsonb('social_networks').nullable()

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp('created_at', { useTz: true })
            table.timestamp('updated_at', { useTz: true })
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
