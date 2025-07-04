const observer = new IntersectionObserver(entries => {
	const visibleEntries = entries
		.filter(entry => entry.isIntersecting)
		.sort((a, b) => a.target.dataset.index - b.target.dataset.index)

	visibleEntries.forEach((entry, index) => {
		setTimeout(() => {
			entry.target.classList.add('animate')
			observer.unobserve(entry.target)
		}, index * 150)
	})
})

const setAnimate = () => {
	document.querySelectorAll('.fade-down').forEach((el, index) => {
		el.classList.remove('animate');
		el.dataset.index = index;
		observer.unobserve(el); // Отписываемся, если наблюдали
		observer.observe(el);   // Подписываемся заново
	});
};

if (window.innerWidth > 1199) {
	setAnimate()
}


const sectionsSwitcher = {

	isSwitching: false,
	currentIndex: 0,
	activeIndex: 0,
	stickCount: 0,

	init() {
		this.sections = document.querySelectorAll('.section');
		this.initWindowWheelHandler();
		this.processSwitchingClassNames();
	},

	initWindowWheelHandler() {
		window.addEventListener('wheel', (e) => {
			this.offsetWheelEvnet = setTimeout(() => {
				const currentSection = this.sections[this.currentIndex];
				const inner = currentSection.querySelector('.section-inner');
				const scrollHeight = inner.scrollHeight;
				const canScrollInside = scrollHeight > window.innerHeight;
				if (canScrollInside) {
					const scrollY = currentSection.scrollTop;
					const unFitHeight = scrollHeight - window.innerHeight;
					if (e.deltaY > 0 && scrollY >= unFitHeight) {
						if (!this.sections[this.currentIndex].nextElementSibling) return
						this.increaseActiveIndex();
						this.processSwitchingClassNames();
						setAnimate()
					} else if (e.deltaY < 0 && scrollY <= 0) {
						if (!this.sections[this.currentIndex].previousElementSibling) return
						this.decreaseActiveIndex();
						this.processSwitchingClassNames();
						setAnimate()
					}
				} else {
					if (e.deltaY > 0) {
						this.increaseActiveIndex();
						this.processSwitchingClassNames();
					} else if (e.deltaY < 0) {
						this.decreaseActiveIndex();
						this.processSwitchingClassNames();
						setAnimate()
					}
				}

			}, { passive: false });
		}, 200);
	},

	processSwitchingClassNames() {
		this.sections[this.currentIndex].classList.remove('active');
		setTimeout(() => {
			this.sections[this.currentIndex].classList.remove('show');
		}, 10);
		setTimeout(() => {
			this.sections[this.activeIndex].classList.add('show');
			setTimeout(() => {
				this.sections[this.activeIndex].classList.add('active');
			}, 20);

			this.currentIndex = this.activeIndex;
		}, 20);
	},

	decreaseActiveIndex() {
		if (this.activeIndex - 1 >= 0) { this.activeIndex-- }
	},

	increaseActiveIndex() {
		if (this.activeIndex + 1 < this.sections.length) { this.activeIndex++ }
	},

};

if (window.innerWidth > 1199) {
	sectionsSwitcher.init();
}


const swiperVideos = new Swiper(".videos .swiper", {
	slidesPerView: 3,
	spaceBetween: 25,
	navigation: {
		nextEl: ".videos .swiper-button-next",
		prevEl: ".videos .swiper-button-prev",
	},
	breakpoints: {
		320: {
			slidesPerView: 1.1,
			spaceBetween: 15
		},
		575: {
			slidesPerView: 2,
			spaceBetween: 30
		},
		767: {
			slidesPerView: 2.5,
			spaceBetween: 30
		},
		991: {
			slidesPerView: 3,
			spaceBetween: 60
		},
	},
})

const setOpacityExtremeSlide = (swiperSelector, activeIndex) => {
	const swiper = document.querySelector(swiperSelector)
	const slides = swiper.querySelectorAll('.swiper-slide')

	slides.forEach(slide => {
		slide.classList.remove('opacity')
	})

	if (slides[activeIndex + 3]) {
		slides[activeIndex + 3].classList.add('opacity')
	}
}

setOpacityExtremeSlide('.videos .swiper', 0)

swiperVideos.on('slideChange', function () {
	console.log('Слайд сменился. Активный индекс:', this.activeIndex)
	setOpacityExtremeSlide('.videos .swiper', this.activeIndex)
})