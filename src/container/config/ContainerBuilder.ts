import { FactoryProvider, RequestScope } from '../Provider';
import { IContainerBuilder } from "./IContainerBuilder";
import * as check from "../../provider/check";
import { ProviderFromConstructor } from "./ProviderFromConstructor";
import { ProviderFromValue } from "./ProviderFromValue";
import { Container, Scope } from '../builder/Container';
export class ContainerBuilder implements IContainerBuilder {
    private providers = [] as FactoryProvider[];


    bind(provider){
        return this.add(provider);
    }
    add(provider: any): this {
        if (check.isConstructor(provider)) {
            return this.add(ProviderFromConstructor(provider));
        }
        else if (check.IsUseValue(provider)) {
            return this.add(ProviderFromValue(provider));
        }
        else if (check.IsUseFactory(provider)) {
            let factoryProvider:FactoryProvider = provider;
            let scope:RequestScope = provider.scope || "Singleton";
            let inject  = provider.inject || [];
            provider.scope = scope;
            provider.inject = inject;
            this.providers.push(factoryProvider);
        }
        else {
            throw new Error("not a valid provider");
        }
        return this;
    }
    static getContainer(builder: ContainerBuilder) {
        
        return new Container(builder.providers);
    }
}
