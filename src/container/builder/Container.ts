import { FactoryProvider, SCOPE } from "../Provider";
import uuid from "uuid/v4";
import isPromise from "is-promise";
import { IContainer } from "./IContainer";
import is from "@sindresorhus/is";


export type Scope = "Request"|"Transient"|"Singleton"

export class Container implements IContainer {
    
    private lookup = new Map<any,FactoryProvider>()
    cache = {
        Request: new Map<any, Map<any, any>>(),
        Singleton: new Map<any, any>()
    };
    constructor(private providers: FactoryProvider[]) {
        this.providers.forEach(provider=>{
            this.lookup.set(provider.provide,provider);
        })
    }


    isBound(identifier:any){
        return !!this.providers.find(x=>x.provide===identifier)
    }
    
    isInLookup(identifier:any){
        return this.lookup.has(identifier);
    }
    
    slowLookUp(identifier:any){
        return this.providers.reverse().find(x=>x.provide===identifier)
    }



    get<T = any>(identifier: any): T | PromiseLike<T> {
        let id = uuid();
        this.cache.Request.set(id, new Map());
        let build = this.build(identifier, id);

        if(isPromise(build)){
            return build.then(instance=>{
                this.cache.Request.delete(id);
                return instance;
            })
        }else{
            this.cache.Request.delete(id);
            return build;
        }
    }

    build(identifier: any, requestID: string) {
        let provider = this.isInLookup(identifier)?this.lookup.get(identifier):this.slowLookUp(identifier)
        if (!provider) {
            throw new Error(`No Provider for identifier ${this.printIdentifier(identifier)}`);
        }else if(!this.isInLookup(identifier)){
            this.lookup.set(identifier,provider);
        }

        if (provider.inject && provider.inject.length) {
            let scope = provider.scope || "Singleton";
            
            switch(scope){
                case "Singleton":
                    return this.buildAsSingleton(provider,requestID)
                case "Request":
                    return this.buildAsRequest(provider,requestID);
                case "Transient":
                    return this.buildAsTransient(provider,requestID);
            }
        }
        else {
            switch(provider.scope){
                case "Singleton":
                    return this.buildAsSingleton(provider,requestID)
                case "Request":
                    return this.buildAsRequest(provider,requestID);
                case "Transient":
                    return this.buildAsTransient(provider,requestID);
                default:
                    throw new Error(`Invalid scope ${provider.scope}`)
            }
        }
    }


    private buildAsSingleton(provider:FactoryProvider,requestID:string){
        let cache = this.cache.Singleton;
        if(cache.has(provider.provide)){
            return cache.get(provider.provide)
        }else{
            let dependencies = provider.inject.map(x=>{
                return this.build(x,requestID)
            })

            if(dependencies.some(isPromise)){
                return Promise.all(dependencies.map(x=>Promise.resolve(x)))
                .then(args=>{
                    return provider.useFactory(...args);
                }).then(instance=>{
                    cache.set(provider.provide,instance);
                    return instance
                })
            }else{
                debugger;
                const instance =  provider.useFactory(...dependencies);
                cache.set(provider.provide,instance);
                return instance;
            }
        }
    }

    buildAsRequest(provider:FactoryProvider,requestID:string){
        
        let cache = this.cache.Request.get(requestID);

        if(cache.has(provider.provide)){
            return cache.get(provider.provide)
        }else{
            let dependencies = (provider.inject||[]).map(x=>{
                return this.build(x,requestID)
            })

            if(dependencies.some(isPromise)){
                return Promise.all(dependencies.map(x=>Promise.resolve(x)))
                .then(args=>{
                    return provider.useFactory(...args);
                }).then(instance=>{
                    cache.set(provider.provide,instance);
                    return instance;
                })
            }else{
                const instance = provider.useFactory(...dependencies);
                cache.set(provider.provide,instance);
                return instance;
            }
        }
    }


    buildAsTransient(provider:FactoryProvider,requestID){
        let injects = provider.inject || [];

        let dependencies = injects.map(identier=>{
            return this.build(identier,requestID)
        })

        if(dependencies.some(isPromise)){
            return Promise.all(dependencies.map(x=>Promise.resolve(x)))
            .then(args=>{
                return provider.useFactory(...args)
            })
        }else{
            return provider.useFactory(...dependencies);
        }
    }
    
    private printIdentifier(identifier: any) {

        if(is.function_(identifier)){
            return `${identifier.name}`
        }else{
            return `${identifier}`;
        }
    }

}

