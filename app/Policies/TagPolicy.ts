import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

export default class TagPolicy extends BasePolicy {
    public async before(user: User | null) {
        if (user) {
            await user.load('roles')
            if (user.roles.some((role) => role.roleName === 'admin')) {
                return true
            }
        }
    }
    public async accessControl(user: User, permissionAllowed: TagPermissions) {
        await user.load('roles', (roleQuery) => {
            roleQuery.preload('permissions')
        })
        return user.roles.some((role) => {
            return role.permissions.some((permission) => {
                return permission.permissionName === permissionAllowed
            })
        })
    }
}
