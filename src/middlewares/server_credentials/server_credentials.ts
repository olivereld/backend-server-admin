import IConection from '../../types/IConection';
import Conection from '../../services/connections/server-conection.service';

function connect_credential(req:any,res:any,next:any){
    const objeto:IConection = {
        host:"",
        username:"root",
        password:""
    }
    const server = new Conection(objeto);
    server.conect_ssh_with_pass()
        .then( resp => {
            res.locals.server = server;
            next();
        } )
        .catch( err => res.status(401).send(`Error , credenciales invalidas para la conexion con el servidor`))
}

export default connect_credential;
