import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Role from 'App/Models/Role'

interface RoleSeedData {
    roleName: string
    roleDescription: string
}

const rolesArray: RoleSeedData[] = [
    {
        roleName: 'admin',
        roleDescription: 'Administrator',
    },
    {
        roleName: 'user',
        roleDescription: 'Users',
    },
    {
        roleName: 'author',
        roleDescription: 'Authors',
    },
]

export default class RoleSeeder extends BaseSeeder {
    public async run() {
        const rolesDb = await Role.query()

        if (rolesDb) {
            const rolesFiltered = rolesArray.filter((perm) => {
                return !rolesDb.some((role) => role.roleName === perm.roleName)
            })

            if (!rolesFiltered.length) {
                console.log('Roles of the seed already exists!')
            }

            await Role.createMany(rolesFiltered)
        } else {
            await Role.createMany(rolesArray)
        }
    }
}
