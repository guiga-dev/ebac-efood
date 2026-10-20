const asset = (name: string) => `${import.meta.env.BASE_URL}assets/${name}`
export const assets = {
  logo: asset('04e27.svg'), homeBackground: asset('bdb5c.svg'), headerBackground: asset('b1d93.svg'),
  star: asset('87f47.svg'), instagram: asset('748b6.svg'), facebook: asset('009e2.svg'), twitter: asset('0f00a.svg'),
  close: asset('11b46.png'), trash: asset('7aae3.png')
}
export const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
