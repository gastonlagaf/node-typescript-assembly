# About

This is sample assembly for backend development, using Node.js stack. Assembly configured for usage of:
 - Typescript - type inference (https://github.com/microsoft/TypeScript)
 - Inversify - DI container (https://github.com/inversify/InversifyJS)
 - Knex - relational database query builder (https://github.com/knex/knex)
 - Express - web framework (https://github.com/expressjs/express)

# Implementation description

## Web

Web layer uses express with inversify-express-utils (https://github.com/inversify/inversify-express-utils) for routing simplification and callback avoidance.

```typescript
@controller("/api")
class SampleController {

    constructor(@inject(TYPE.UserService) private userService: UserService) {}

    @httpGet("/all")
    async sampleGet(req: Request, res: Response): Promise<UserDTO> {
        const result = await this.userService.get()
        return new UserDTO(result)
    }

    @httpPost("/post", ...UserDTO.getValidationConstraints())
    async samplePost(req: Request, res: Response) {
        const user = req.body as UserDTO
        return res.json({title: "Done"})
    }

}
```

Request and response entities are separated from persistable ones. Consider calling them as Transfer Object. Transfer Object is tightly related to its repreesented entity. Programmatically Transfer Object must implement `TransferObject<T>` interface and have constructor, parametrized with persistent entity. Transfer object obligates to implement `toEntity` method, which will transform Transfer Object back to persistent.

### Request validation

For validation used raw express express-validator (https://github.com/express-validator/express-validator), all checks included in @http[METHOD] method decorators as second parameter. In this assembly, all validation rules located in each model respectively as static method getValidationConstraints() (WIP, will be moved out of static method).

## Dependency injection

With raw inversify added it's binding decorators (https://github.com/inversify/inversify-binding-decorators). To make them being registered, all injectable components should be imported in file `src/config/diContext.ts`. In turn this file is imported into `src/Server.ts` to initialize inversify container correctly. To declare injectable component, mark class with `@provide` decorator

```typescript
@provide(TYPE.UserService)
export class UserService
```

In example above there is a parameter included. This is a component's service identifier. All of them are located in `src/shared/type.ts` consider adding your own one, when creating yours classes.

## Relational Database Support

Assembly uses Knex query builder to have access to relational database. There is specific in that assembly, as it supports declarative transactions on service layer, so every repository should be responsible for specific table. To enable it, mark required method with decorator called `@transactional` and all queries will be executed within one transaction context. If there is multiple knex instances, i.e. backend connected to multiple databases, there is a possibility to specify needed knex instance in decorator.

```typescript
@transactional() // Can be specified needed knex instance as parameter
async get(): Promise<User>
```

# Usage

Assembly works on Node V8 and further. For development, there is nodemon installed with possibility of debugging it.

## Development

For local development on VSCode, there is a launch.json provided for debugging application. To launch app, pass to terminal `npm run start:dev`, which will initialize nodemon. The only one launch configuration will attach to running nodemon, so breakpoints will be tracked. Mind, that, when VSCode will spawn process select popup, consider using one with arguments like `ts-node -r tsconfig-paths/register ./src --env=development`. In other cases, breakpoints will be unavailable.

To pass environment variables for development, spec them in `env/development.env` file.

## Database Migrations

All migrations located in `db/migrations` folder. All connection properties located in knexfile.ts, all props taken from same env file. Head over to (http://knexjs.org/#knexfile) for custom changes.

To create migration, pass next command in terminal `NODE_ENV=[ENV] knex migrate:make [MIGRATION_NAME]`

In this build, due to personal convenience, all migrations written in raw sql. In this case, migration looks like in the only migration in that repo.

For migration execution, pass `NODE_ENV=[ENV] knex migrate:latest` in terminal or consider using it in pipelines