import { Container } from './container/builder/Container';
import { ContainerBuilder } from './container/config/ContainerBuilder';

export * from "./decorators/options";




export default class DiContainer{

    builder:ContainerBuilder =new ContainerBuilder();
    container:Container
    
    constructor(){
        this.container = ContainerBuilder.getContainer(this.builder);
        
    }



    isBound(identifier:any){
        return this.container.isBound(identifier);
    }


    bind(provider){
        this.builder.add(provider)
        return this;
    }


    add(provider){
        return this.bind(provider)
    }

    get<T=any>(provider){
        return this.container.get<T>(provider)
    }
}