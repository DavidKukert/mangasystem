import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Series extends BaseSchema {
    protected tableName = 'series'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.uuid('id').primary().unique()
            table.string('serie_title').unique().notNullable()
            table.string('serie_title_alter')
            table.string('serie_type').notNullable()
            table.string('serie_release_year').notNullable()
            table.text('serie_description')
            table.string('serie_thumbnail').notNullable()

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
