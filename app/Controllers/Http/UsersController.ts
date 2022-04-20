import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class UsersController {
    protected userSchema = schema.create({
        nickname: schema.string([rules.unique({ table: 'users', column: 'nickname' })]),
        password: schema.string([rules.confirmed(), rules.minLength(4), rules.maxLength(12)]),
    })

    public async index(ctx: HttpContextContract) {
        const users = await User.query()

        return ctx.response.json(users)
    }

    public async show(ctx: HttpContextContract) {
        try {
            const id = ctx.params.id

            const user = await User.findOrFail(id)

            return ctx.response.json(user)
        } catch (error) {
            return ctx.response.status(400).json(error)
        }
    }

    public async store(ctx: HttpContextContract) {
        try {
            const payload = await ctx.request.validate({
                schema: this.userSchema,
            })

            const user = await User.create(payload)
            await user.save()
            await user.refresh()

            if (user.$isPersisted)
                return ctx.response.status(201).json({
                    msg: 'Usuário criado com sucesso!',
                    user,
                })
        } catch (error) {
            return ctx.response.status(400).json(error.messages)
        }
    }

    public async update(ctx: HttpContextContract) {
        try {
            const id = ctx.params.id
            const payload = await ctx.request.validate({
                schema: this.userSchema,
            })

            const user = await User.findOrFail(id)

            await user.merge(payload).save()

            if (user.$isPersisted)
                return ctx.response.status(201).json({
                    msg: 'Usuário atualizado com sucesso!',
                    user,
                })
        } catch (error) {
            return ctx.response.status(400).json(error)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            const id = ctx.params.id

            const user = await User.findOrFail(id)
            await user.delete()

            if (user.$isDeleted)
                return ctx.response.status(201).json({
                    msg: 'Usuário deletado com sucesso!',
                    user,
                })
        } catch (error) {}
    }
}
