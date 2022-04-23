import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'

export default class Permission extends BaseModel {
    public static selfAssignPrimaryKey = true

    @column({ isPrimary: true })
    public id: string

    @column()
    public permissionName: string

    @column()
    public permissionDescription: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @beforeCreate()
    public static async assignUuid(permission: Permission) {
        permission.id = uuidv4()
    }
}
