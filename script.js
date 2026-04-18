const slides = document.querySelectorAll('.Slide')
const prevButton = document.getElementById('PrevButton')
let currentSlide = 0

const lista = document.getElementById('lista')
const totalElemento = document.getElementById('total')
const modal = document.getElementById('modal')
const titulo = document.getElementById('modalTitulo')
const descricao = document.getElementById('modalDescricao')
const preco = document.getElementById('modalPreco')
const botaoAdicionar = document.getElementById('adicionarCarrinho')
let itemAtual = null

const updateSlides = (index) => {
  slides.forEach((slide, idx) => {
    slide.classList.toggle('on', idx === index)
  })
}

const changeSlide = (direction) => {
  currentSlide = (currentSlide + direction + slides.length) % slides.length
  updateSlides(currentSlide)
}

prevButton?.addEventListener('click', () => changeSlide(-1))
updateSlides(currentSlide)

const itemObserver = new IntersectionObserver(
  (entries) => {
    const visibles = entries.filter((entry) => entry.isIntersecting)

    visibles.forEach((entry, index) => {
      const item = entry.target

      if (!item.classList.contains('show')) {
        item.style.transitionDelay = `${index * 0.1}s`
        item.classList.add('show')

        setTimeout(() => {
          item.style.transitionDelay = '0s'
          item.classList.add('finished')
        }, 300)
      }
    })
  },
  { threshold: 0.2 },
)

const getValorNumerico = (preco) => {
  return Number(preco.replace('R$', '').replace(',', '.').trim()) || 0
}

const formatarReais = (valor) => {
  return valor.toFixed(2).replace('.', ',')
}

const carregarCarrinho = () => {
  return JSON.parse(localStorage.getItem('carrinho')) || []
}

const salvarCarrinho = (carrinho) => {
  localStorage.setItem('carrinho', JSON.stringify(carrinho))
}

const calcularTotal = () => {
  const carrinho = carregarCarrinho()

  const total = carrinho.reduce((acc, item) => {
    const valor = getValorNumerico(item.preco)
    const quantidade = item.quantidade || 1
    return acc + valor * quantidade
  }, 0)

  return formatarReais(total)
}

//const atualizarTotalCarrinho = () => {
  //if (!totalElemento) return

  //let total = 0
  //const itens = lista ? lista.querySelectorAll('.item-carrinho') : []

  //if (itens.length > 0) {
    //itens.forEach((itemDiv) => {
      //const precoTexto = itemDiv.querySelector('.preco')?.innerText || ''
      //const quantidadeTexto = itemDiv.querySelector('.quantidade')?.innerText || 'Quantidade: 1'
      //const quantidade = Number(quantidadeTexto.replace(/\D/g, '')) || 1

      //total += getValorNumerico(precoTexto) * quantidade
    //})
  //} else {
    //total = Number(calcularTotal().replace(',', '.'))
  //}

  //totalElemento.innerText = `R$ ${formatarReais(total)}`
//}

const atualizarTotalCarrinho = () => {
  if (!totalElemento) return

  totalElemento.innerText = `R$ ${calcularTotal()}`
}

const renderizarCarrinho = () => {
  if (!lista) return

  const carrinho = carregarCarrinho()
  lista.innerHTML = ''

  if (carrinho.length === 0) {
    lista.innerHTML = '<p class="vazio">Seu carrinho está vazio</p>'
    atualizarTotalCarrinho()
    return
  }

  carrinho.forEach((item, index) => {
    const quantidade = item.quantidade || 1
    const subtotal = getValorNumerico(item.preco) * quantidade

    const div = document.createElement('div')
    div.classList.add('item-carrinho')
    div.innerHTML = `
      <div class="item-dados">
        <h3>${item.nome}</h3>
        <p>${item.descricao}</p>
        <span class="preco">${item.preco}</span>
        <span class="subtotal">Total do item: R$ ${formatarReais(subtotal)}</span>
        <span class="quantidade">Quantidade: ${quantidade}</span>
      </div>
      <div class="botoes-item">
        <button class="diminuir" ${quantidade > 1 ? '' : 'disabled'}>-</button>
        <button class="aumentar">+</button>
        <button class="remover">Remover</button>
      </div>
    `

    const botaoDiminuir = div.querySelector('.diminuir')
    const botaoAumentar = div.querySelector('.aumentar')
    const botaoRemover = div.querySelector('.remover')

    botaoDiminuir?.addEventListener('click', () => {
      const carrinhoAtual = carregarCarrinho()
      const quantidadeAtual = carrinhoAtual[index].quantidade || 1

      if (quantidadeAtual > 1) {
        carrinhoAtual[index].quantidade = quantidadeAtual - 1
        salvarCarrinho(carrinhoAtual)
        renderizarCarrinho()
      }
    })

    botaoAumentar?.addEventListener('click', () => {
      const carrinhoAtual = carregarCarrinho()
      carrinhoAtual[index].quantidade = (carrinhoAtual[index].quantidade || 1) + 1
      salvarCarrinho(carrinhoAtual)
      renderizarCarrinho()
    })

    botaoRemover?.addEventListener('click', () => {
      const carrinhoAtual = carregarCarrinho()
      carrinhoAtual.splice(index, 1)
      salvarCarrinho(carrinhoAtual)
      renderizarCarrinho()
    })

    lista.appendChild(div)
    itemObserver.observe(div)
  })

  atualizarTotalCarrinho()
}

const abrirModalItem = (btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation()

    const item = btn.closest('.Item')
    if (!item) return

    itemAtual = {
      nome: item.querySelector('h3')?.innerText || '',
      descricao: item.querySelector('p')?.innerText || '',
      preco: item.querySelector('.preco')?.innerText || 'R$ 0,00',
      quantidade: 1,
    }

    titulo.innerText = itemAtual.nome
    descricao.innerText = itemAtual.descricao
    preco.innerText = itemAtual.preco
    modal?.classList.add('active')
  })
}

const adicionarAoCarrinho = () => {
  if (!itemAtual) return

  const carrinho = carregarCarrinho()
  const itemExistente = carrinho.find(
    (item) => item.nome === itemAtual.nome && item.preco === itemAtual.preco,
  )

  if (itemExistente) {
    itemExistente.quantidade = (itemExistente.quantidade || 1) + 1
  } else {
    carrinho.push({ ...itemAtual, quantidade: 1 })
  }

  salvarCarrinho(carrinho)
  renderizarCarrinho()
}

if (botaoAdicionar) {
  botaoAdicionar.addEventListener('click', () => {
    adicionarAoCarrinho()
    modal?.classList.remove('active')
  })
}

const botoes = document.querySelectorAll('.Item button')

botoes.forEach(abrirModalItem)

document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.Item')
  items.forEach((item) => itemObserver.observe(item))

  const fechar = document.getElementById('fechar')
  fechar?.addEventListener('click', () => {
    modal?.classList.remove('active')
  })

  renderizarCarrinho()
})

function irParaCarrinho() {
  window.location.href = 'carrinho.html'
}

function limparCarrinho() {
  localStorage.removeItem('carrinho')
  location.reload()
}
