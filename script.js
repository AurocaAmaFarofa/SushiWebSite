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
            item.style.transitionDelay = '0s' // 👈 REMOVE O DELAY
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
