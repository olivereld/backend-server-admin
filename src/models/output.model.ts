

interface ILog{
    line:number;
    message:string;
    type:string;    
}

interface IOutputTerminal  {
    command:string;
    output:{
        errors?:ILog[],
        logs?:ILog[],        
    }
}

export {ILog,IOutputTerminal}