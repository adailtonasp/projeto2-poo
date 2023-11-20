export class Cliente{
    private nome: string;
    private cpf: string; 
    private telefone: string;
    private habilitacao: string;
    private estadoAluguel : boolean

    constructor(nome : string, cpf: string, telefone: string, habilitacao: string) {
        this.nome = nome;
        this.cpf = cpf;
        this.telefone = telefone;
        this.habilitacao = habilitacao;
        this.estadoAluguel = false;
    }

    getEstadoAluguel(): boolean{
        return this.estadoAluguel;
    }

    setEstadoAluguel(estado : boolean) {
        this.estadoAluguel = estado;
    }

    getNome(): string {
        return this.nome;
    }

    getCpf(): string {
        return this.cpf;
    }

    getTelefone(): string {
        return this.telefone;
    }

    getHabilitacao(): string {
        return this.habilitacao;
    }

    getPropriedades() {
        return {
            nome: this.nome,
            cpf: this.cpf, 
            telefone: this.telefone,
            habilitacao: this.habilitacao,
            estadoAluguel : this.estadoAluguel
        }
    }
}