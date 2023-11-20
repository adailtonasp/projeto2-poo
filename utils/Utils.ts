import {Cliente} from '../src/Cliente';
import { Veiculo } from '../src/Veiculo';
import { readFileSync, writeFileSync } from 'fs';
import * as fs from 'fs';
const rl = require('readline-sync');

export abstract class Utils {

    static verificaHabilitacao(cliente:Cliente,veiculo: Veiculo) : boolean {
        return (cliente.getHabilitacao() == "A" && veiculo.getTipo() == "moto")||(cliente.getHabilitacao() == "B" && veiculo.getTipo() == "carro");
    }

    static calculaDiasAluguel(diaAluguel: Date, diaDevolucao: Date) : number{
        return Math.ceil((diaDevolucao.getTime() - diaAluguel.getTime())/(1000*60*60*24));
    }

    static taxaTipoVeiculo(veiculo: Veiculo) {
        if (veiculo.getTipo() == "carro") {
            return 1.1;
        }
        else {
            return 1.05;
        }
    }

    static lerArquivo(caminho: string) {

        console.log('Teste');

        const arquivo = readFileSync(caminho, {
            encoding : 'utf8'
        });

        return JSON.parse(arquivo);
    }

    static salvarArquivo(dados: any,caminho: string) {
        writeFileSync(caminho, JSON.stringify(dados.map((e:any) => {
            return e.getPropriedades();
        })));
    }
}