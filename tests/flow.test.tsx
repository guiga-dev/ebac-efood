// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import restaurants from '../fixtures/restaurantes.json'
import { EfoodApp } from '../src/ui/EfoodApp'
import { createAppStore } from '../src/app/store'
import { efoodApi } from '../src/services/api'
import { EfoodApiError, type EfoodClient } from '../src/services/client'

const stores: ReturnType<typeof createAppStore>[] = []
beforeEach(() => {
  vi.stubGlobal('fetch', vi.fn().mockImplementation(async () => new Response(JSON.stringify(restaurants))))
  vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  stores.splice(0).forEach(store => store.dispatch(efoodApi.util.resetApiState()))
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function setup(client?: EfoodClient, route = '/restaurante/1') {
  const store = createAppStore()
  stores.push(store)
  render(<Provider store={store}><MemoryRouter initialEntries={[route]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}><EfoodApp checkoutClient={client} /></MemoryRouter></Provider>)
  return { store, user: userEvent.setup() }
}

async function fillDelivery(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Quem irá receber'), 'Pessoa de Teste')
  await user.type(screen.getByLabelText('Endereço'), 'Rua de Teste')
  await user.type(screen.getByLabelText('Cidade'), 'Salvador')
  await user.type(screen.getByLabelText('CEP'), '40000000')
  await user.type(screen.getByLabelText('Número', { exact: true }), '12')
}
async function fillPayment(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText('Nome no cartão'), 'Pessoa de Teste')
  await user.type(screen.getByLabelText('Número do cartão'), '4111111111111111')
  await user.type(screen.getByLabelText('CVV'), '123')
  await user.type(screen.getByLabelText('Mês de vencimento'), '12')
  await user.type(screen.getByLabelText('Ano de vencimento'), '2035')
}
async function addFirstProduct(user: ReturnType<typeof userEvent.setup>) {
  await user.click(await screen.findByRole('button', { name: 'Mais detalhes sobre Ravioli al Tartufo Nero' }))
  expect(screen.getByRole('dialog', { name: 'Ravioli al Tartufo Nero' })).toBeTruthy()
  await user.click(screen.getByRole('button', { name: /Adicionar ao carrinho/ }))
}

describe('Fluxo efood com dados sintéticos e checkout simulado', () => {
  it('navega do catálogo ao restaurante, abre detalhes e remove item', async () => {
    const { user, store } = setup(undefined, '/')
    await user.click(await screen.findByRole('link', { name: 'Saiba mais sobre Bella Tavola Italiana' }))
    await addFirstProduct(user)
    const cart = screen.getByRole('dialog', { name: 'Carrinho' })
    expect(within(cart).getByText('Valor total')).toBeTruthy()
    expect(store.getState().cart.items).toHaveLength(1)
    await user.click(within(cart).getByRole('button', { name: 'Remover Ravioli al Tartufo Nero' }))
    expect(screen.getByText('Seu carrinho está vazio')).toBeTruthy()
    expect(store.getState().cart.items).toHaveLength(0)
  })

  it('valida entrega, envia o payload e mostra o ID retornado somente após sucesso', async () => {
    const checkout = vi.fn().mockResolvedValue({ orderId: 'pedido-simulado-789' })
    const client = { checkout } as unknown as EfoodClient
    const { user, store } = setup(client)
    await addFirstProduct(user)
    await user.click(screen.getByRole('button', { name: 'Continuar com a entrega' }))
    await fillDelivery(user)
    await user.clear(screen.getByLabelText('CEP'))
    await user.type(screen.getByLabelText('CEP'), '123')
    await user.click(screen.getByRole('button', { name: 'Continuar com o pagamento' }))
    expect(screen.getByRole('alert').textContent).toContain('8 dígitos')
    expect(checkout).not.toHaveBeenCalled()
    await user.clear(screen.getByLabelText('CEP'))
    await user.type(screen.getByLabelText('CEP'), '40000000')
    await user.click(screen.getByRole('button', { name: 'Continuar com o pagamento' }))
    await fillPayment(user)
    await user.click(screen.getByRole('button', { name: 'Finalizar pagamento' }))
    expect(await screen.findByText('Pedido realizado - pedido-simulado-789')).toBeTruthy()
    expect(checkout).toHaveBeenCalledTimes(1)
    expect(checkout.mock.calls[0][0]).toMatchObject({ products: [{ id: 1, price: 69.9 }], delivery: { receiver: 'Pessoa de Teste', address: { number: 12, zipCode: '40000000' } } })
    expect(store.getState().cart.items).toHaveLength(0)
    await user.click(screen.getByRole('button', { name: 'Concluir' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('preserva carrinho e formulário quando o serviço recusa o pedido', async () => {
    const checkout = vi.fn().mockRejectedValue(new EfoodApiError({ status: 503, message: 'Serviço indisponível.' }))
    const { user, store } = setup({ checkout } as unknown as EfoodClient)
    await addFirstProduct(user)
    await user.click(screen.getByRole('button', { name: 'Continuar com a entrega' }))
    await fillDelivery(user)
    await user.click(screen.getByRole('button', { name: 'Continuar com o pagamento' }))
    await fillPayment(user)
    await user.click(screen.getByRole('button', { name: 'Finalizar pagamento' }))
    expect((await screen.findByRole('alert')).textContent).toContain('Seu carrinho foi mantido')
    expect(store.getState().cart.items).toHaveLength(1)
    expect((screen.getByLabelText('Nome no cartão') as HTMLInputElement).value).toBe('Pessoa de Teste')
  })
})

