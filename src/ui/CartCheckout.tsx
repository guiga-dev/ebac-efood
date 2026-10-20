import { useState, type FormEvent } from 'react'
import { z } from 'zod'
import { useAppDispatch, useAppSelector } from '../app/store'
import { clearCart, closeCart, removeItem, selectCartIsOpen, selectCartItems, selectCartTotal } from '../features/cart/cartSlice'
import { checkoutFormSchema, buildCheckoutPayload, type CheckoutForm } from '../features/checkout/buildPayload'
import { useCheckout } from '../features/checkout/useCheckout'
import type { EfoodClient } from '../services/client'
import { assets, money } from './assets'
import { OverlayFocus } from './Overlay'
import * as S from './styles'

const emptyForm: CheckoutForm = { receiver: '', description: '', city: '', zipCode: '', number: '', complement: '', cardName: '', cardNumber: '', cardCode: '', cardMonth: '', cardYear: '' }
const deliverySchema = checkoutFormSchema.pick({ receiver: true, description: true, city: true, zipCode: true, number: true, complement: true })
type Stage = 'cart' | 'delivery' | 'payment' | 'confirmation'
export function CartCheckout({ checkoutClient }: { checkoutClient?: EfoodClient }) {
  const items = useAppSelector(selectCartItems), total = useAppSelector(selectCartTotal), isOpen = useAppSelector(selectCartIsOpen)
  const dispatch = useAppDispatch(), checkout = useCheckout(checkoutClient)
  const [stage, setStage] = useState<Stage>('cart'), [form, setForm] = useState<CheckoutForm>(emptyForm)
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutForm, string>>>({})
  const visible = isOpen || stage === 'confirmation'
  function close() { if (!checkout.isLoading) { dispatch(closeCart()); setStage('cart'); setErrors({}); setForm(emptyForm); checkout.reset() } }
  if (!visible) return null
  function captureErrors(error: z.ZodError) {
    const result: Partial<Record<keyof CheckoutForm, string>> = {}
    for (const issue of error.issues) { const key = issue.path[0] as keyof CheckoutForm; if (!result[key]) result[key] = issue.message }
    setErrors(result)
  }
  function deliverySubmit(event: FormEvent) {
    event.preventDefault()
    const result = deliverySchema.safeParse(form)
    if (!result.success) { captureErrors(result.error); return }
    setErrors({}); setStage('payment')
  }
  async function paymentSubmit(event: FormEvent) {
    event.preventDefault()
    try {
      const payload = buildCheckoutPayload(form, items)
      setErrors({})
      await checkout.submit(payload)
      setForm(emptyForm); setStage('confirmation'); dispatch(clearCart())
    } catch (error) { if (error instanceof z.ZodError) captureErrors(error) }
  }
  function field(key: keyof CheckoutForm, label: string, options: { autoComplete?: string; inputMode?: 'numeric' | 'text'; maxLength?: number; required?: boolean; type?: string } = {}) {
    return <label>{label}<input aria-label={label} name={key} value={form[key]} autoComplete={options.autoComplete ?? 'off'} inputMode={options.inputMode} maxLength={options.maxLength} required={options.required ?? true} type={options.type ?? 'text'} aria-invalid={Boolean(errors[key])} aria-describedby={errors[key] ? `${key}-error` : undefined} onChange={event => { setForm({ ...form, [key]: event.target.value }); setErrors({ ...errors, [key]: undefined }) }} />{errors[key] && <small role="alert" id={`${key}-error`}>{errors[key]}</small>}</label>
  }
  return <OverlayFocus onClose={close}><S.Backdrop><S.OverlayButton onClick={close} tabIndex={-1} aria-label="Fechar carrinho" disabled={checkout.isLoading} /><S.Sidebar role="dialog" aria-modal="true" aria-label={stage === 'cart' ? 'Carrinho' : stage === 'delivery' ? 'Entrega' : stage === 'payment' ? 'Pagamento' : 'Confirmação do pedido'}>
    <button className="sr-only" onClick={close} disabled={checkout.isLoading}>Fechar painel</button>
    {stage === 'cart' && (items.length ? <><ul>{items.map(item => <S.CartRow key={`${item.restaurantId}-${item.product.id}`}><img src={item.product.foto} alt={item.product.nome} /><div><h3>{item.product.nome}</h3><p>{item.quantity > 1 ? `${item.quantity} × ` : ''}{money(item.product.preco)}</p></div><button aria-label={`Remover ${item.product.nome}`} onClick={() => dispatch(removeItem({ restaurantId: item.restaurantId, productId: item.product.id }))}><img src={assets.trash} alt="" /></button></S.CartRow>)}</ul><div className="total"><span>Valor total</span><span>{money(total)}</span></div><S.Button onClick={() => setStage('delivery')}>Continuar com a entrega</S.Button></> : <><h2>Seu carrinho está vazio</h2><S.Button onClick={close}>Continuar escolhendo</S.Button></>)}
    {stage === 'delivery' && <><h2>Entrega</h2><S.CheckoutFormLayout onSubmit={deliverySubmit}>{field('receiver', 'Quem irá receber', { autoComplete: 'name' })}{field('description', 'Endereço', { autoComplete: 'street-address' })}{field('city', 'Cidade', { autoComplete: 'address-level2' })}<div className="row">{field('zipCode', 'CEP', { autoComplete: 'postal-code', inputMode: 'numeric', maxLength: 9 })}{field('number', 'Número', { inputMode: 'numeric' })}</div>{field('complement', 'Complemento (opcional)', { required: false })}<div className="actions"><S.Button type="submit">Continuar com o pagamento</S.Button><S.Button type="button" className="back" onClick={() => { setStage('cart'); setErrors({}) }}>Voltar para o carrinho</S.Button></div></S.CheckoutFormLayout></>}
    {stage === 'payment' && <><h2>Pagamento - Valor a pagar {money(total)}</h2><S.CheckoutFormLayout onSubmit={paymentSubmit}>{field('cardName', 'Nome no cartão', { autoComplete: 'cc-name' })}<div className="card-row">{field('cardNumber', 'Número do cartão', { autoComplete: 'cc-number', inputMode: 'numeric', maxLength: 23 })}{field('cardCode', 'CVV', { autoComplete: 'cc-csc', inputMode: 'numeric', maxLength: 4, type: 'password' })}</div><div className="row">{field('cardMonth', 'Mês de vencimento', { autoComplete: 'cc-exp-month', inputMode: 'numeric', maxLength: 2 })}{field('cardYear', 'Ano de vencimento', { autoComplete: 'cc-exp-year', inputMode: 'numeric', maxLength: 4 })}</div>{checkout.isError && <p className="error" role="alert">{checkout.error?.message} Seu carrinho foi mantido. Tente novamente.</p>}<div className="actions"><S.Button disabled={checkout.isLoading} type="submit">{checkout.isLoading ? 'Enviando pedido...' : 'Finalizar pagamento'}</S.Button><S.Button disabled={checkout.isLoading} className="back" type="button" onClick={() => { setStage('delivery'); setErrors({}) }}>Voltar para a edição de endereço</S.Button></div></S.CheckoutFormLayout></>}
    {stage === 'confirmation' && <div className="confirmation"><h2>Pedido realizado - {checkout.data?.orderId}</h2><p>Estamos felizes em informar que seu pedido já está em processo de preparação e, em breve, será entregue no endereço fornecido.</p><p>Gostaríamos de ressaltar que nossos entregadores não estão autorizados a realizar cobranças extras.</p><p>Lembre-se da importância de higienizar as mãos após o recebimento do pedido, garantindo assim sua segurança e bem-estar durante a refeição.</p><p>Esperamos que desfrute de uma deliciosa e agradável experiência gastronômica. Bom apetite!</p><S.Button onClick={close}>Concluir</S.Button></div>}
  </S.Sidebar></S.Backdrop></OverlayFocus>
}

