export const calculateRoute = jest.fn().mockResolvedValue({
  origin: {
    latitude: -23.5557813,
    longitude: -46.6395371,
  },
  destination: {
    latitude: -22.9068576,
    longitude: -43.1729362,
  },
  distance: 446.263,
  duration: '5 hours 39 mins',
  options: [
    {
      id: 1,
      name: 'Homer Simpson',
      description: 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
      vehicle: 'Plymouth Valiant 1973 rosa e enferrujado',
      review: {
        rating: 2,
        comment: 'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.',
      },
      value: 1115.6575,
    },
    {
      id: 2,
      name: 'Dominic Toretto',
      description: 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
      vehicle: 'Dodge Charger R/T 1970 modificado',
      review: {
        rating: 4,
        comment: 'Que viagem incrível! O carro é um show à parte e o motorista foi super gente boa. Recomendo!',
      },
      value: 2231.315,
    },
    {
      id: 3,
      name: 'James Bond',
      description: 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
      vehicle: 'Aston Martin DB5 clássico',
      review: {
        rating: 5,
        comment: 'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.',
      },
      value: 4462.63,
    },
  ],
  routeResponse: {},
});
