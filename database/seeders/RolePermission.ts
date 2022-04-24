import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'
import Role from 'App/Models/Role'

const permissionsUser = [
    'update_own_user',
    'destroy_own_user',
    'update_own_profile',
    'destroy_own_profile',
]

export default class RolePermissionSeeder extends BaseSeeder {
    public async run() {
        const roles = await Role.query()
        const permissions = await Permission.query()

        if (roles && permissions) {
            for (const role of roles) {
                if (role.roleName === 'admin') {
                    await role.related('permissions').sync(permissions.map((perm) => perm.id))
                }
                if (role.roleName === 'user') {
                    await role.related('permissions').sync(
                        permissions
                            .filter((perm) => {
                                return permissionsUser.includes(perm.permissionName)
                            })
                            .map((perm) => perm.id)
                    )
                }
            }
        }
    }
}
