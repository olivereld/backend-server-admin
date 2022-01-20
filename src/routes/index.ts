import Router from 'express';
import IConection from '../types/IConection';
import Conection from '../services/connections/server-conection.service';
import connect_credential from '../middlewares/server_credentials/server_credentials';

const Routes = Router();



//Raiz
Routes.get('/', (req, res) => {    
    res.json(
        {
            "Title": "Hola mundo usando rutas!"
        }
    );
})

//Prueba
Routes.post('/test',connect_credential ,async (req, res) => {    
    const server:Conection = res.locals.server;
    console.log(req.body);
    const response = "Respuesta";//await server.execute_list_commands('ps -ef | grep java');       
    res.json(
        {
            "resp": response
        }
    );
})
 
export default Routes;