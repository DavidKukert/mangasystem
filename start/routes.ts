/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
    return { hello: 'world' }
})

// user routes
Route.resource('users', 'UsersController')
    .apiOnly()
    .middleware({
        update: ['auth:api'],
        destroy: ['auth:api'],
    })

// user profiles routes
Route.resource('users.profiles', 'ProfilesController')
    .only(['store', 'update'])
    .middleware({ '*': ['auth:api'] })

// roles routes
Route.resource('roles', 'RolesController')
    .apiOnly()
    .middleware({
        '*': ['auth:api'],
    })
Route.post('roles/:id/users', 'RolesController.addUsers').middleware('auth:api')
Route.delete('roles/:id/users', 'RolesController.removeUsers').middleware('auth:api')
Route.post('roles/:id/permissions', 'RolesController.addPermissions').middleware('auth:api')
Route.delete('roles/:id/permissions', 'RolesController.removePermissions').middleware('auth:api')

// Permissions Routes
Route.resource('permissions', 'PermissionsController')
    .apiOnly()
    .middleware({
        '*': ['auth:api'],
    })

// Session routes
Route.post('login', 'SessionsController.login')
Route.delete('logout', 'SessionsController.logout').middleware('auth:api')

// Series routes
Route.resource('series', 'SeriesController')
    .apiOnly()
    .middleware({
        store: ['auth:api'],
        update: ['auth:api'],
        destroy: ['auth:api'],
    })
