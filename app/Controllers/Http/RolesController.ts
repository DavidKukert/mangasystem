import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Role from 'App/Models/Role'

export default class RolesController {
    protected roleSchema(id: string | null = null) {
        return schema.create({
            roleName: schema.string([
                rules.unique({
                    table: 'roles',
                    column: 'role_name',
                    whereNot: { id },
                }),
            ]),
            roleDescription: schema.string(),
        })
    }

    protected roleUsersSchema() {
        return schema.create({
            usersIds: schema.array().members(schema.string()),
        })
    }

    public async index(ctx: HttpContextContract) {
        if (await ctx.bouncer.with('RolePolicy').denies('before')) {
            return ctx.response.unauthorized()
        }

        const roles = await Role.query()

        return ctx.response.json(roles)
    }

    public async show(ctx: HttpContextContract) {
        try {
            if (await ctx.bouncer.with('RolePolicy').denies('before')) {
                return ctx.response.unauthorized()
            }

            const id = ctx.params.id

            const role = await Role.findOrFail(id)

            return ctx.response.json(role)
        } catch (error) {
            return ctx.response.status(400).json(error)
        }
    }

    public async store(ctx: HttpContextContract) {
        try {
            if (await ctx.bouncer.with('RolePolicy').denies('before')) {
                return ctx.response.unauthorized()
            }

            const payload = await ctx.request.validate({
                schema: this.roleSchema(),
            })

            const role = await Role.create(payload)
            await role.save()
            await role.refresh()

            if (role.$isPersisted)
                return ctx.response.status(201).json({
                    msg: 'Cargo criado com sucesso!',
                    role,
                })
        } catch (error) {
            return ctx.response.status(400).json(error.messages)
        }
    }

    public async update(ctx: HttpContextContract) {
        try {
            if (await ctx.bouncer.with('RolePolicy').denies('before')) {
                return ctx.response.unauthorized()
            }

            const id = ctx.params.id

            const payload = await ctx.request.validate({
                schema: this.roleSchema(id),
            })

            const role = await Role.findOrFail(id)

            await role.merge(payload).save()

            if (role.$isPersisted)
                return ctx.response.status(201).json({
                    msg: 'Cargo atualizado com sucesso!',
                    role,
                })
        } catch (error) {
            return ctx.response.status(400).json(error)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            if (await ctx.bouncer.with('RolePolicy').denies('before')) {
                return ctx.response.unauthorized()
            }

            const id = ctx.params.id

            const role = await Role.findOrFail(id)
            await role.delete()

            if (role.$isDeleted)
                return ctx.response.status(201).json({
                    msg: 'Cargo deletado com sucesso!',
                })
        } catch (error) {
            return ctx.response.status(400).json(error)
        }
    }

    public async addUsers(ctx: HttpContextContract) {
        if (await ctx.bouncer.with('RolePolicy').denies('before')) {
            return ctx.response.unauthorized()
        }

        const roleId = ctx.params.id

        const payload = await ctx.request.validate({ schema: this.roleUsersSchema() })

        const role = await Role.findOrFail(roleId)

        await role.related('users').attach(payload.usersIds)

        return ctx.response.json({ msg: 'Cargo add com sucesso ao(s) usuário(s)!' })
    }

    public async removeUsers(ctx: HttpContextContract) {
        if (await ctx.bouncer.with('RolePolicy').denies('before')) {
            return ctx.response.unauthorized()
        }

        const roleId = ctx.params.id

        const payload = await ctx.request.validate({ schema: this.roleUsersSchema() })

        const role = await Role.findOrFail(roleId)

        await role.related('users').detach(payload.usersIds)

        return ctx.response.json({ msg: 'Cargo removido com sucesso do(s) usuário(s)!' })
    }
}
