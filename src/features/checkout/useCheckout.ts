import { useEffect, useRef, useState } from 'react'
import type { CheckoutPayload, CheckoutResponse } from '../../domain/contracts'
import { createEfoodClient, EfoodApiError, type ApiErrorData, type EfoodClient } from '../../services/client'

const defaultClient = createEfoodClient()
type CheckoutState = {
  isLoading: boolean
  data?: CheckoutResponse
  error?: ApiErrorData
}

// O POST fica fora do Redux/DevTools para que os dados do cartão não sejam
// transportados por actions nem incluídos no cache global de consultas.
export function useCheckout(client: EfoodClient = defaultClient) {
  const [state, setState] = useState<CheckoutState>({ isLoading: false })
  const controller = useRef<AbortController | null>(null)
  const pending = useRef<Promise<CheckoutResponse> | null>(null)
  useEffect(() => () => { controller.current?.abort() }, [])

  function submit(payload: CheckoutPayload): Promise<CheckoutResponse> {
    if (pending.current) return pending.current
    const abort = new AbortController()
    controller.current = abort
    setState({ isLoading: true })
    const operation = client.checkout(payload, abort.signal).then(data => {
      if (!abort.signal.aborted) setState({ isLoading: false, data })
      return data
    }).catch(error => {
      if (!abort.signal.aborted) setState({ isLoading: false, error: error instanceof EfoodApiError
        ? error.data : { status: 'NETWORK_ERROR', message: 'Não foi possível concluir o pedido.' } })
      throw error
    }).finally(() => { pending.current = null })
    pending.current = operation
    return operation
  }

  function reset() {
    if (!pending.current) setState({ isLoading: false })
  }

  return { submit, ...state, isError: Boolean(state.error), reset }
}
