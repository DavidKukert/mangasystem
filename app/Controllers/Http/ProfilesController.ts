import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Profile from 'App/Models/Profile'

export default class ProfilesController {
    protected profileSchema() {
        return schema.create({
            firstName: schema.string.nullable(),
            lastName: schema.string.nullable(),
            email: schema.string.nullable([rules.email()]),
            description: schema.string.nullable(),
            socialNetworks: schema.object.nullable().anyMembers(),
        })
    }

    public async store(ctx: HttpContextContract) {
        const userId = ctx.params.user_id
        const payload = await ctx.request.validate({ schema: this.profileSchema() })
        const hasProfile = await Profile.findBy('userId', userId)

        if (hasProfile) {
            return ctx.response.badRequest({
                msg: 'Perfil para esse usuário ja foi criado anteriormente!',
            })
        }

        const profile = await Profile.create({
            userId,
            ...payload,
        })

        await profile.save()
        await profile.refresh()

        return ctx.response.json(profile)
    }

    public async update(ctx: HttpContextContract) {
        const { user_id: userId, id } = ctx.params
        const payload = await ctx.request.validate({ schema: this.profileSchema() })

        const profile = await Profile.findOrFail(id)

        if (profile && profile.userId !== userId) {
            return ctx.response.badRequest({
                msg: 'Erro ao tentar atualizar esse perfil, favor verifique se a rota e os dados estão corretos!',
            })
        }

        await profile.merge(payload).save()

        return ctx.response.json(profile)
    }
}
