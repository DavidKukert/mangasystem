import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Tag from 'App/Models/Tag'

export default class TagsController {
    protected tagSchema(id: string | null = null) {
        return schema.create({
            tagName: schema.string([
                rules.unique({
                    table: 'tags',
                    column: 'tag_name',
                    whereNot: { id },
                }),
            ]),
            tagDescription: schema.string(),
            tagType: schema.string(),
        })
    }

    public async index(ctx: HttpContextContract) {
        const tags = await Tag.query()
        return ctx.response.json(tags)
    }

    public async show(ctx: HttpContextContract) {
        const id = ctx.params.id
        const tag = await Tag.findOrFail(id)
        return ctx.response.json(tag)
    }

    public async store(ctx: HttpContextContract) {
        try {
            if (await ctx.bouncer.with('TagPolicy').denies('accessControl', 'store_tags')) {
                return ctx.response.unauthorized()
            }

            const payload = await ctx.request.validate({
                schema: this.tagSchema(),
            })
            const tag = await Tag.create(payload)
            await tag.save()
            await tag.refresh()

            if (tag.$isPersisted) {
                return ctx.response.status(201).json({
                    msg: 'Tag criada com sucesso!',
                    tag,
                })
            }
        } catch (error) {
            return ctx.response.badRequest(error.messages)
        }
    }

    public async update(ctx: HttpContextContract) {
        try {
            if (await ctx.bouncer.with('TagPolicy').denies('accessControl', 'update_tags')) {
                return ctx.response.unauthorized()
            }
            const id = ctx.params.id
            const payload = await ctx.request.validate({
                schema: this.tagSchema(id),
            })
            const tag = await Tag.findOrFail(id)
            await tag.merge(payload).save()

            if (tag.$isPersisted) {
                return ctx.response.json({
                    msg: 'Tag atualizada com sucesso!',
                    tag,
                })
            }
        } catch (error) {
            return ctx.response.badRequest(error.messages)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            if (await ctx.bouncer.with('TagPolicy').denies('accessControl', 'destroy_tags')) {
                return ctx.response.unauthorized()
            }
            const id = ctx.params.id
            const tag = await Tag.findOrFail(id)
            await tag.delete()
            if (tag.$isDeleted) {
                return ctx.response.json({
                    msg: 'Tag deletada com sucesso!',
                })
            }
        } catch (error) {
            return ctx.response.badRequest(error.messages)
        }
    }
}
