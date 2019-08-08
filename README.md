# Slick For DI


This is a project that enabled dependency resolution, while allowing resolving promises.


Here is a quick overview of how it works.



```ts
import Container from "@slick-for/di"

const container = new Container();


class Logger {

    constructor(private transport:Transport){

    }

    info(message){
        let log = {
            level:"info",
            message
        }


        this.transport.send(log);
    }
}


class Transport {
    send(message){
        ...
    }
}


container.add(Transport)
container.add(Logger)




container.get(Logger)
```

This is a very trivial case where it seems very simple to solve.
But once you have 10s of classes this now becomes a job of creating factories
to create all of these instances.

It is a lot of plumbing and will need a solution that wires it all up for you.

Let's look at another example.


```ts


class UserService {
    
    constructor(@AS('api') private api:string){
        
    }



    getStatus(){
        fetch(this.api)
        ...
    }
}

const client_version = 1.2;

const ApiEndPointProvider = {
    provide:"api",
    async useFactory(){

        let res = await fetch("/get/endpoint?client="+client_version)
        let json = await res.json();

        return json.endpoint;

    }
}

//after adding to container


container.get(UserService).
then(userservice=>{

    //you have everything wired up.

})
```


One thing that is difficult and could get out of hand is managing async code,
and building up all of the dependencies required.

A dependencies injection framework job is to solve all of that.
You describe what you need and the runtime will simply resolve it and all of it's dependencies,
while resolving promises if needed.

These cases are quite trivial, but picture a scenario where there are multiple
files, multiple dependencies, different files requiring the same instances,

eg a single DB connection, but it's shared with multiple of classes that require that instance.


This project is in development but the base implementation is working.

It needs some polishing however to make it complete.







