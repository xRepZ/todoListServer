## Запуск в Docker
### build:
    docker compose build
### up:
    docker compose up

## Миграции
### требуется https://github.com/golang-migrate/migrate
    cd database/migrate
    ./mig.sh
  
## Типы HTTP-запросов: GET, POST, PUT

  ### POST /reg
      вход: {
        login: string,
        password: string
      }
      Проверяет валидность данных. Если невалидные - ошибка.
      -- Записали в базу пользователя.

  ### POST /login
    вход: {
        login: string,
        password: string
    }
    выход: {    
    }

### записывать новые пункты в todo
    POST /todo
      вход: {
          text: string
      }
      выход: {
          id: number
      }

### получать список своих todo
    GET /todos
      выход: Todo[]


### менять статус на выполнено/не выполнено у конкретного todo
    PUT /todo
      вход: {
          id: number,
          text: string,
          done: boolean
      }
      выход: 'ok'
