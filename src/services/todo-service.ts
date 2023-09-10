import { db } from "./db-service"
import { wsService } from "./ws-service"

export type Todo = {
    id: number,
    text: string,
    done: 0 | 1
}

export type Profile = {
    id: number,
    name: string,
    email: string,
    photo: string,
    text: string,
}

export type CreatingTodo = Omit<Todo, 'id' | 'done'>

export const todoService = {
    getListByUser: async (userId: number) => {
        return await db.selectAll(
            `select id
                   ,text
                   ,done
               from todos
              where user_id = :userId`,
            { userId }
        )
    },
    getProfileByUser: async (userId: number) => {
        return await db.selectAll(
            `select id
                   ,name
                   ,email
                   ,text
                   ,photo
               from profile
              where user_id = :userId`,
            { userId }
        )
    },
    createProfile: async (userId: number) => {
        return await db.insert('profile', {
            user_id: userId
        })
    },
    createTodo: async (userId: number, todo: CreatingTodo) => {
        const id = await db.insert('todos', {
            user_id: userId,
            text: todo.text,
            done: 0
        })
        wsService.sendNewTodo(userId, {
            id,
            text: todo.text,
            done: 0
        })
        return id
    },
    updateTodo: async (userId: number, todo: Todo) => {
        const set = Object.keys(todo).filter(p => p !== 'id').map(p => `${p}=:${p}`)
        await db.query(
            `update todos
                set ${set}
              where id = :id
                and user_id = :userId`,
            { userId, ...todo }
        )
        wsService.editTodo(userId, todo)
    },
    updateProfile: async (userId: number, profile: Profile) => {
        const set = Object.keys(profile).filter(p => p !== 'id').map(p => `${p}=:${p}`)
        await db.query(
            `update profile
                set ${set}
              where id = :id
                and user_id = :userId`,
            { userId, ...profile }
        )
    },
    deleteTodo: async (userId: number, id: number) => {
        await db.query(
            `delete from todos
              where id = :id
                and user_id = :userId`,
            { userId, id }
        )
        console.log("delete")
        wsService.deleteTodo(userId, {
            id,
        })
        
    },
    deleteAllByUser: async (userId: number) => {
        await db.query(
            `delete from todos
              where user_id = :userId`,
            { userId }
        )
        wsService.deleteAll(userId, {})
    },
    deleteDoneByUser: async (userId: number) => {
        await db.query(
            `delete from todos
              where user_id = :userId
                and done = 1`,
            { userId }
        )
        wsService.deleteDone(userId, {})
    }
    
}
