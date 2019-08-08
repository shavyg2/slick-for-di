import Container,{ As, Options } from '../src';

const simpleService = Symbol.for("simple");

const provider = {
    provide:simpleService,
    async useFactory(){
        return Promise.resolve("simple");
    }
}


@Options({
    scope:"Singleton"
})
class Controller{
    constructor(@As(simpleService) public simple:string){
        
    }
}


describe("Injection Test",()=>{

    const builder = new Container();

    const container = builder

    builder.add(provider);
    builder.add(Controller);

    test("Simple From Factory",async()=>{
        debugger;
        const controller = await container.get<Controller>(Controller) as Controller;

        expect(controller).toBeInstanceOf(Controller);
        expect(controller.simple).toBe("simple")
    })
    
})