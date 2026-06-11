const slides = document.querySelectorAll('.slide-container');
let currentSlideIndex = 0;
let autoAdvanceTimer;
const AUTO_ADVANCE_DELAY = 3000;
let isPaused = false;

function resetAutoAdvance() {
    clearTimeout(autoAdvanceTimer);
    if (!isPaused) {
        autoAdvanceTimer = setTimeout(() => {
            handleNext();
        }, AUTO_ADVANCE_DELAY);
    }
}

function showSlide(index) {
    resetAutoAdvance();
    slides.forEach(s => s.classList.remove('active'));
    slides[index].classList.add('active');

    // Run counters for this slide
    const counters = slides[index].querySelectorAll('.counter');
    counters.forEach(counter => {
        counter.innerText = '0'; // reset
        const updateCounter = () => {
            const target = +counter.getAttribute('data-target');
            const c = +counter.innerText;
            const increment = target / 20;

            if (c < target) {
                counter.innerText = `${Math.ceil(c + increment)}`;
                setTimeout(updateCounter, 50);
            } else {
                counter.innerText = target;
            }
        };
        setTimeout(updateCounter, 300); // slight delay to allow slide animation
    });
}

function handleNext() {
    resetAutoAdvance();
    const activeSlide = slides[currentSlideIndex];
    const invisibleSteps = activeSlide.querySelectorAll('.step:not(.visible)');

    if (invisibleSteps.length > 0) {
        // Trigger drop downs / step values inside the slide one by one
        invisibleSteps[0].classList.add('visible');
    } else {
        // No steps left, move seamlessly to next slide layout
        if (currentSlideIndex < slides.length - 1) {
            currentSlideIndex++;
            showSlide(currentSlideIndex);
        }
    }
}

function handlePrev() {
    resetAutoAdvance();
    const activeSlide = slides[currentSlideIndex];
    const visibleSteps = activeSlide.querySelectorAll('.step.visible');
    let skippable = activeSlide.querySelectorAll('.default-visible.step.visible');

    if (visibleSteps.length > skippable.length) {
        visibleSteps[visibleSteps.length - 1].classList.remove('visible');
    } else {
        // Slide backwards safely
        if (currentSlideIndex > 0) {
            currentSlideIndex--;
            showSlide(currentSlideIndex);
            // Retain full visibility on backward trajectory
            const prevSteps = slides[currentSlideIndex].querySelectorAll('.step');
            prevSteps.forEach(st => st.classList.add('visible'));
        }
    }
}

// Button Listeners
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); handlePrev(); });
if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); handleNext(); });

// Global Interactive Listeners 
document.addEventListener('click', (e) => {
    // If the clicked element is a link or inside a link, let it behave naturally
    if (e.target.closest('a') || e.target.closest('.image-modal') || e.target.closest('.image-container img') || e.target.closest('.control-btn')) {
        return;
    }
    handleNext();
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'Enter') {
        handleNext();
    }
    if (e.key === 'ArrowLeft') {
        handlePrev();
    }
});

// Image Modal Logic
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const closeBtn = document.querySelector(".close-modal");
const clickableImages = document.querySelectorAll(".image-container img");

clickableImages.forEach(img => {
    img.addEventListener("click", function (e) {
        e.stopPropagation();
        modal.style.display = "flex";
        modalImg.src = this.src;
    });
});

if (closeBtn) {
    closeBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        modal.style.display = "none";
    });
}

if (modal) {
    modal.addEventListener("click", function (e) {
        if (e.target !== modalImg) {
            modal.style.display = "none";
        }
    });
}

slides.forEach(slide => {
    slide.addEventListener('mouseenter', () => {
        isPaused = true;
        clearTimeout(autoAdvanceTimer);
    });
    slide.addEventListener('mouseleave', () => {
        isPaused = false;
        resetAutoAdvance();
    });
});

// Fire presentation engine initialization
showSlide(0);
