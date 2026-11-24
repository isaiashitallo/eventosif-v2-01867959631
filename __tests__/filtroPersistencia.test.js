import { render, screen, userEvent } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Aplicativo from '../src/Aplicativo';

async function abrirAbaEventos(usuario) {
  await usuario.press(screen.getByRole('tab', { name: 'Eventos' }));
  await screen.findByText(/\d+ eventos/);
}

describe('Persistência do filtro de categoria', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('mantém Oficina selecionada depois de fechar e reabrir o app', async () => {
    const usuario = userEvent.setup();
    const primeiraVez = await render(<Aplicativo />);
    await abrirAbaEventos(usuario);

    await usuario.press(screen.getByRole('button', { name: 'Oficina' }));
    expect(screen.getByRole('button', { name: 'Oficina', selected: true })).toBeTruthy();
    // filtro tem q continuar escolhido depois que fechar o app
    await primeiraVez.unmount();

    await render(<Aplicativo />);
    await abrirAbaEventos(usuario);

    // volta eventos, oficina tem q aparecer como selecionada
    expect(screen.getByRole('button', { name: 'Oficina', selected: true })).toBeTruthy();
  });
});
