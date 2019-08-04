

import Container,{ Options } from '../src';


@Options({
    scope:"Singleton"
})
class Controller{


}


@Options({
    scope:"Transient"
})
class Application{

    constructor(public main:Controller){

    }
}

describe("Constructor Test",()=>{

    const builder = new Container();
    const container = builder;
    builder.add(Controller)
    builder.add(Application)

    test("Empty Resolution",()=>{
        const controller = container.get(Controller)
        expect(controller).toBeInstanceOf(Controller);
    })

    test('Single Dependent',async ()=>{
        const app:Application = await container.get<Application>(Application) as Application;
        expect(app).toBeInstanceOf(Application)
        expect(app.main).toBeInstanceOf(Controller);
    })



    test('Scope',async ()=>{
        const app:Application = await container.get<Application>(Application) as Application;
        const app2:Application = await container.get<Application>(Application) as Application;
        
        expect(app).not.toBe(app2)
        expect(app.main).toBe(app2.main)
    })


});