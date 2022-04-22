import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'
import User from 'App/Models/User'

export default class Role extends BaseModel {
    public static selfAssignPrimaryKey = true

    @column({ isPrimary: true })
    public id: string

    @column()
    public roleName: string

    @column()
    public roleDescription: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @manyToMany(() => User)
    public users: ManyToMany<typeof User>

    @beforeCreate()
    public static async assignUuid(role: Role) {
        role.id = uuidv4()
    }
}
