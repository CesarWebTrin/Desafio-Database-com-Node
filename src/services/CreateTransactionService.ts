import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';

import Transaction from '../models/Transaction';
import Category from '../models/Category';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

/* Na classe service realizar a função execute passando os parâmetros a serem utilizados na rota(
  criar uma interface com os parâmetros para definir a tipagem deles pois estamos utilizando typescript

  Realize a passagem de parâmetros de maneira desestruturada e depois você passa a tipagem dele com o nome da interface

  O método async necessita de uma promisse. Uma promisse é uma promessa de qual vai ser o retorno do método

) */

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    /* Logo após declarar a variável que vai dar pegar o repository 'getCustomRepository'.

  Esse método é necessário realizar uma importação do typeorm

  Depois declara a constante com o método que vai ser realizado(nesse caso vai ser o create)

  Utiliza  o await para salvar os dados cadastrados no repositório existente  e faz o retorno do cadastro como estipulado na promessa */

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();

    if (type === 'outcome' && total < value) {
      throw new AppError('You do not have enough balance');
    }

    let transactionCategory = await categoryRepository.findOne({
      where: {
        title: category,
      },
    });

    /* Verificar se a categoria já existe

      Exite? Buscar ela do banco de dados e usar o id que foi retornado

      Não existe ? Eu crio ela
    */

    if (!transactionCategory) {
      transactionCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(transactionCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: transactionCategory,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
