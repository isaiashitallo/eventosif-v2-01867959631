import { render, screen, userEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Aplicativo from '../src/Aplicativo';

async function abrirAbaEventos(usuario) {
  await usuario.press(screen.getByRole('tab', { name: 'Eventos' }));
  await screen.findByText(/\d+ eventos/);
}

describe('Favoritos', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
  });

  it('marca um evento como favorito', async () => {
    const usuario = userEvent.setup();
    await render(<Aplicativo />);
    await abrirAbaEventos(usuario);

    const [primeiraEstrela] = screen.getAllByLabelText('Adicionar aos favoritos');
    await usuario.press(primeiraEstrela);

    expect(screen.getAllByLabelText('Remover dos favoritos')).toHaveLength(1);
  });

  it('mantém os favoritos depois de fechar e abrir o app', async () => {
    const usuario = userEvent.setup();
    const primeiraVez = await render(<Aplicativo />);
    await abrirAbaEventos(usuario);
    const estrelas = screen.getAllByLabelText('Adicionar aos favoritos');

    // marca 2 eventos para representar os favoritos da Semana.
    await usuario.press(estrelas[0]);
    await usuario.press(estrelas[1]);

    // fechar e montar o app de novo simula a reabertura pelo user
    await primeiraVez.unmount(); // "fecha" o app

    await render(<Aplicativo />); // "abre" de novo
    await abrirAbaEventos(usuario);
    // espera terminar de carregar
    
    
    await waitFor(() => {
      expect(screen.getAllByLabelText('Remover dos favoritos')).toHaveLength(2);
    });
  });
});
