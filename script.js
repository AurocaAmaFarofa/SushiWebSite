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
