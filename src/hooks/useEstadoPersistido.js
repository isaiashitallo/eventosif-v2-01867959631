import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { migrarChavesAntigas } from '../armazenamento/migracao';

// Funciona como useState, mas o valor sobrevive ao fechamento do app.
export function useEstadoPersistido(chave, valorInicial) {
  const [valor, setValor] = useState(valorInicial);

  // leitura
  // useEffect(() => {
  //   async function carregar() {
  //     await migrarChavesAntigas();
  //     const bruto = await AsyncStorage.getItem(chave);
  //     if (bruto != null) setValor(JSON.parse(bruto));
  //   }
  //   carregar();
  // }, [chave]);

  useEffect(() => {
    let ativo = true;

    async function carregar() {
      try {
        await migrarChavesAntigas();
        const bruto = await AsyncStorage.getItem(chave);
        if (!ativo) return;

        if (bruto != null) setValor(JSON.parse(bruto));
        setCarregado(true);
      } catch {
        // se a leitura falha, n grava o valor por cima dos dados
      }
    }

    carregar();
    return () => {
      ativo = false;
    };
  }, [chave]);

  // escrita
  // useEffect(() => {
  //   AsyncStorage.setItem(chave, JSON.stringify(valor));
  // }, [chave, valor]);


  useEffect(() => {
    // espera leitura p n trocar dados salvos pelo valor inicial
    if (carregado) AsyncStorage.setItem(chave, JSON.stringify(valor));
  }, [chave, valor, carregado]);
  return [valor, setValor];
}
