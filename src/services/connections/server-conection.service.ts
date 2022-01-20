import { NodeSSH } from "node-ssh";
import IConection from "../../types/IConection";
import { ILog,IOutputTerminal } from "../../models/output.model";

export default class Conection {
    
    ssh:NodeSSH = new NodeSSH();
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    privateKey?: string;
    passphrase?: string;
    tryKeyboard?: boolean;
    
    constructor(
        obj:IConection
    ){
        this.host        = obj.host;
        this.port        = obj.port;
        this.username    = obj.username;
        this.password    = obj.password;
        this.privateKey  = obj.privateKey;
        this.passphrase  = obj.passphrase;
        this.tryKeyboard = obj.tryKeyboard;
    }

    async conect_ssh_with_pass():Promise<NodeSSH>{                
        return this.ssh.connect({
            host:this.host,
            username: this.username,
            password:this.password
        });
    }
    
    //ejecutamos un comando en concreto
    async execute_comand(command:string):Promise<string>{
        const conection = await this.conect_ssh_with_pass();
        return conection.execCommand(command).then(function(result:any) {
            if(result.stderr)
                return 'Error';
            else
                return result.stdout;
        })                                        
    }

    //ejecutamos una lista de comandos
    async execute_list_commands(...commands:string[]){
        const conection = await this.conect_ssh_with_pass();
        const response:any = {};
        for (let index = 0; index < commands.length; index++) {
            response[index] = this.parse_data_information(
                await this.execute_comand(commands[index]),
                commands[index]);                            
        }
        return response;
    }

    //Armamos la respuesta segun la salida del comando
    parse_data_information(response:string,command:string):IOutputTerminal{
        if(response === 'Error'){
            return({
                command:command,
                output:{
                    errors:this.get_data_logs(response),                  
                }
            });
        }else {
            return({
                command:command,
                output:{                    
                    logs:this.get_data_logs(response)
                }
            });
        }                
    }

    get_data_logs(server_response:string):ILog[]{
        if(server_response.indexOf("\n") ){
            const listOfLogs:string[] = server_response.split('\n'); 
            const responseLogs:ILog[] = [];
            for (let index = 0; index < listOfLogs.length; index++) {
                responseLogs.push(
                    {                
                        line:index,
                        message:listOfLogs[index],
                        type:'log'                                
                    }
                )                                
            }
            return responseLogs;
        }else{
            return [{                
                line:0,
                message:server_response,
                type:'log'                                
            }];
        }
    }
} 
/**
 * "S.ficheros  Tamaño Usados  Disp Uso% Montado en \n
 * root fs           97G    13G   80G  14% / \n
 * udev                                                      10M      0   10M   0% /dev \n
 * tmpfs                                                    604M   592K  604M   1% /run\n/dev/disk/by-uuid/34fdb679-bdb9-4f8e-9af1-1a6ba23d0df8    97G    13G   80G  14% /\ntmpfs                                                    5,0M      0  5,0M   0% /run/lock\ntmpfs                                                    1,6G   4,0K  1,6G   1% /run/shm"
 */