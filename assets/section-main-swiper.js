/**
 * Main Swiper Section - Swiper.js initialization
 */
class MainSwiperSection extends HTMLElement {
  constructor() {
    super();
    this.swiperInstance = null;
  }

  connectedCallback() {
    this.swiperEl = this.querySelector('.swiper');
    if (!this.swiperEl) return;

    this.initSwiper();
  }

  initSwiper() {
    if (typeof Swiper === 'undefined') {
      setTimeout(() => this.initSwiper(), 50);
      return;
    }

    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }

    const autoplay = this.swiperEl.dataset.autoplay === 'true';
    const speed = parseInt(this.swiperEl.dataset.speed || 5, 10) * 1000;
    const navigation = this.swiperEl.dataset.navigation !== 'false';
    const pagination = this.swiperEl.dataset.pagination !== 'false';
    const slidesCount = this.swiperEl.querySelectorAll('.swiper-slide').length;

    if (slidesCount === 0) return;

    const config = {
      loop: slidesCount > 1,
      slidesPerView: 1,
      spaceBetween: 0,
      effect: 'slide',
      speed: 500,
      grabCursor: true,
      pagination: pagination && slidesCount > 1
        ? {
            el: this.swiperEl.querySelector('.swiper-pagination'),
            clickable: true,
          }
        : false,
      navigation:
        navigation && slidesCount > 1
          ? {
              nextEl: this.swiperEl.querySelector('.swiper-button-next'),
              prevEl: this.swiperEl.querySelector('.swiper-button-prev'),
            }
          : false,
      autoplay:
        autoplay && slidesCount > 1
          ? {
              delay: speed,
              disableOnInteraction: false,
            }
          : false,
      on: {
        init: () => {
          this.dispatchEvent(new CustomEvent('swiper:ready'));
        },
      },
    };

    this.swiperInstance = new Swiper(this.swiperEl, config);
  }

  disconnectedCallback() {
    if (this.swiperInstance) {
      this.swiperInstance.destroy(true, true);
      this.swiperInstance = null;
    }
  }
}

customElements.define('main-swiper-section', MainSwiperSection);

// Theme Editor: Re-initialize when section is loaded/reloaded
document.addEventListener('shopify:section:load', (event) => {
  const section = event.target?.querySelector('main-swiper-section');
  if (section && typeof section.initSwiper === 'function') {
    section.initSwiper();
  }
});

document.addEventListener('shopify:section:reorder', () => {
  document.querySelectorAll('main-swiper-section').forEach((section) => {
    if (typeof section.initSwiper === 'function') {
      section.initSwiper();
    }
  });
});
