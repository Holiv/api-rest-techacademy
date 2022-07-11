import express, { application, request, response } from 'express';
import {StatusCodes} from 'http-status-codes';

//criando o server ao utilizar o método importado do express
const app = express();
//Criar uma porta da qual as requisições serão transmitidas e o express ficará monitorando
const PORT = process.env.PORT || 3000;

//objeto criado que armazena informações de usuarios
let users = [
    {id: 1, name: 'Helton', age: 30},
    {id: 2, name: 'Laiz', age: 28},
    {id: 3, name: 'Thomas', age: 0},
];

app.use(express.json());

//.listen é um método que possui dois parâmetros, sendo o primeiro parâmetro a Porta do servidor em que o express ficará monitorando e o segundo parâmetro é a função callback que será executada a partir do momento em que o express inicia o monitoramento da porta passada no primeiro parâmetro.
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

//O método .get monitora a rota de recebimento das solicitações.
//O método .get possui dois parâmetros, sendo o primeiro a rota da solicitação e o segundo a função callback que retorna um valor pro servidor utilizando o método .send.
app.get('/', (request, response) => {
    return response.send('<h1> Trabalhando com servidor express </h1>');
});

//rota de get criada para retornar TODOS os usuários quando solicitado através da rota '/users'
app.get('/users', (request, response) => {
    return response.send(users);
})

//rota de get criada para retornar um usuário especifico enviado como request.
app.get('/users/:userId', (request, response) => {
    //request.params.userId retorna o valor passado como chave para acessar um usuário específico.
    //O valor é recebido e armazenado como uma string.
    const userId = request.params.userId;
    //o método .find possui uma callback function como parâmetro que itera sobre os objetos.
    //No exemplo abaixo é utilizado o atributo .id para que seja feita a comparação entre os ids dos usuários do objeto e o id passado na rota de solicitação.
    const user = users.find(user => {
        //função que executa comparação entre os id dos usuários armazenados no objeto e o id passado na rota.
        //após a comparação e encontrar um usuário compatível, o id é retornado e armazenado na variável 'user'.
       return user.id === Number(userId);
    })
    //retorna para o servidor a resposta solicitada através da rota de get.
    return response.send(user);
});

//O método Post é criado para inserir informação a partir de uma rota, nesse exemplo, a rota /users.
//A utilização do post é para fazer uma requisição, então a informação enviada é passada como argumento para o parâmetro 'request'
app.post('/users', (request, response) => {
    //As informações são enviadas utilizando o body e devem ser recuperadas no request utilizando o 'request.body' e armazenados em uma nova variável.
    const newUser = request.body;

    //As informações agora inseridas na variável é inserida no objeto 'users' através do método push.
    users.push(newUser);

    //O response é utilizado para retornar e exebir o resultado da requisição POST
    //Neste exeplo é retornado o objeto 'users' agora atualizado com o novo usuário inserido pela requisição POST.
    //O 'StatusCodes.CREATED' pode ser utilizado após a instalação da dependencia 'http-status-code' que serve para retornar o código da requisição HTTP, sendo o código 201 retornado para o método POST
    return response.status(StatusCodes.CREATED).send(users);
});

//O método PUT é utilizado para atualizar uma informação existente utilizando uma query-params.  
app.put('/users/:userId', (request, response) => {
    //request.params.userId retorna o valor passado como chave para acessar um usuário específico.
    const userId = request.params.userId;
    //A informação passada pelo corpo da requisição é recuperado pelo request e armazenado em uma variável.
    const updatedUser = request.body;

    //o método .map é utilizado para iterar sobre o objeto 'users' e encontrar o id do usuário compativel com o id passado pela requisição.
    //Caso o id compativel seja encontrado, o novo usuário enviado pelo corpo da requisição irá substituir o usuário existente.
    users = users.map(user => {
        if (user.id === Number(userId)) {
            return updatedUser;
        }
    //caso o id não seja encontrado o usuário existente será retornado e inserido no objeto
        return user;
    });
    //retorno da resposta para verificação da atualização dos valores do objeto (atualização dos usuários)
    return response.send(updatedUser);
});

//o método DELETE é utilizado para deletar um elemento de um objeto ao ser passada a requesição com query-params
app.delete('/users/:userId', (request, response) => {
    //request.params.userId retorna o valor passado como chave para acessar um usuário específico.
    const userId = request.params.userId;
    
    //utilizando o filter é atualizado o objeto users ao iterar cada usuario do objeto e através da condicional o objeto é filtrado retornando todos os usuários menos o usuário com o id passado na requisição através do query-params
    users = users.filter((user) => {
        if (user.id !== Number(userId)) {
            return user;
        }
    });
    //utilizando o statuscodes no_content para identificar como código 204 e o método .send não precisa retornar nenhum conteudo, pois o método DELETE não retorna nenhuma informação.
    return response.status(StatusCodes.NO_CONTENT).send();
})