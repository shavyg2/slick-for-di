export interface IConstructor<T = any> {
    new(...args: any[]): T;
}
