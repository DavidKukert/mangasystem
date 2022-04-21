import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'

interface SocialNetworkProps {
    [index: string]: string
}

export default class Profile extends BaseModel {
    public static selfAssignPrimaryKey = true

    @column({ isPrimary: true })
    public id: string

    @column({ serializeAs: null })
    public userId: string

    @column()
    public firstName: string | null

    @column()
    public lastName: string | null

    @column()
    public email: string | null

    @column()
    public description: string | null

    @column()
    public socialNetworks: SocialNetworkProps | null

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @beforeCreate()
    public static async assignUuid(profile: Profile) {
        profile.id = uuidv4()
    }
}
