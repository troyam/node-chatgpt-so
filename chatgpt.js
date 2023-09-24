import {
    ChatGPTAPI
} from 'chatgpt'
import pkg from 'readline-sync';
import chalk from 'chalk';

const {
    readlineSync
} = pkg;


const messages = [];
let apiKey = `API-KEY-HERE`

const api = new ChatGPTAPI({
    apiKey: apiKey
})


async function ask(string, cb) {


    const res = await api.sendMessage(string, {
        onProgress: (partialResponse) => {
            //console.log(partialResponse.text) }
        }
    });
    let obj = {
        cmd: string,
        ...res
    }
    console.log(chalk.greenBright(obj.text));
    cb(obj)
}
async function askParent(string, cb, temp) {

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


(async () => {


    const history = [];
    async function loop(temp) {
        const cmd = pkg.question("Type: \n");


        if (cmd) {

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
    if (cmd) {

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
