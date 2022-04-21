import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema } from '@ioc:Adonis/Core/Validator'

export default class SessionsController {
    protected loginSchema = schema.create({
        nickname: schema.string(),
        password: schema.string(),
    })

    public async login(ctx: HttpContextContract) {
        try {
            const { nickname, password } = await ctx.request.validate({
                schema: this.loginSchema,
            })
            const token = await ctx.auth.use('api').attempt(nickname, password, {
                expiresIn: '7days',
            })
            return ctx.response.json(token)
        } catch {
            return ctx.response.badRequest('Invalid credentials')
        }
    }

    public async logout(ctx: HttpContextContract) {
        try {
            await ctx.auth.use('api').revoke()
            return ctx.response.json('Logout Successfully!')
        } catch (error) {
            return ctx.response.badRequest(error)
        }
    }
}
