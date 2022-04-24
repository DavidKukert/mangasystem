import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RolePermissions extends BaseSchema {
    protected tableName = 'permission_role'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            table.uuid('role_id').unsigned().references('roles.id').onDelete('CASCADE')
            table.uuid('permission_id').unsigned().references('permissions.id').onDelete('CASCADE')
            table.unique(['permission_id', 'role_id'])

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
