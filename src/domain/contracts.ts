import { z } from 'zod'

export const menuItemSchema = z.object({
  id: z.number().int().positive(),
  nome: z.string(),
  descricao: z.string(),
  foto: z.string().url(),
  preco: z.number().finite().nonnegative(),
  porcao: z.string()
})

export const restaurantSchema = z.object({
  id: z.number().int().positive(),
  titulo: z.string(),
  destacado: z.boolean(),
  tipo: z.string(),
  avaliacao: z.number().finite(),
  descricao: z.string(),
  capa: z.string().url(),
  cardapio: z.array(menuItemSchema)
})

export const restaurantsSchema = z.array(restaurantSchema)
export type MenuItem = z.infer<typeof menuItemSchema>
export type Restaurant = z.infer<typeof restaurantSchema>

// Contrato de request consultado com GET na rota de checkout oficial.
export const checkoutPayloadSchema = z.object({
  products: z.array(z.object({
    id: z.number().int().positive(),
    price: z.number().finite().nonnegative()
  }).strict()).min(1),
  delivery: z.object({
    receiver: z.string().trim().min(3),
    address: z.object({
      description: z.string().trim().min(3),
      city: z.string().trim().min(2),
      zipCode: z.string().regex(/^\d{8}$/),
      number: z.number().int().positive(),
      complement: z.string()
    }).strict()
  }).strict(),
  payment: z.object({
    card: z.object({
      name: z.string().trim().min(3),
      number: z.string().regex(/^\d{13,19}$/),
      code: z.number().int().min(0).max(9999),
      expires: z.object({
        month: z.number().int().min(1).max(12),
        year: z.number().int().min(1000).max(9999)
      }).strict()
    }).strict()
  }).strict()
}).strict()

export type CheckoutPayload = z.infer<typeof checkoutPayloadSchema>

// Resposta esperada pelo fluxo de confirmação. Validada em runtime; somente
// transporte simulado foi utilizado para testar POST nesta etapa.
export const checkoutResponseSchema = z.object({ orderId: z.string().min(1) })
export type CheckoutResponse = z.infer<typeof checkoutResponseSchema>
