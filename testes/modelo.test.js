const exp = require('constants');
const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // limpa dados de todas as tabelas
  bd.exec('delete from perguntas', []);
  bd.exec('delete from respostas', []);
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?');
  modelo.cadastrar_pergunta('3 + 3 = ?');
  const perguntas = modelo.listar_perguntas(); 
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe('1 + 1 = ?');
  expect(perguntas[1].texto).toBe('2 + 2 = ?');
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta-1);
});


test("Testando recuperar 2 perguntas", () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  modelo.cadastrar_pergunta('2 + 2 = ?')
  const perguntas = modelo.listar_perguntas();

  const pergunta = modelo.get_pergunta(perguntas[0].id_pergunta);
  expect(pergunta.texto).toBe('1 + 1 = ?');
  expect(pergunta.id_pergunta).toBe(perguntas[0].id_pergunta);
  
  const pergunta2 = modelo.get_pergunta(perguntas[1].id_pergunta);
  expect(pergunta2.texto).toBe('2 + 2 = ?');
  expect(pergunta2.id_pergunta).toBe(perguntas[1].id_pergunta);
});

test('Testando cadastro de 2 respostas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  const perguntas = modelo.listar_perguntas();
  modelo.cadastrar_resposta(perguntas[0].id_pergunta, '1 + 1 = 2');
  modelo.cadastrar_resposta(perguntas[0].id_pergunta, '1 + 1 = 3');

  const respostas = modelo.get_respostas(perguntas[0].id_pergunta);
  expect(respostas[0].texto).toBe('1 + 1 = 2');
  expect(respostas[1].texto).toBe('1 + 1 = 3');
  expect(respostas.length).toBe(2);

});
// exports.cadastrar_resposta = cadastrar_resposta;
// exports.get_pergunta = get_pergunta;
// exports.get_respostas = get_respostas;
// exports.get_num_respostas = get_num_respostas;
