import { DbAddAcount } from './db-add-account'

const makeSut = () => {
  class EncrypterStub {
    async encrypt(value: string): Promise<string> {
      return new Promise<string>(resolve => resolve(value))
    }
  }
  const encrypterStub = new EncrypterStub()
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
})
