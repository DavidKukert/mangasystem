import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'

type TagTypes = 'author' | 'designer' | 'genre'

export default class Tag extends BaseModel {
    public static selfAssignPrimaryKey = true

    @column({ isPrimary: true })
    public id: string

    @column()
    public tagName: string

    @column()
    public tagDescription: string

    @column()
    public tagType: TagTypes | string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @beforeCreate()
    public static async assignUuid(tag: Tag) {
        tag.id = uuidv4()
    }
}
