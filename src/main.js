import "./css/index.css"
import IMask from 'imask'
/* o vite importou o arquivo index.css,
 que por sua vez importou o restante 
 -> sem uso de link no html */
const ccBgColor01 = document.querySelector(".cc-bg svg > g g:nth-child(1) path")
const ccBgColor02 = document.querySelector(".cc-bg svg > g g:nth-child(2) path")
const ccLogo = document.querySelector(".cc-logo span:nth-child(2) img")

function setCardType(type){
  const colors = {
    visa: ["#436D99", "#2D57F2"],
    mastercard: ["#DF6F29", "#C69347"],
    default: ["black", "gray"]
  }
  //modifica uma propriedade
  ccBgColor01.setAttribute("fill", colors[type][0]) // colors.type
  ccBgColor02.setAttribute("fill", colors[type][1])
  ccLogo.setAttribute("src", `cc-${type}.svg`)
}
// faz com que a função seja disponivel no console
globalThis.setCardType = setCardType

const securityCode = document.querySelector('#security-code') 
const securityCodePattern = {
  mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern)

const expirationDate = document.querySelector('#expiration-date')
const expirationDatePattern = {
  mask: "MM{/}YY",
  blocks: {
    YY: {
      mask: IMask.MaskedRange,
      from: String(new Date().getFullYear()).slice(2),
      to: String(new Date().getFullYear() + 10).slice(2)
    },
    MM: {
      mask: IMask.MaskedRange,
      from: 1,
      to: 12,
    },
  }

}
const expirationDateMasked = IMask(expirationDate, expirationDatePattern)

const cardNumber = document.querySelector("#card-number")
const cardNumberPattern = {
  mask: [
    {
      mask: "0000 0000 0000 0000",
      regex: /^4\d{0,15}/,
      cardtype: "visa",
    },
    {
      mask: "0000 0000 0000 0000",
      regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|^2[3-7]\d{0,2})\d{0,12}/,
      cardtype: "mastercard",
    },
    {
      mask: "0000 0000 0000 0000",
      cardtype: "default",
    }
  ],
  // oque são appended e dynamicMasked, são exclusivos do imask?
  dispatch: function(appended, dynamicMasked){
    const number = (dynamicMasked.value + appended).replace(/\D/g,"") // toda letra que for digitada vai ser trocada para ''(vazio)
    const foundMask = dynamicMasked.compiledMasks.find(function (item){
      return number.match(item.regex)
    })
    
    console.log(foundMask)

    return foundMask
  },
}
const cardNumberMasked = IMask(cardNumber, cardNumberPattern)


const addButton = document.querySelector("#add-card")
addButton.addEventListener("click", () => {

})

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault() // previne o evento padrão de reload ao clicar em um botão -> toda vez que se clicar num botão é dado um submit no formulário e aquela ação de reload é acionada
})
const cardHolder = document.querySelector("#card-holder")
cardHolder.addEventListener("input", () => {
  const ccHolder = document.querySelector(".cc-holder .value")

  // ccHolder.innerText = cardHolder.value ==>> isso funciona por que cada letra digitada é um input, então cada letra digitada no cardHolder é capturada e adiciona no ccHolder
  ccHolder.innerText = cardHolder.value.length === 0 ? "FULANO DA SILVA" : cardHolder.value;

  /*
  ccHolder.innerText = cardHolder.value é uma string por isso que o length funciona.
  === significa que vai ser verificado se o valor é 0 e se o tipo é inteirot
  */
})
securityCodeMasked.on("accept", () => {
  updateSecurityCode(securityCodeMasked.value)
})

function updateSecurityCode(code){
  const ccSecurity = document.querySelector(".cc-security .value")
  ccSecurity.innerText  = code.length === 0 ? "123" : code
}

cardNumberMasked.on("accept", () => {
  const cardType = cardNumberMasked.masked.currentMask.cardtype
  setCardType(cardType)
  updateCardNumber(cardNumberMasked.value)
})

function updateCardNumber(number) {
  const ccNumber= document.querySelector(".cc-number")
  ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number
}

expirationDateMasked.on("accept", () => {
  updateExpirationDate(expirationDateMasked.value)
})

function updateExpirationDate(date){
    const ccExpiration = document.querySelector(".cc-extra .value")
    ccExpiration.innerText = date.length === 0 ? "02/32" : date
}
//git remote --v para ver a qual  repositorio o clone feito esta vinculado
// git remote set-url origin https://github.com/YuriHyuuga/explore-lab-01.git (endereco do repositorio)
