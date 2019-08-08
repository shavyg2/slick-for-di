import { RequestScope } from './container/Provider';


export interface ClassOptions {
    scope?:RequestScope;
}


export const PARAMTER_OPTION = "design:slick-for:parameter"


export const SCOPE_OPTION = Symbol.for("scope-options")