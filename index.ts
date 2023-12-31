import { Locadora } from './src/Locadora';
import { Veiculo } from './src/Veiculo';
import { Cliente } from './src/Cliente'; 
const rl = require('readline-sync');

const loja = new Locadora();

function exibirMenu(cliente : Cliente) : string {
    console.clear()
    console.log(`
    --------------MENU--------------
    Bem vindo ${cliente.getNome()}

    1. Cadastrar veículo
    2. Alugar veículo
    3. Devolver veículo
    4. Listar veículos disponiveis
    5. Listar veículos alugados
    6. Excluir veículo
    7. Sair
    `);

    const r = rl.question('Digite a opcao desejada: ');

    return r;
}

function cadastrarVeiculo() {
    console.clear();
    console.log('------------CADASTRAR VEICULO------------');
    const placa = rl.question('Digite a placa do veiculo: ');
    const modelo = rl.question('Digite o modelo do veiculo: ');
    const tipo = rl.question('Digite o tipo do veiculo(carro|moto): ');
    const valorDiaria = rl.question('Digite o valor da diaria do veiculo: ');

    const veiculo = new Veiculo(placa, modelo, tipo, valorDiaria);

    //Lanca execao de veiculo ja cadastrado
    try {
        console.log("Iniciando cadastro de veiculo!");
        loja.cadastrarVeiculo(veiculo)
    } catch (e: any) {
        console.log(e.message)
        console.log('Falha no cadastro.')
        rl.question();
        return;
    }
    

    console.log('Veiculo cadastrado com sucesso!');
    rl.question();
}

function alugarVeiculo(cliente : Cliente) {
    console.clear();
    console.log('------------ALUGAR VEICULO------------');
    const modelo = rl.question('Digite o nome do modelo desejado: ');

    //Lanca execao de modelo ausente
    //Lanca execao para habilitacao de cliente
    //Lanca execao para o cliente ja esta alugando um veiculo
    try {
        loja.alugarVeiculo(cliente, modelo);
    } catch (error: any) {
        console.log(error.message);
        console.log('Falha no alguel de veiculo.')
        rl.question();
        return;
    }
    

    console.log('Veiculo alugado com sucesso!');
    rl.question();
}

function devolverVeiculo(cliente: Cliente) {
    console.clear();
    let valorPagamento;
    while (!valorPagamento) {
        console.log('------------DEVOLVER VEICULO------------');
        const cpf = rl.question('Digite o cpf do cliente para devolucao: ');
    
        //Lanca execao de veiculo nao encontrado
        try {
            valorPagamento = loja.devolverVeiculo(cpf, cliente);
        } catch (error: any) {
            console.log(error.message);
            console.log('Falha na devolucao de veiculo.')
            rl.question();
            return;
        }

        console.log('-----------------------------------------------------');
        console.log(`Valor a pagar: ${valorPagamento.toFixed(2)}`);
        rl.question();
    }
}

function listarVeiculosDisponivel(){
    console.clear();
    console.log('------------LISTAR DISPONIVEIS ------------');
    const lista_v = loja.listarVeiculosDisponivel();

    let count = 1;
    lista_v.forEach(e => {
        console.log(`
        ---veiculo ${count}---
        Placa: ${e.getPlaca()}
        Modelo: ${e.getModelo()}
        Tipo: ${e.getTipo()}
        Valor da Diaria: ${e.getValorDiaria()}
        Ultimo alguel: ${e.getDataUltimoAluguel()}`);
        count++;
    });

    rl.question();
}

function listarVeiculosAlugados() {
    console.clear();
    console.log('------------LISTAR ALUGADOS ------------');
    const lista_v = loja.listarVeiculosAlugados();

    let count = 1;
    lista_v.forEach(e => {
        console.log(`
        ---veiculo ${count}---
        Placa: ${e.getPlaca()}
        Modelo: ${e.getModelo()}
        Tipo: ${e.getTipo()}
        Valor da Diaria: ${e.getValorDiaria()}
        Ultimo alguel: ${e.getDataUltimoAluguel()}
        CPF do Cliente: ${e.getCliente()?.getCpf()}`);
        count++;
    });

    rl.question();
}

function excluirVeiculo() {
    console.clear();
    console.log('------------EXCLUIR VEICULO ------------');
    const placa = rl.question('Digite a placa do veiculo a ser excluido: ');

    //Lanca execao para veiculo nao encontrado
    //Lanca execao para veiculo alugado
    try {
        loja.excluirVeiculo(placa);
    } catch (error: any) {
        console.log(error.message);
        console.log("Falha na exclusao do veiculo");
        rl.question();
        return;
    }
    

    console.log('Veiculo excluido com sucesso!');
    rl.question();
}

function exibirLogin() : string {
    console.clear();
    console.log(`
    ---------------LOGIN---------------
    1. Entrar CPF
    2. Cadastrar Cliente
    3. Sair
    `)

    const r = rl.question('Digite a opcao desejada: ');

    return r;
}

function loginCPF(): Cliente | undefined{
    console.clear();
    let cliente;
    console.log('---------------LOGIN---------------');
    const cpf = rl.question('Digite o cpf do cliente: ');

    //Lanca execao de cliente nao encontrado
    try {
        cliente = loja.efetuarLogin(cpf);
    } catch (error: any) {
        console.log(error.message);
        console.log('Falha no login');
        rl.question;
    }
    
    return cliente;
}

function cadastrarCliente() {
    console.clear();
    console.log('---------------CADASTRAR CLIENTE---------------');
    const nome = rl.question('Digite o nome do cliente: ');
    const cpf = rl.question('Digite o cpf do cliente: ');
    const telefone = rl.question('Digite o telefone do cliente: ');
    const habilitacao = rl.question('Digite o tipo de habilitacao do cliente: ');

    try {
        loja.cadastrarCliente(nome, cpf, telefone, habilitacao);
    } catch (error: any) {
        console.log(error.message);
        console.log('Falha ao cadastrar cliente.');
        rl.question();
        return;
    }

    console.log('Cliente cadastrado com sucesso!');
    rl.question();
}

while (true) {
    let entradaUsuario: string
    let cliente;
    while (true) {
        
        entradaUsuario = exibirLogin();


        switch (entradaUsuario) {
            case '1':
                cliente = loginCPF();
                if (cliente) break;
                continue;
            case '2':
                cadastrarCliente();
                continue;
            case '3':
                console.clear();
                loja.salvarDados();
                console.log('Ate mais!');
                process.exit();
            default:
                console.log('Entrada invalida!');
                continue;
        }

        //Login efetuado com sucesso
        break;
    }
  
    while (true) {

        entradaUsuario = exibirMenu(cliente);

        switch (entradaUsuario) {
            case '1':
                cadastrarVeiculo();
                continue;
            case '2':
                alugarVeiculo(cliente);
                continue;
            case '3':
                devolverVeiculo(cliente);
                continue;
            case '4':
                listarVeiculosDisponivel();
                continue;
            case '5':
                listarVeiculosAlugados()
                continue;
            case '6':
                excluirVeiculo()
                continue;
            case '7':
                console.log('Saindo...');
                loja.salvarDados();
                break;
            default:
                console.log('Entrada invalida!');
                continue;
        }

        //sai do while interno quando a entrada for 7
        break;
    }
}