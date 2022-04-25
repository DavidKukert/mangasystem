import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'

export default class Serie extends BaseModel {
    public static selfAssignPrimaryKey = true

    @column({ isPrimary: true })
    public id: string

    @column()
    public serieTitle: string

    @column()
    public serieTitleAlter: string | null | undefined

    @column()
    public serieType: string

    @column()
    public serieReleaseYear: string

    @column()
    public serieDescription: string | null | undefined

    @column()
    public serieThumbnail: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @beforeCreate()
    public static async assignUuid(serie: Serie) {
        serie.id = uuidv4()
    }
}
