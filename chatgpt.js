/*

Esse código importa algumas bibliotecas e módulos em um programa JavaScript.

A linha import { ChatGPTAPI, openai } from 'chatgpt' importa duas classes, ChatGPTAPI e openai, de um módulo chamado 'chatgpt'.
A linha import pkg from 'readline-sync' importa um pacote chamado 'readline-sync' e o armazena na variável pkg.
A linha import chalk from 'chalk' importa um pacote chamado 'chalk' e o armazena na variável chalk.
Essas importações permitem o uso das funcionalidades fornecidas pelas bibliotecas e módulos importados no código.

*/



import {
    ChatGPTAPI
} from 'chatgpt'
import pkg from 'readline-sync';
import chalk from 'chalk';


/*
Esse código importa a função readlineSync do pacote pkg e a atribui à constante readlineSync. Em seguida, ele cria um array vazio chamado messages. Por fim, ele cria uma nova instância da classe ChatGPTAPI, passando uma chave de API como parâmetro.
*/
const {
    readlineSync
} = pkg;


const messages = [];
let apiKey = `API-KEY-HERE`

const api = new ChatGPTAPI({
    apiKey: apiKey
})


/*
Esse código envia uma mensagem usando uma API. Ele utiliza a função sendMessage da API, passando a string da mensagem como argumento. Além disso, ele também utiliza um objeto como segundo argumento, onde é definido o parentMessageId como temp.

O parentMessageId é usado para associar a nova mensagem a uma mensagem pai, geralmente utilizado em threads de mensagens.

O trecho de código comentado onProgress parece estar sendo utilizado para imprimir uma resposta parcial no console a cada vez que a função sendMessage envia uma parte da mensagem em progresso. Porém, ele está atualmente comentado e não está sendo executado.
*/
async function ask(string, cb) {
   

    const res = await api.sendMessage(string, {   onProgress: (partialResponse) => {  
      //console.log(partialResponse.text) }
      } } );
    let obj = {
        cmd: string,
        ...res
    }
    console.log(chalk.greenBright(obj.text));
    cb(obj)
}



/*
O código em questão define uma função assíncrona chamada askParent. Essa função recebe três parâmetros: string, cb e temp.

Dentro da função, o código realiza as seguintes ações:

Chama uma função api.sendMessage passando a string e um objeto como argumento.
O objeto possui uma propriedade parentMessageId definida como o valor do parâmetro temp.
Aguarda a resposta da função api.sendMessage através da palavra-chave await e armazena o resultado na constante res.
Cria um novo objeto chamado obj que contém a propriedade cmd definida como o valor do parâmetro string e todas as propriedades do objeto res.
Imprime a propriedade text do objeto obj no console, com a cor verde brilhante utilizando a biblioteca chalk.
Chama a função cb passando o objeto obj como argumento.
Em resumo, essa função envia uma mensagem para api, aguarda a resposta e retorna um objeto contendo a mensagem enviada e a resposta recebida. Em seguida, chama uma função de callback cb com esse objeto como argumento.
*/
async function askParent(string, cb , temp) {

    const res = await api.sendMessage(string, {
        parentMessageId: temp,
     //   onProgress: (partialResponse) => console.log(partialResponse.text)
      });
    let obj = {
        cmd: string,
        ...res
    }
    console.log(chalk.greenBright(obj.text));
    cb(obj)
}

/*
Este código JavaScript é uma função assíncrona auto-executável (IIFE). O código dentro dessa função consiste em um loop interativo para receber dados de entrada do usuário usando a biblioteca pkg.

O código começa definindo uma matriz vazia chamada history para armazenar mensagens. Em seguida, é definida uma função assíncrona chamada loop que recebe um parâmetro temp.

Dentro da função loop, o código solicita ao usuário para digitar um comando usando pkg.question. Se houver um comando digitado, ele invoca uma função assíncrona chamada askParent e aguarda sua resposta usando await. Essa resposta é usada para preencher um objeto de mensagem que é adicionado à matriz history. Em seguida, o valor temp é atualizado com o ID retornado pela função askParent. Por fim, o código chama recursivamente a função loop passando o novo valor temp.

Após a definição da função loop, o código fora da função principal, solicita novamente ao usuário para digitar um comando usando pkg.question. Se houver um comando digitado, ele invoca uma função assíncrona chamada ask e aguarda sua resposta usando await. Esta resposta também é usada para preencher um objeto de mensagem e adicioná-lo à matriz history. Da mesma forma que no loop, o valor temp é atualizado com o ID retornado pela função ask. Em seguida, a função loop é chamada, passando o valor temp.

Em resumo, esse código realiza um loop interativo que solicita comandos ao usuário e mantém um registro de todas as mensagens e respostas recebidas.
*/
(async () => {


    const history = [];
    async function loop (temp){
        const cmd = pkg.question("Type: \n");

    
        if(cmd){
           
            await askParent(cmd, async (cb) => {
                messages.push({
                    role: "user",
                    time: new Date(),
                    type: 'ask',
                    event: cmd,
                    res: cb.text,
                    id: cb.id 
                });
                temp = cb.id
                //console.log(messages)
                await loop(temp)
            }, temp)
        }
    }
    
    const cmd = pkg.question("Type: \n");


    var temp = '';
    if(cmd){
       
        await ask(cmd, async (cb) => {
            messages.push({
                role: "user",
                time: new Date(),
                type: 'ask',
                event: cmd,
                res: cb.text,
                id: cb.id 
            });
            temp = cb.id
            //console.log(messages)
            await loop(temp)
        })
    }



})();


