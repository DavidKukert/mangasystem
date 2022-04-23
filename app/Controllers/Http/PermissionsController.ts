import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import Permission from 'App/Models/Permission'

export default class PermissionsController {
    protected permissionSchema(id: string | null = null) {
        return schema.create({
            permissionName: schema.string([
                rules.unique({
                    table: 'permissions',
                    column: 'permission_name',
                    whereNot: { id },
                }),
            ]),
            permissionDescription: schema.string(),
        })
    }

    public async index(ctx: HttpContextContract) {
        if (await ctx.bouncer.with('PermissionPolicy').denies('before')) {
            return ctx.response.unauthorized()
        }

        const permissions = await Permission.query()

        return ctx.response.json(permissions)
    }

    public async show(ctx: HttpContextContract) {
        try {
            if (await ctx.bouncer.with('PermissionPolicy').denies('before')) {
                return ctx.response.unauthorized()
            }

            const id = ctx.params.id

            const permission = await Permission.findOrFail(id)

            return ctx.response.json(permission)
        } catch (error) {
            return ctx.response.status(400).json(error)
        }
    }

    public async store(ctx: HttpContextContract) {
        try {
            if (await ctx.bouncer.with('PermissionPolicy').denies('before')) {
                return ctx.response.unauthorized()
            }

            const payload = await ctx.request.validate({
                schema: this.permissionSchema(),
            })

            const permission = await Permission.create(payload)
            await permission.save()
            await permission.refresh()

            if (permission.$isPersisted)
                return ctx.response.status(201).json({
                    msg: 'Permissão criada com sucesso!',
                    permission,
                })
        } catch (error) {
            return ctx.response.status(400).json(error.messages)
        }
    }

    public async update(ctx: HttpContextContract) {
        try {
            if (await ctx.bouncer.with('PermissionPolicy').denies('before')) {
                return ctx.response.unauthorized()
            }

            const id = ctx.params.id

            const payload = await ctx.request.validate({
                schema: this.permissionSchema(id),
            })

            const permission = await Permission.findOrFail(id)

            await permission.merge(payload).save()

            if (permission.$isPersisted)
                return ctx.response.status(201).json({
                    msg: 'Permissão atualizada com sucesso!',
                    permission,
                })
        } catch (error) {
            return ctx.response.status(400).json(error)
        }
    }

    public async destroy(ctx: HttpContextContract) {
        try {
            if (await ctx.bouncer.with('PermissionPolicy').denies('before')) {
                return ctx.response.unauthorized()
            }

            const id = ctx.params.id

            const permission = await Permission.findOrFail(id)
            await permission.delete()

            if (permission.$isDeleted)
                return ctx.response.status(201).json({
                    msg: 'Permissão deletada com sucesso!',
                })
        } catch (error) {
            return ctx.response.status(400).json(error)
        }
    }
}
