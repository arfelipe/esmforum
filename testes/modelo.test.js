const exp = require('constants');
const bd = require('../bd/bd_utils.js');
const modelo = require('../modelo.js');

beforeEach(() => {
  bd.reconfig('./bd/esmforum-teste.db');
  // Limpa dados de todas as tabelas
  bd.exec('DELETE FROM perguntas');
  bd.exec('DELETE FROM respostas');
});

test('Testando banco de dados vazio', () => {
  expect(modelo.listar_perguntas().length).toBe(0);
});

test('Testando cadastro de três perguntas', () => {
  const perguntasTexto = ['1 + 1 = ?', '2 + 2 = ?', '3 + 3 = ?'];
  perguntasTexto.forEach(texto => modelo.cadastrar_pergunta(texto));
  
  const perguntas = modelo.listar_perguntas();
  expect(perguntas.length).toBe(3);
  expect(perguntas[0].texto).toBe(perguntasTexto[0]);
  expect(perguntas[1].texto).toBe(perguntasTexto[1]);
  expect(perguntas[2].num_respostas).toBe(0);
  expect(perguntas[1].id_pergunta).toBe(perguntas[2].id_pergunta - 1);
});

test('Testando recuperar 2 perguntas', () => {
  const perguntasTexto = ['1 + 1 = ?', '2 + 2 = ?'];
  perguntasTexto.forEach(texto => modelo.cadastrar_pergunta(texto));
  
  const perguntas = modelo.listar_perguntas();
  perguntas.forEach((pergunta, index) => {
    const perguntaRecuperada = modelo.get_pergunta(pergunta.id_pergunta);
    expect(perguntaRecuperada.texto).toBe(perguntasTexto[index]);
    expect(perguntaRecuperada.id_pergunta).toBe(pergunta.id_pergunta);
  });
});

test('Testando cadastro de 2 respostas', () => {
  modelo.cadastrar_pergunta('1 + 1 = ?');
  const perguntas = modelo.listar_perguntas();
  const respostasTexto = ['1 + 1 = 2', '1 + 1 = 3'];
  respostasTexto.forEach(texto => modelo.cadastrar_resposta(perguntas[0].id_pergunta, texto));
  
  const respostas = modelo.get_respostas(perguntas[0].id_pergunta);
  respostas.forEach((resposta, index) => {
    expect(resposta.texto).toBe(respostasTexto[index]);
  });
  expect(respostas.length).toBe(2);
});
