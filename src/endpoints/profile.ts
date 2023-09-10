import { authHandler, jsonHandler } from "@help/decorators"
import { badRequest } from "@help/errors"
import { CreatingTodo, Profile, todoService } from "@services/todo-service"

export default {
    get: jsonHandler(authHandler(async ({ tokenData }) => {
        if (!tokenData) {
            throw badRequest('Нужно авторизоваться')
        }
        return await todoService.getProfileByUser(tokenData.id)
    })),
    post: jsonHandler(authHandler(async ({ tokenData, payload }) => {
        if (!tokenData) {
            throw badRequest('Нужно авторизоваться')
        }
        return await todoService.createProfile(tokenData.id)
    })),
    put: jsonHandler(authHandler(async ({ tokenData, payload }) => {
        if (!tokenData) {
            throw badRequest('Нужно авторизоваться')
        }
        return await todoService.updateProfile(tokenData.id, payload as Profile)
    })),
    // delete: jsonHandler(authHandler(async ({ tokenData, params }) => {
    //     if (!tokenData) {
    //         throw badRequest('Нужно авторизоваться')
    //     }
    //     return await todoService.deleteTodo(tokenData.id, +params.id)
    // })),
} as Endpoint
