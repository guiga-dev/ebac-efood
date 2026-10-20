import { describe, expect, it } from 'vitest'
import { buildCheckoutPayload } from '../src/features/checkout/buildPayload'
import { checkoutPayloadSchema } from '../src/domain/contracts'
import { validForm, item, referenceDate } from './helpers'

describe('Payload de checkout', () => {
  it('monta o contrato exato com máscaras removidas e tipos numéricos', () => {
    const payload = buildCheckoutPayload(validForm, [item], referenceDate)
    expect(payload).toEqual({
      products: [{ id: 1, price: 69.9 }],
      delivery: { receiver: 'Pessoa de Teste', address: {
        description: 'Rua de Teste', city: 'Salvador', zipCode: '40000000', number: 12, complement: 'Apto 2'
      } },
      payment: { card: { name: 'Pessoa de Teste', number: '4111111111111111', code: 123,
        expires: { month: 12, year: 2035 } } }
    })
    expect(checkoutPayloadSchema.safeParse(payload).success).toBe(true)
  })

  it('representa cada unidade sem inventar campo quantity no contrato', () => {
    expect(buildCheckoutPayload(validForm, [{ ...item, quantity: 2 }], referenceDate).products)
      .toEqual([{ id: 1, price: 69.9 }, { id: 1, price: 69.9 }])
  })

  it('rejeita carrinho vazio e quantidade inválida', () => {
    expect(() => buildCheckoutPayload(validForm, [], referenceDate)).toThrow()
    expect(() => buildCheckoutPayload(validForm, [{ ...item, quantity: -1 }], referenceDate)).toThrow()
  })

  it('rejeita dados incompletos, CEP inválido e cartão que falha no checksum', () => {
    for (const invalid of [{ receiver: '' }, { zipCode: '123' }, { cardNumber: '4111111111111112' },
      { cardCode: 'ab1' }, { cardMonth: '13' }, { number: '-12' }]) {
      expect(() => buildCheckoutPayload({ ...validForm, ...invalid }, [item], referenceDate)).toThrow()
    }
  })

  it('aceita o mês de vencimento até seu último dia e rejeita meses anteriores', () => {
    const form = { ...validForm, cardMonth: '01', cardYear: '2030' }
    expect(() => buildCheckoutPayload(form, [item], referenceDate)).not.toThrow()
    expect(() => buildCheckoutPayload(form, [item], new Date(2030, 1, 1))).toThrow('vencido')
  })
})
