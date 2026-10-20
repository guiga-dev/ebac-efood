import { describe, expect, it, vi } from 'vitest'
import restaurants from '../fixtures/restaurantes.json'
import contract from '../fixtures/checkout-contract.json'
import { restaurantsSchema } from '../src/domain/contracts'
import { API_BASE_URL, createEfoodClient } from '../src/services/client'
import { buildCheckoutPayload } from '../src/features/checkout/buildPayload'
import { validForm, item, referenceDate } from './helpers'

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status, headers: { 'Content-Type': 'application/json' }
})

describe('API efood com transporte injetável', () => {
  it('valida o esquema real capturado por GET: 6 restaurantes e 22 produtos', () => {
    const parsed = restaurantsSchema.parse(restaurants)
    expect(parsed).toHaveLength(6)
    const ids = parsed.flatMap(restaurant => restaurant.cardapio.map(product => product.id))
    expect(ids).toHaveLength(22)
    expect(new Set(ids).size).toBe(22)
  })

  it('preserva a estrutura documentada por GET no checkout', () => {
    const payload = buildCheckoutPayload(validForm, [item], referenceDate)
    expect(Object.keys(payload)).toEqual(Object.keys(contract))
    expect(Object.keys(payload.payment.card)).toEqual(Object.keys(contract.payment.card))
    expect(Object.keys(payload.delivery.address)).toEqual(Object.keys(contract.delivery.address))
  })

  it('consulta lista e encontra restaurante sem supor endpoint de detalhes', async () => {
    const transport = vi.fn().mockResolvedValue(json(restaurants))
    const client = createEfoodClient(transport)
    expect((await client.getRestaurant(1)).titulo).toBe('Bella Tavola Italiana')
    expect(transport).toHaveBeenCalledWith(API_BASE_URL + 'restaurantes', { signal: undefined })
  })

  it('envia somente o payload validado e lê o orderId de resposta simulada', async () => {
    const transport = vi.fn().mockResolvedValue(json({ orderId: 'pedido-simulado-123' }))
    const payload = buildCheckoutPayload(validForm, [item], referenceDate)
    const response = await createEfoodClient(transport).checkout(payload)
    expect(response.orderId).toBe('pedido-simulado-123')
    expect(transport).toHaveBeenCalledOnce()
    const [url, init] = transport.mock.calls[0]
    expect(url).toBe(API_BASE_URL + 'checkout')
    expect(init.method).toBe('POST')
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' })
    expect(JSON.parse(init.body)).toEqual(payload)
  })

  it('não chama transporte quando os dados do request são inválidos', async () => {
    const transport = vi.fn()
    const payload = buildCheckoutPayload(validForm, [item], referenceDate)
    await expect(createEfoodClient(transport).checkout({ ...payload, products: [] }))
      .rejects.toMatchObject({ data: { status: 'INVALID_REQUEST' } })
    expect(transport).not.toHaveBeenCalled()
  })

  it('trata falha HTTP, rede e esquema inválido com erros previsíveis', async () => {
    await expect(createEfoodClient(vi.fn().mockResolvedValue(json({}, 500))).getRestaurants())
      .rejects.toMatchObject({ data: { status: 500 } })
    await expect(createEfoodClient(vi.fn().mockRejectedValue(new Error('offline'))).getRestaurants())
      .rejects.toMatchObject({ data: { status: 'NETWORK_ERROR' } })
    await expect(createEfoodClient(vi.fn().mockResolvedValue(json([{ id: 'erro' }]))).getRestaurants())
      .rejects.toMatchObject({ data: { status: 'INVALID_RESPONSE' } })
    await expect(createEfoodClient(vi.fn().mockResolvedValue(json(restaurants))).getRestaurant(999))
      .rejects.toMatchObject({ data: { status: 404 } })
  })
})
