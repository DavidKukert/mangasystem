import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import {
    column,
    beforeSave,
    BaseModel,
    beforeCreate,
    hasOne,
    HasOne,
    manyToMany,
    ManyToMany,
} from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'
import Profile from 'App/Models/Profile'
import Role from 'App/Models/Role'

export default class User extends BaseModel {
    public static selfAssignPrimaryKey = true

    @column({ isPrimary: true })
    public id: string

    @column()
    public nickname: string

    @column({ serializeAs: null })
    public password: string

    @column()
    public rememberMeToken?: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @hasOne(() => Profile)
    public profile: HasOne<typeof Profile>

    @manyToMany(() => Role)
    public roles: ManyToMany<typeof Role>

    @beforeSave()
    public static async hashPassword(user: User) {
        if (user.$dirty.password) {
            user.password = await Hash.make(user.password)
        }
    }

    @beforeCreate()
    public static async assignUuid(user: User) {
        user.id = uuidv4()
    }
}
