export default interface IConection{
    host: string;
    port?: number;
    username: string;
    password?: string;
    privateKey?: string;
    passphrase?: string;
    tryKeyboard?: boolean
}