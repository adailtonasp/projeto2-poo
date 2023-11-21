import {Cliente} from './Cliente'

export class Veiculo{
    private placa: string;
    private modelo: string;
    private tipo: string;

    //propriedade de vinculacao ao cliente
    private cliente?: Cliente;

    private dataUltimoAluguel: Date;

    private valorDiaria: number;

    constructor(placa: string, modelo: string,tipo:string,valorDiaria:number) {
        this.placa = placa;
        this.modelo = modelo;
        this.tipo = tipo;
        this.valorDiaria = valorDiaria;
        this.dataUltimoAluguel = new Date();
    }

    getValorDiaria(): number {
        return this.valorDiaria;
    }

    setDataUltimoAluguel(data : Date) {
        this.dataUltimoAluguel = data;
    }

    getDataUltimoAluguel() : Date {
        return this.dataUltimoAluguel;
    }

    getTipo(): string {
        return this.tipo;
    }

    setCliente(cliente: Cliente | undefined) {
        this.cliente = cliente;
    }

    getCliente(): Cliente | undefined {
        return this.cliente;
    }

    getPlaca() : string {
        return this.placa;
    }

    getModelo(): string {
        return this.modelo;
    }

    getPropriedades() {
        return {
            placa: this.placa,
            modelo: this.modelo,
            tipo: this.tipo,
            cliente: this.cliente?.getPropriedades(),
            dataUltimoAluguel : this.dataUltimoAluguel,

            valorDiaria: this.valorDiaria
        }
    }
}