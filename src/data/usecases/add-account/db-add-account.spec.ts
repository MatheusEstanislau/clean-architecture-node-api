import { Encrypter } from '../../protocols/encrypter'
import { DbAddAcount } from './db-add-account'

const makeEncrypter = () => {
  class EncrypterStub implements Encrypter {
    async encrypt(value: string): Promise<string> {
      return new Promise<string>(resolve => resolve(value))
    }
  }
  return new EncrypterStub()
}
makeEncrypter()
const makeSut = () => {
  const encrypterStub = makeEncrypter()
  const sut = new DbAddAcount(encrypterStub)
  return {
    sut,
    encrypterStub,
  }
}
describe('DbAddAcount UseCase', () => {
  test('Should call Encripter with correct password', async () => {
    const { sut, encrypterStub } = makeSut()
    const encriptSpy = jest.spyOn(encrypterStub, 'encrypt')
    const accountData = {
      name: 'valid_name',
      email: 'valid@email.com',
      password: 'valid_password',
    }
    await sut.add(accountData)
    expect(encriptSpy).toHaveBeenLastCalledWith('valid_password')
  })

  test('Should throw if Encripter throws', async () => {
    const { sut, encrypterStub } = makeSut()
    jest
      .spyOn(encrypterStub, 'encrypt')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const accountData = {
      name: 'valid_name',
      email: 'valid@email.com',
      password: 'valid_password',
    }
    const promise = sut.add(accountData)
    await expect(promise).rejects.toThrow()
  })
})
