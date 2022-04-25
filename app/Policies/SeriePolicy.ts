import { BasePolicy } from '@ioc:Adonis/Addons/Bouncer'
import User from 'App/Models/User'

type PermissionName = 'store_series' | 'update_series' | 'destroy_series'

export default class SeriePolicy extends BasePolicy {
    public async before(user: User | null) {
        if (user) {
            await user.load('roles')
            if (user.roles.some((role) => role.roleName === 'admin')) {
                return true
            }
        }
    }
    public async accessControl(user: User, permissionName: PermissionName) {
        await user.load('roles', (roleQuery) => {
            roleQuery.preload('permissions')
        })
        return user.roles.some((role) => {
            return role.permissions.some((permission) => {
                return permission.permissionName === permissionName
            })
        })
    }
}
