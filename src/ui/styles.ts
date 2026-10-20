import styled, { createGlobalStyle } from 'styled-components'

export const colors = { red: '#e66767', cream: '#ffebd9', background: '#fff8f2', input: '#4b4b4b' }
export const GlobalStyle = createGlobalStyle`
  *{box-sizing:border-box}body{margin:0;color:${colors.red};background:${colors.background};font-family:Roboto,sans-serif;font-size:14px}
  button,input{font:inherit}button,a{-webkit-tap-highlight-color:transparent}button{cursor:pointer}button:disabled{cursor:wait;opacity:.65}
  a{color:inherit}h1,h2,h3,p{margin:0}button:focus-visible,a:focus-visible{outline:2px solid currentColor;outline-offset:3px}
  input:focus{outline:2px solid ${colors.input}}img{display:block}button{border:0}ul{list-style:none;padding:0;margin:0}
  .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
`
export const Container = styled.div`width:min(1024px,calc(100% - 32px));margin:0 auto;`
export const Hero = styled.header`
  height:360px;position:relative;overflow:hidden;text-align:center;background:${colors.cream};
  >img{position:absolute;left:0;top:-24px;pointer-events:none;max-width:none}
  a{position:absolute;top:40px;left:50%;transform:translateX(-50%)}
  h1{position:absolute;top:236px;left:16px;right:16px;font-size:36px;line-height:42px;font-weight:900}
  @media(max-width:600px){height:300px;h1{top:180px;font-size:28px;line-height:34px}}
`
export const Header = styled.header`
  height:162px;position:relative;overflow:hidden;background:${colors.cream};
  >img{position:absolute;left:0;top:-23px;max-width:none;pointer-events:none}
  ${Container}{height:100%;position:relative;display:grid;grid-template-columns:1fr auto 1fr;align-items:start;padding-top:40px}
  a:first-child,button{margin-top:19px;font-size:18px;font-weight:900;text-decoration:none}
  button{justify-self:end;text-align:right;color:${colors.red};background:none;padding:0}
  @media(max-width:650px){height:150px;${Container}{grid-template-columns:1fr 1fr;padding-top:20px;gap:20px}.brand{grid-column:1/-1;grid-row:1;justify-self:center}a:first-child,button{margin:0;font-size:14px}}
`
export const RestaurantGrid = styled(Container)`display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:80px;row-gap:48px;padding-top:80px;padding-bottom:120px;@media(max-width:800px){gap:32px;grid-template-columns:1fr;padding-top:40px;padding-bottom:64px;max-width:560px}`
export const RestaurantCard = styled.article`
  min-width:0;.cover{position:relative;height:217px}.cover>img{width:100%;height:100%;object-fit:cover}.tags{position:absolute;right:16px;top:16px;display:flex;gap:8px}
  .tag{background:${colors.red};color:${colors.cream};padding:6px 8px;font-size:12px;line-height:14px;font-weight:700;text-transform:capitalize}
  .body{background:white;border:1px solid ${colors.red};border-top:0;padding:8px}.title{display:flex;justify-content:space-between;align-items:center;gap:8px;height:21px}
  h2{font-size:18px;line-height:21px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.rating{font-size:18px;font-weight:700;display:flex;gap:8px;align-items:center;flex-shrink:0}
  p{font-size:14px;line-height:22px;margin:16px 0;height:88px;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
  .more{display:inline-flex;align-items:center;justify-content:center;height:24px;padding:0 6px;background:${colors.red};color:${colors.cream};font-weight:700;text-decoration:none}
`
export const RestaurantHero = styled.section`
  height:280px;position:relative;color:white;>img{position:absolute;width:100%;height:100%;object-fit:cover}.shade{position:absolute;inset:0;background:rgba(0,0,0,.5)}
  ${Container}{position:relative;height:100%;padding:24px 0 32px;display:flex;flex-direction:column;justify-content:space-between}
  p{font-size:32px;line-height:38px;font-weight:100;text-transform:capitalize}h1{font-size:32px;line-height:38px;font-weight:900}
`
export const ProductGrid = styled(Container)`display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px;padding-top:56px;padding-bottom:120px;@media(max-width:850px){grid-template-columns:repeat(2,minmax(0,1fr))}@media(max-width:560px){grid-template-columns:1fr;max-width:420px;padding-top:32px;padding-bottom:64px}`
export const ProductCard = styled.article`
  background:${colors.red};color:${colors.cream};padding:8px;min-width:0;border-radius:8px;
  >img{height:167px;width:100%;object-fit:cover;border-radius:8px}h2{font-size:16px;line-height:19px;font-weight:900;margin:8px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  p{font-size:14px;line-height:22px;height:88px;margin-bottom:8px;display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
`
export const Button = styled.button`min-height:24px;padding:4px 8px;background:${colors.cream};color:${colors.red};font-size:14px;line-height:16px;font-weight:700;width:100%;`
export const Footer = styled.footer`
  min-height:298px;padding:40px 16px;text-align:center;background:${colors.cream};.brand{display:inline-block}.socials{display:flex;justify-content:center;gap:8px;margin-top:32px}
  p{font-size:10px;line-height:12px;max-width:480px;margin:80px auto 0}
`
export const Status = styled(Container)`padding:80px 0;min-height:280px;text-align:center;font-size:18px;p{margin-bottom:20px}button{width:auto}`
export const Backdrop = styled.div`position:fixed;inset:0;background:rgba(0,0,0,.8);z-index:100;`
export const OverlayButton = styled.button`position:absolute;inset:0;background:transparent;width:100%;height:100%;cursor:default;`
export const ModalPosition = styled(Backdrop)`display:grid;place-items:center;padding:16px;overflow:auto;`
export const ModalBox = styled.section`
  position:relative;width:min(1024px,100%);min-height:344px;padding:32px;background:${colors.red};color:white;display:grid;grid-template-columns:280px 1fr;gap:24px;
  .product-photo{width:280px;height:280px;object-fit:cover}h2{font-size:18px;line-height:21px;font-weight:900;margin-bottom:16px}p{font-size:14px;line-height:22px}.portion{margin:22px 0 16px}button.add{width:auto}
  .close{position:absolute;top:8px;right:8px;background:none;padding:0}.close img{width:16px;height:16px}
  @media(max-width:700px){display:block;max-width:500px;padding:28px 20px;.product-photo{width:100%;height:220px;margin-bottom:20px}}
`
export const Sidebar = styled.aside`
  position:absolute;right:0;top:0;bottom:0;width:min(360px,100%);background:${colors.red};color:${colors.cream};padding:32px 8px;overflow:auto;
  h2{font-size:16px;font-weight:700;line-height:19px;margin-bottom:16px}.total{display:flex;justify-content:space-between;font-weight:700;margin:40px 0 16px}
  .back{margin-top:8px}.error{font-size:13px;line-height:18px;margin:8px 0 16px}.confirmation p{font-size:14px;line-height:22px;margin-bottom:22px}.confirmation button{margin-top:2px}
`
export const CartRow = styled.li`
  position:relative;display:flex;gap:8px;padding:8px;background:${colors.cream};color:${colors.red};min-height:100px;margin-bottom:16px;
  >img{width:80px;height:80px;object-fit:cover}h3{font-size:18px;line-height:21px;font-weight:900;margin-bottom:16px;overflow-wrap:anywhere;padding-right:4px}p{line-height:22px}button{position:absolute;right:8px;bottom:8px;padding:0;background:none}button img{width:16px;height:16px}
`
export const CheckoutFormLayout = styled.form`
  label{font-weight:700;display:block;margin-bottom:8px;line-height:16px}input{display:block;background:${colors.cream};color:${colors.input};border:0;width:100%;height:32px;padding:8px;font-weight:700;margin-top:8px;border-radius:0;min-width:0}
  input[aria-invalid=true]{outline:2px solid #7a1515}small{display:block;margin-top:4px;font-weight:400;font-size:12px}.row{display:grid;grid-template-columns:1fr 1fr;gap:34px}.card-row{display:grid;grid-template-columns:1fr 87px;gap:30px}.actions{margin-top:24px}
`
