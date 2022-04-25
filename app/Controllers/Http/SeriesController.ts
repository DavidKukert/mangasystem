import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Serie from 'App/Models/Serie'

export default class SeriesController {
    protected serieSchema(id: string | null = null) {
        return schema.create({
            serieTitle: schema.string([
                rules.unique({
                    table: 'series',
                    column: 'serie_title',
                    whereNot: { id },
                }),
            ]),
            serieTitleAlter: schema.string.nullableAndOptional(),
            serieType: schema.string(),
            serieReleaseYear: schema.string(),
            serieDescription: schema.string.nullableAndOptional(),
            serieThumbnail: schema.string(),
        })
    }

    public async index(ctx: HttpContextContract) {
        const series = await Serie.query()
        return ctx.response.json(series)
    }

    public async show(ctx: HttpContextContract) {
        const id = ctx.params.id
        const serie = await Serie.findOrFail(id)
        return ctx.response.json(serie)
    }

    public async store(ctx: HttpContextContract) {
        try {
            if (await ctx.bouncer.with('SeriePolicy').denies('accessControl', 'store_series')) {
                return ctx.response.unauthorized()
            }

            const payload = await ctx.request.validate({
                schema: this.serieSchema(),
            })
            const serie = await Serie.create(payload)
            await serie.save()
            await serie.refresh()

            if (serie.$isPersisted) {
                return ctx.response.status(201).json({
                    msg: 'Série criada com sucesso!',
                    serie,
                })
            }
        } catch (error) {
            return ctx.response.badRequest(error.messages)
        }
    }

    public async update(ctx: HttpContextContract) {
        try {
            if (await ctx.bouncer.with('SeriePolicy').denies('accessControl', 'update_series')) {
                return ctx.response.unauthorized()
            }
            const id = ctx.params.id
            const payload = await ctx.request.validate({
                schema: this.serieSchema(id),
            })
            const serie = await Serie.findOrFail(id)
            await serie.merge(payload).save()

            if (serie.$isPersisted) {
                return ctx.response.json({
                    msg: 'Série atualizada com sucesso!',
                    serie,
                })
            }
        } catch (error) {
            return ctx.response.badRequest(error.messages)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            if (await ctx.bouncer.with('SeriePolicy').denies('accessControl', 'destroy_series')) {
                return ctx.response.unauthorized()
            }
            const id = ctx.params.id
            const serie = await Serie.findOrFail(id)
            await serie.delete()
            if (serie.$isDeleted) {
                return ctx.response.json({
                    msg: 'Série deletada com sucesso!',
                })
            }
        } catch (error) {
            return ctx.response.badRequest(error.messages)
        }
    }
}
