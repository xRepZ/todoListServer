import { authHandler, jsonHandler } from "@help/decorators"
import { badRequest } from "@help/errors"
import { userService } from "@services/user-service"

export default {
    post: jsonHandler(authHandler(async ({ tokenData, payload }) => {
        if (!tokenData) {
            throw badRequest('Нужно авторизоваться')
        }
        return await userService.changePassword(tokenData.id, payload.oldPassword as string, payload.newPassword as string)
    }))
} as Endpoint


