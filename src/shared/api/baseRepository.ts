import { provide } from "inversify-binding-decorators"

@provide(Symbol.for("BaseRepository"))
export default abstract class BaseRepository<T> {

    abstract getAliases(): any

    transform(entity: T): any {
        const aliases = this.getAliases()
        const objectAsArray = Object.entries(entity)
        const result: any = {}
        objectAsArray.forEach((value: any, key: any) => {
            result[aliases[value[0]]] = value[1]
        })
        return result as any
    }
}