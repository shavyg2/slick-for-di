import { RequestScope } from './container/Provider';


export interface ClassOptions {
    scope?:RequestScope;
}

export interface InjectOptions {
    
}



export const PARAMTER_OPTION = Symbol.for("paramter-option")


export const SCOPE_OPTION = Symbol.for("scope-options")