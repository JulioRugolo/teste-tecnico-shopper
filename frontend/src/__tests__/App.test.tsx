import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

jest.mock('../components/SolicitarViagem', () => {
  return ({ onSubmit }: any) => (
    <button
      data-testid="solicitar"
      onClick={() => onSubmit({ options: [{ id: 1 }] })}
    >
      Mock SolicitarViagem
    </button>
  );
});

jest.mock('../components/OpcoesViagem', () => {
  return ({ onBack }: any) => (
    <div data-testid="opcoes">
      <button onClick={onBack}>Voltar</button>
    </div>
  );
});

describe('App', () => {
  it('deve renderizar SolicitarViagem inicialmente', () => {
    render(<App />);
    expect(screen.getByTestId('solicitar')).toBeInTheDocument();
  });

  it('deve mudar para OpcoesViagem após submissão bem-sucedida', async () => {
    render(<App />);
    const solicitarButton = screen.getByTestId('solicitar');
    await userEvent.click(solicitarButton);
    expect(await screen.findByTestId('opcoes')).toBeInTheDocument();
  });

  it('deve voltar para SolicitarViagem ao clicar em voltar', async () => {
    render(<App />);
    await userEvent.click(screen.getByTestId('solicitar'));
    await userEvent.click(screen.getByText(/voltar/i));
    expect(await screen.findByTestId('solicitar')).toBeInTheDocument();
  });
});
