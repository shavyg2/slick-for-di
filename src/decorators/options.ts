import { ClassOptions, SCOPE_OPTION, PARAMTER_OPTION } from '../type';







export function Options(options:ClassOptions){

    let decorator =  (DecoratedController:any,method:string)=>{

        if(method){
            console.log("Method Decorator")
        }else{
            Reflect.defineMetadata(SCOPE_OPTION,options.scope,DecoratedController);
        }
        return DecoratedController;    
    };
    return decorator as any;
}



export function As(options:any){
    const decorator:any = (target,method,index)=>{
        if(method){
            console.log("instance")
        }else{

            let params = Reflect.getMetadata(PARAMTER_OPTION,target)||[];
            params.push({
                index,
                provide:options
            })

            Reflect.defineMetadata(PARAMTER_OPTION,params,target)
        }
    }

    return decorator as any;
}