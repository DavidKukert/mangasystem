import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Permission from 'App/Models/Permission'

interface PermissionsSeedData {
    permissionName: string
    permissionDescription: string
}

const permissionsArray: PermissionsSeedData[] = [
    {
        permissionName: 'list_users',
        permissionDescription: 'List users',
    },
    {
        permissionName: 'show_users',
        permissionDescription: 'Show users',
    },
    {
        permissionName: 'store_users',
        permissionDescription: 'Store users',
    },
    {
        permissionName: 'update_users',
        permissionDescription: 'Update users',
    },
    {
        permissionName: 'destroy_users',
        permissionDescription: 'Destroy users',
    },
    {
        permissionName: 'update_own_user',
        permissionDescription: 'Update own user',
    },
    {
        permissionName: 'destroy_own_user',
        permissionDescription: 'Destroy own user',
    },
    {
        permissionName: 'store_profile',
        permissionDescription: 'Store profile',
    },
    {
        permissionName: 'update_profile',
        permissionDescription: 'Update profile',
    },
    {
        permissionName: 'update_own_profile',
        permissionDescription: 'Update own profile',
    },
    {
        permissionName: 'destroy_own_profile',
        permissionDescription: 'Destroy own profile',
    },
    {
        permissionName: 'list_roles',
        permissionDescription: 'List roles',
    },
    {
        permissionName: 'show_roles',
        permissionDescription: 'Show roles',
    },
    {
        permissionName: 'store_roles',
        permissionDescription: 'Store roles',
    },
    {
        permissionName: 'update_roles',
        permissionDescription: 'Update roles',
    },
    {
        permissionName: 'destroy_roles',
        permissionDescription: 'Destroy roles',
    },
    {
        permissionName: 'add_users_roles',
        permissionDescription: 'Add users roles',
    },
    {
        permissionName: 'remove_users_roles',
        permissionDescription: 'Remove users roles',
    },
    {
        permissionName: 'add_permissions_roles',
        permissionDescription: 'Add permissions roles',
    },
    {
        permissionName: 'remove_permissions_roles',
        permissionDescription: 'Remove permissions roles',
    },
    {
        permissionName: 'list_permissions',
        permissionDescription: 'List permissions',
    },
    {
        permissionName: 'show_permissions',
        permissionDescription: 'Show permissions',
    },
    {
        permissionName: 'store_permissions',
        permissionDescription: 'Store permissions',
    },
    {
        permissionName: 'update_permissions',
        permissionDescription: 'Update permissions',
    },
    {
        permissionName: 'destroy_permissions',
        permissionDescription: 'Destroy permissions',
    },
    {
        permissionName: 'store_series',
        permissionDescription: 'Store Series',
    },
    {
        permissionName: 'update_series',
        permissionDescription: 'Update Series',
    },
    {
        permissionName: 'destroy_series',
        permissionDescription: 'Destroy Series',
    },
]

export default class PermissionSeeder extends BaseSeeder {
    public async run() {
        const permissionsDb = await Permission.query()

        if (permissionsDb) {
            const permissionFiltered = permissionsArray.filter((perm) => {
                return !permissionsDb.some(
                    (permission) => permission.permissionName === perm.permissionName
                )
            })

            if (!permissionFiltered.length) {
                console.log('Permissions of the seed already exists!')
            }

            await Permission.createMany(permissionFiltered)
        } else {
            await Permission.createMany(permissionsArray)
        }
    }
}
