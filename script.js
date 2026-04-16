const slides = document.querySelectorAll('.Slide')
const prevButton = document.getElementById('PrevButton')
let currentSlide = 0

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

document.addEventListener('DOMContentLoaded', () => {
  const items = document.querySelectorAll('.Item')

  const observer = new IntersectionObserver(
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
    {
      threshold: 0.2,
    },
  )

  items.forEach((item) => observer.observe(item))
})

let itemAtual = null

const botoes = document.querySelectorAll('.Item button')

const modal = document.getElementById('modal')
const titulo = document.getElementById('modalTitulo')
const descricao = document.getElementById('modalDescricao')
const preco = document.getElementById('modalPreco')

botoes.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation()

    const item = btn.closest('.Item')

    titulo.innerText = item.querySelector('h3').innerText
    descricao.innerText = item.querySelector('p').innerText
    preco.innerText = item.querySelector('.preco').innerText

    modal.classList.add('active')
  })
})

document.addEventListener('DOMContentLoaded', () => {
  const fechar = document.getElementById('fechar')
  const modal = document.getElementById('modal')

  fechar.addEventListener('click', () => {
    modal.classList.remove('active')
  })
})

botoes.forEach((btn) => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.Item')

    itemAtual = {
      nome: item.querySelector('h3').innerText,
      descricao: item.querySelector('p').innerText,
      preco: item.querySelector('.preco').innerText,
    }

    modal.classList.add('active')
  })
})

const botaoAdicionar = document.getElementById('adicionarCarrinho')

if (botaoAdicionar) {
  botaoAdicionar.addEventListener('click', () => {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || []

    carrinho.push(itemAtual)

    localStorage.setItem('carrinho', JSON.stringify(carrinho))

    alert('Item adicionado ao pedido!')

    modal.classList.remove('active')
  })
}

function irParaCarrinho() {
  window.location.href = 'carrinho.html'
}

if (lista) {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || []

  if (carrinho.length === 0) {
    lista.innerHTML = '<p class="vazio">Seu carrinho está vazio</p>'
  } else {
    carrinho.forEach((item) => {
      const div = document.createElement('div')
      div.classList.add('item-carrinho')

      div.innerHTML = `
        <h3>${item.nome}</h3>
        <p>${item.descricao}</p>
        <span>${item.preco}</span>
      `

      lista.appendChild(div)
    })
  }
}

const carrinho = JSON.parse(localStorage.getItem('carrinho')) || []

function limparCarrinho() {
  localStorage.removeItem('carrinho')
  location.reload()
}
