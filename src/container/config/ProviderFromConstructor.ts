//import "reflect-metadata";
import { Design } from "../builder/design";
import { IConstructor } from "../builder/IConstructor";
import { SCOPE } from "../Provider";
import { SCOPE_OPTION, PARAMETER_OPTION } from '../../type';
export function ProviderFromConstructor(constructor: IConstructor) {
  const originalParams = Reflect.getMetadata(Design.Parameters, constructor) || [];
  const overrideParams = Reflect.getMetadata(PARAMETER_OPTION,constructor) || []


  overrideParams.forEach(({index,identifier})=>{
    originalParams.splice(index,1,identifier)
  })

  debugger;
  const scope = Reflect.getMetadata(SCOPE_OPTION,constructor);




  return {
    provide: constructor,
    inject:originalParams,
    useFactory: (...args: any[]) => {

      //TODO resolve from
      return Reflect.construct(constructor, args);
    },
    scope:scope||"Singleton"
  };
}
