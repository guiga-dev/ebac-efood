import { z } from 'zod'
import { checkoutPayloadSchema, type CheckoutPayload } from '../../domain/contracts'
import type { CartItem } from '../cart/cartSlice'

const digits = (value: string) => value.replace(/\D/g, '')
function validCardNumber(value: string) {
  let sum = 0
  let double = false
  for (let i = value.length - 1; i >= 0; i -= 1) {
    let digit = Number(value[i])
    if (double) { digit *= 2; if (digit > 9) digit -= 9 }
    sum += digit
    double = !double
  }
  return sum % 10 === 0 && !/^0+$/.test(value)
}

export const checkoutFormSchema = z.object({
  receiver: z.string().trim().min(3, 'Informe o nome de quem receberá.'),
  description: z.string().trim().min(3, 'Informe o endereço.'),
  city: z.string().trim().min(2, 'Informe a cidade.'),
  zipCode: z.string().transform(digits).pipe(z.string().regex(/^\d{8}$/, 'Informe um CEP de 8 dígitos.')),
  number: z.string().trim().regex(/^\d+$/, 'Informe o número do endereço.').transform(Number)
    .pipe(z.number().int().positive()),
  complement: z.string().trim(),
  cardName: z.string().trim().min(3, 'Informe o nome no cartão.'),
  cardNumber: z.string().transform(digits)
    .pipe(z.string().regex(/^\d{13,19}$/).refine(validCardNumber, 'Informe um cartão válido.')),
  cardCode: z.string().trim().regex(/^\d{3,4}$/, 'Informe o código do cartão.').transform(Number),
  cardMonth: z.string().trim().regex(/^\d{1,2}$/).transform(Number).pipe(z.number().int().min(1).max(12)),
  cardYear: z.string().trim().regex(/^\d{4}$/).transform(Number)
})

export type CheckoutForm = z.input<typeof checkoutFormSchema>

export function buildCheckoutPayload(
  form: CheckoutForm,
  items: readonly CartItem[],
  now: Date = new Date()
): CheckoutPayload {
  const values = checkoutFormSchema.parse(form)
  const expiry = new Date(values.cardYear, values.cardMonth, 1)
  if (expiry <= now) {
    throw new z.ZodError([{ code: 'custom', path: ['cardMonth'], message: 'O cartão está vencido.' }])
  }
  if (items.some(item => !Number.isSafeInteger(item.quantity) || item.quantity <= 0)) {
    throw new z.ZodError([{ code: 'custom', path: ['products'], message: 'Quantidade de produto inválida.' }])
  }

  // O contrato não possui quantity. Cada unidade é enviada como produto.
  // Dados de formulário/pagamento nunca são armazenados pelo Redux.
  return checkoutPayloadSchema.parse({
    products: items.flatMap(item => Array.from({ length: item.quantity }, () => ({
      id: item.product.id, price: item.product.preco
    }))),
    delivery: {
      receiver: values.receiver,
      address: { description: values.description, city: values.city, zipCode: values.zipCode,
        number: values.number, complement: values.complement }
    },
    payment: { card: {
      name: values.cardName, number: values.cardNumber, code: values.cardCode,
      expires: { month: values.cardMonth, year: values.cardYear }
    } }
  })
}
