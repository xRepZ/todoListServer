import { WebSocket } from "ws"

const wsByUser: Record<number | string, Set<WebSocket>> = {}
//type wsByUserKeyType = keyof typeof wsByUser
//const wsByUser = new Object<number, WebSocket>()
const mapWsToUserId = new Map<WebSocket, number | string>()
//const wsByUser = new Map<number | string, WebSocket[] | undefined>()

const sendToAllUserConnections = (userId: number, type: string, payload: unknown) => {
    for (const ws of wsByUser[userId] || []) {
        ws.send(JSON.stringify({
            type,
            payload
        }))
    }
}

export const wsService = {
    onConnection: (ws: WebSocket) => {
        console.log('connected')
        const pingInterval = setInterval(() => {
            console.log('ping sent')
            ws.ping()
        }, 15000)
        let closeTimer: ReturnType<typeof setTimeout>
        ws.on('pong', () => {
            console.log('pong received')
            clearTimeout(closeTimer)
            closeTimer = setTimeout(() => {
                ws.close()
            }, 30000)
        })
        // ws.on('ping', (message) => {
        //     console.log('got ping')
        //     ws.send('pong ' + message.toString())
        // })
        ws.onmessage = (event) => {
            console.log(event.type)
            console.log("send")
            const { type, payload } = JSON.parse(event.data.toString())
            if (type === 'init') {
                console.log("init")
                const user = JSON.parse(Buffer.from(payload.split('.')[0], 'base64').toString())
                const id = user.id as number
                if (!wsByUser[id]) {
                    wsByUser[id] = new Set()
                }
                // if (!wsByUser.has(id)) {
                //     wsByUser.set(id, [])
                //     //wsByUser[user.id] = []
                // }

                const arr = wsByUser[id]
                if (!arr.has(ws)) {
                    arr.add(ws)
                }
                //console.log('ws for id', wsByUser.get(id))
                console.log('clients: ', arr.size)
                arr.forEach(client => {
                    client.send(JSON.stringify({ type: "server log" }))
                })

                //wsByUser[id].push(ws)

                mapWsToUserId.set(ws, id)
                //console.log('clients: ', wsServer.clients)
                //wsServer.clients.forEach(client => client.send("server"))






            }
            // ws.send(event.data.toString().toUpperCase())
        }
        ws.onclose = (event) => {
            const idUser = mapWsToUserId.get(ws) as number
            mapWsToUserId.delete(ws)
            wsByUser[idUser].delete(ws)
            console.log('closed')
            clearInterval(pingInterval)
        }
        ws.onerror = (event) => {
            console.log('error:', event.error)
        }
    },
    sendNewTodo: (userId: number, payload: unknown) => {
        sendToAllUserConnections(userId, 'new_todo', payload)
    },
    deleteTodo: (userId: number, payload: unknown) => {
        sendToAllUserConnections(userId, 'delete_todo', payload)
    },
    deleteDone: (userId: number, payload: unknown) => {
        sendToAllUserConnections(userId, 'delete_done', payload)
    },
    deleteAll: (userId: number, payload: unknown) => {
        sendToAllUserConnections(userId, 'delete_all', payload)
    },
    editTodo: (userId: number, payload: unknown) => {
        sendToAllUserConnections(userId, 'edit', payload)
    },
    moveToDone: (userId: number, payload: unknown) => {
        sendToAllUserConnections(userId, 'move_to_done', payload)
    },
    moveToActual: (userId: number, payload: unknown) => {
        sendToAllUserConnections(userId, 'move_to_actual', payload)
    },
}
