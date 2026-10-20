import type { CheckoutForm } from '../src/features/checkout/buildPayload'
import type { CartItem } from '../src/features/cart/cartSlice'

// Dados sintéticos e cartão de teste público; nenhum dado pessoal real.
export const validForm: CheckoutForm = {
  receiver: ' Pessoa de Teste ', description: ' Rua de Teste ', city: ' Salvador ',
  zipCode: '40000-000', number: '12', complement: ' Apto 2 ',
  cardName: ' Pessoa de Teste ', cardNumber: '4111 1111 1111 1111',
  cardCode: '123', cardMonth: '12', cardYear: '2035'
}
export const product = {
  id: 1, nome: 'Produto de teste', descricao: 'Descrição', foto: 'https://example.com/produto.png',
  preco: 69.9, porcao: '1 pessoa'
}
export const item: CartItem = { restaurantId: 1, product, quantity: 1 }
export const referenceDate = new Date('2030-01-15T12:00:00Z')
