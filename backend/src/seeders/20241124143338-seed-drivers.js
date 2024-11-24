'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Drivers', [
      {
        name: 'Homer Simpson',
        description: 'Olá! Sou o Homer, seu motorista camarada! Relaxe e aproveite o passeio, com direito a rosquinhas e boas risadas (e talvez alguns desvios).',
        vehicle: 'Plymouth Valiant 1973 rosa e enferrujado',
        rate: 2.5,
        minKm: 1,
        review: JSON.stringify({
          rating: 2,
          comment: 'Motorista simpático, mas errou o caminho 3 vezes. O carro cheira a donuts.',
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Dominic Toretto',
        description: 'Ei, aqui é o Dom. Pode entrar, vou te levar com segurança e rapidez ao seu destino. Só não mexa no rádio, a playlist é sagrada.',
        vehicle: 'Dodge Charger R/T 1970 modificado',
        rate: 5.0,
        minKm: 5,
        review: JSON.stringify({
          rating: 4,
          comment: 'Que viagem incrível! O carro é um show à parte e o motorista foi super gente boa. Recomendo!',
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'James Bond',
        description: 'Boa noite, sou James Bond. À seu dispor para um passeio suave e discreto. Aperte o cinto e aproveite a viagem.',
        vehicle: 'Aston Martin DB5 clássico',
        rate: 10.0,
        minKm: 10,
        review: JSON.stringify({
          rating: 5,
          comment: 'Serviço impecável! O motorista é a própria definição de classe e o carro é simplesmente magnífico. Uma experiência digna de um agente secreto.',
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Drivers', null, {});
  },
};
