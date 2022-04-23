import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class PermissionPolicy extends BasePolicy {
    public async before(user: User | null) {
        if (user) {
            await user.load('roles')
            if (user.roles.some((role) => role.roleName === 'admin')) {
                return true
            }
        }
    }
}
