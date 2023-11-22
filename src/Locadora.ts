import { Cliente } from './Cliente';
import { Veiculo } from './Veiculo';
import { Utils } from '../utils/Utils';
const rl = require('readline-sync');

export class Locadora{

    private static clientes: Cliente[] = [];

    private static veiculos: Veiculo[] = [];
    
    constructor() {
        //Recuperar clientes do JSON
        const dados_clientes = Utils.lerArquivo("./data/clientes.json");

        Locadora.clientes = dados_clientes.map((element:any)  => {
            const cliente = new Cliente(element.nome, element.cpf, element.telefone, element.habilitacao);

            cliente.setEstadoAluguel(element.estadoAluguel);

            return cliente;
        })

        //Recuperar veiculos do JSON
        const dados_veiculos = Utils.lerArquivo('./data/veiculos.json');
        Locadora.veiculos = dados_veiculos.map((element:any) => {

            const veiculo = new Veiculo(element.placa, element.modelo, element.tipo, element.valorDiaria);

            veiculo.setDataUltimoAluguel(new Date(element.dataUltimoAluguel));

            if (element.cliente) {
                const veiculo_cliente = Locadora.clientes.find(element_cliente => {
                    return element_cliente.getCpf() === element.cliente.cpf;
                })

                veiculo.setCliente(veiculo_cliente);

            } else {
                veiculo.setCliente(undefined);
            }

            return veiculo;
        })
    }

    cadastrarVeiculo(veiculo : Veiculo) {
        // Validação de placa
        if(!Locadora.veiculos.find(v => {
            return v.getPlaca() === veiculo.getPlaca();
        })) {
            Locadora.veiculos.push(veiculo);
            return;
        }

        throw new Error(`O veiculo de placa ${veiculo.getPlaca()} ja possui cadastro!`);
    }

    //O Cliente seleciona o modelo de veiculo que quer alugar
    alugarVeiculo(cliente: Cliente, modelo: string) {

        //Verifica o estado do cliente
        if (cliente.getEstadoAluguel()) {
            throw new Error(`O cliente ${cliente.getNome()} de cpf ${cliente.getCpf()} ja esta com um veiculo alugado!`);
        }

        //Verifica se o modelo desejado pelo cliente esta disponível

        const veiculo  = Locadora.veiculos.find(v => {
            return (v.getModelo() === modelo) && (!v.getCliente());
        })

        if (veiculo) {

            //Verifica se o cliente esta apto para o tipo de veiculo
            if (Utils.verificaHabilitacao(cliente, veiculo)) {
                cliente.setEstadoAluguel(true);
                veiculo.setCliente(cliente);
                const data = new Date();
                veiculo.setDataUltimoAluguel(data);
                //Tudo certo!
                return;
            }

            throw new Error(`O cliente ${cliente.getNome()} nao esta apto para alugar um veiculo do tipo ${veiculo.getTipo()}!`);
        }
        throw new Error(`O modelo ${modelo} nao esta disponivel para aluguel!`);
        
    }

    devolverVeiculo(cpf: string, cliente: Cliente): number {
        //valida cpf informado com cliente logado
        if (cliente.getCpf() != cpf) {
            throw new Error(`Erro ao devolver veiculo - O cpf ${cpf} não corresponde ao cliente logado no sistema!`);
        }


        //Recuperar veiculo
        const veiculo = Locadora.veiculos.find(v => {
            return v.getCliente()?.getCpf() === cpf;
        })

        //Valida veiculo
        if (!veiculo) {
            throw new Error(`Erro ao devolver veiculo - O cpf ${cpf} não corresponde a nenhum cliente com aluguel ativo!`);
        }

        //Fazer calculo de custo
        const valor = veiculo.getValorDiaria() * Utils.calculaDiasAluguel(veiculo.getDataUltimoAluguel(), new Date()) * Utils.taxaTipoVeiculo(veiculo);

        //Atualizar o estado do cliente
        veiculo.getCliente()?.setEstadoAluguel(false);

        //Atualiza a propriedade do veiculo
        veiculo.setCliente(undefined);
        
        return valor;
    }

    excluirVeiculo(placa:string) {
        const index_v = Locadora.veiculos.findIndex(element => {
            return element.getPlaca() === placa;
        })

        const veiculo = Locadora.veiculos[index_v];

        //Veiculo nao encotrado
        if (!veiculo) {
            throw new Error(`Erro ao excluir veiculo - O veículo de placa ${placa} nao pertece a locadora!`);
        }

        //Veiculo alugado
        if (veiculo.getCliente()) {
            throw new Error(`Erro ao excluir veiculo -  ${placa} esta alugado para ${veiculo.getCliente()?.getNome()}`);
        }

        //Remove veiculo
        Locadora.veiculos.splice(index_v,1);
    }
    
    listarVeiculosDisponivel() : Veiculo[] {
        return Locadora.veiculos.filter(element => {
            return !element.getCliente();
        })
    }

    listarVeiculosAlugados() : Veiculo[] {
        return Locadora.veiculos.filter(element => {
            return element.getCliente() instanceof Cliente;
        })
    }

    salvarDados() {
        //Salvar clientes
        Utils.salvarArquivo(Locadora.clientes, './data/clientes.json');
        //Salvar veiculos
        Utils.salvarArquivo(Locadora.veiculos, './data/veiculos.json');
    }

    //true se existir - false se nao existir
    validaCpf(cpf: string): boolean{
        const cliente = Locadora.clientes.find(e => {
            return e.getCpf() === cpf;
        })
        return cliente instanceof Cliente;
    }

    cadastrarCliente(nome: string, cpf: string, telefone: string, habilitacao: string) {

        const cliente_recuperado = Locadora.clientes.find(e => {
            return e.getCpf() === cpf;
        })
        if (cliente_recuperado) {
            throw new Error(`Erro a cadastrar cliente - Um cliente com cpf ${cpf} ja existe!`);
        } 
        
        const cliente = new Cliente(nome, cpf, telefone, habilitacao);
        
        Locadora.clientes.push(cliente);
    }

    efetuarLogin(cpf: string) : Cliente{
        const cliente = Locadora.clientes.find(c => {
            return c.getCpf() === cpf;
        })

        if (!cliente) {
            throw new Error('Erro ao efetuar login - Cliente nao encotrado')
        }

        return cliente;
    }
}