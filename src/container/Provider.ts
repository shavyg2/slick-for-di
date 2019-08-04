
export type RequestScope = "Request"|"Singleton"|"Transient"

export const SCOPE = {
    Request:"Request" as const,
    Singleton:"Singleton" as const,
    Transient:"Transient" as const
}

export interface ValueProvider {
    scope?:RequestScope,
    provide:any;
    useValue:any;
    inject?:any[]
}



export interface FactoryProvider{

    scope?:RequestScope,
    provide:any
    useFactory?:(...args:any)=>any|Promise<any>
    inject?:any[]
}



