import { z } from 'zod'
import {
  restaurantsSchema, checkoutPayloadSchema, checkoutResponseSchema,
  type Restaurant, type CheckoutPayload, type CheckoutResponse
} from '../domain/contracts'

export const API_BASE_URL = 'https://api-ebac.vercel.app/api/efood/'
export type HttpTransport = (url: string, init?: RequestInit) => Promise<Response>
export type ApiErrorData = { status: number | 'NETWORK_ERROR' | 'INVALID_RESPONSE' | 'INVALID_REQUEST'; message: string }
export class EfoodApiError extends Error {
  constructor(public readonly data: ApiErrorData) { super(data.message); this.name = 'EfoodApiError' }
}

export interface EfoodClient {
  getRestaurants(signal?: AbortSignal): Promise<Restaurant[]>
  getRestaurant(id: number, signal?: AbortSignal): Promise<Restaurant>
  checkout(payload: CheckoutPayload, signal?: AbortSignal): Promise<CheckoutResponse>
}

export function createEfoodClient(transport: HttpTransport = (url, init) => fetch(url, init)): EfoodClient {
  async function request<T>(path: string, schema: z.ZodType<T>, init?: RequestInit): Promise<T> {
    let response: Response
    try { response = await transport(API_BASE_URL + path, init) }
    catch { throw new EfoodApiError({ status: 'NETWORK_ERROR', message: 'Não foi possível conectar ao serviço.' }) }
    if (!response.ok) throw new EfoodApiError({ status: response.status, message: 'O serviço não conseguiu concluir a solicitação.' })
    try { return schema.parse(await response.json()) }
    catch { throw new EfoodApiError({ status: 'INVALID_RESPONSE', message: 'O serviço retornou uma resposta inválida.' }) }
  }
  const getRestaurants = (signal?: AbortSignal) => request('restaurantes', restaurantsSchema, { signal })
  return {
    getRestaurants,
    async getRestaurant(id, signal) {
      const restaurants = await getRestaurants(signal)
      const restaurant = restaurants.find(item => item.id === id)
      if (!restaurant) throw new EfoodApiError({ status: 404, message: 'Restaurante não encontrado.' })
      return restaurant
    },
    async checkout(payload, signal) {
      const parsed = checkoutPayloadSchema.safeParse(payload)
      if (!parsed.success) throw new EfoodApiError({ status: 'INVALID_REQUEST', message: 'Confira os dados do pedido.' })
      return request('checkout', checkoutResponseSchema, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data), signal
      })
    }
  }
}
