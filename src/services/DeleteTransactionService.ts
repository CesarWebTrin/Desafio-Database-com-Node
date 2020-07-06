import { getCustomRepository, TransactionRepository } from 'typeorm';

import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';

import Transactinsrepository from '../repositories/TransactionsRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    // Busca do banco de dados : Existe ?

    const transactionsRepository = getCustomRepository(Transactinsrepository);

    const transaction = await transactionsRepository.findOne(id);

    if (!transaction) {
      throw new AppError('Transaction doees not exists');
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
