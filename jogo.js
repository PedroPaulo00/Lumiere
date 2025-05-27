class Carousel {
    constructor() {
        this.currentIndex = 0;
        this.images = document.querySelectorAll('.carousel-img');
        if (this.images.length > 0) {
            this.showImage(this.currentIndex);
            this.startAutoPlay();
        } else {
            console.warn("Carousel: No images found with class '.carousel-img'.");
        }
    }

    showImage(index) {
        this.images.forEach((img, i) => {
            img.classList.remove('active');
            if (i === index) {
                img.classList.add('active');
            }
        });
    }

    startAutoPlay() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervalId = setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
            this.showImage(this.currentIndex);
        }, 5000);
    }

    stopAutoPlay() {
        clearInterval(this.intervalId);
    }
}

class Timer {
    constructor(initialTime = 120) { 
        this.initialTime = initialTime;
        this.timeLeft = initialTime;
        this.timerElement = document.querySelector('.timer');
        this.scoreElement = null; 
        this.intervalId = null;
        this.isPaused = false;

        this._createScoreElement();
        this.updateDisplay();
    }

    _createScoreElement() {
        this.scoreElement = document.createElement('div');
        this.scoreElement.className = 'score-counter';
        if (this.timerElement && this.timerElement.parentElement) {
            this.timerElement.parentElement.insertBefore(this.scoreElement, this.timerElement.nextSibling);
        } else {
            console.error("Timer: '.timer' element not found or has no parent.");
        }
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;

        if (this.timerElement) {
            this.timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }

        if (this.scoreElement) {
            if (this.timeLeft > 0) {
                 this.scoreElement.textContent = `Pontuação da rodada: ${this.timeLeft} pontos`;
            }
            this.scoreElement.classList.remove('game-over'); 
        }
    }

    _tick() {
        if (this.isPaused) return; 

        this.timeLeft--;
        this.updateDisplay();

        if (this.timeLeft <= 0) {
            this.timeLeft = 0; 
            this.stopTimer();
            if (this.timerElement) {
                this.timerElement.textContent = "00:00"; 
            }
            if (this.scoreElement) {
                this.scoreElement.textContent = "Você não pontuou neste filme 😢";
                this.scoreElement.classList.add('game-over');
            }
        }
    }

    startTimer() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.isPaused = false;
        this.updateDisplay();
        this.intervalId = setInterval(() => this._tick(), 1000);
    }

    pauseTimer() {
        if (!this.isPaused) {
            clearInterval(this.intervalId);
            this.isPaused = true;
            console.log("Timer paused");
        }
    }

    resumeTimer() {
        if (this.isPaused && this.timeLeft > 0) {
            this.isPaused = false;
            this.intervalId = setInterval(() => this._tick(), 1000);
            console.log("Timer resumed");
        }
    }

    stopTimer() {
        clearInterval(this.intervalId);
        this.intervalId = null; 
    }

    resetTimer(newTime = this.initialTime) {
        this.stopTimer();
        this.timeLeft = newTime;
        this.initialTime = newTime; 
        this.isPaused = false;
        this.updateDisplay();
    }
}

class PopupManager {
    constructor() {
        this.infoButton = document.querySelector('.info-button'); 
        this.calendarButton = document.querySelector('.calendar-button');
        this.infoPopup = document.querySelector('.info-popup');
        this.calendarPopup = document.querySelector('.calendar-popup');
        this.closeInfoButton = document.querySelector('.close-info');
        this.closeCalendarButton = document.querySelector('.close-calendar');

        this.setupEvents();
    }

    setupEvents() {
        if (this.infoButton && this.infoPopup) {
            this.infoButton.addEventListener('click', () => {
                this.infoPopup.style.display = 'flex';
                if (this.calendarPopup) this.calendarPopup.style.display = 'none';
            });
        }

        if (this.calendarButton && this.calendarPopup) {
            this.calendarButton.addEventListener('click', () => {
                this.calendarPopup.style.display = 'flex';
                if (this.infoPopup) this.infoPopup.style.display = 'none';
            });
        }

        if (this.closeInfoButton && this.infoPopup) {
            this.closeInfoButton.addEventListener('click', () => {
                this.infoPopup.style.display = 'none';
            });
        }

        if (this.closeCalendarButton && this.calendarPopup) {
            this.closeCalendarButton.addEventListener('click', () => {
                this.calendarPopup.style.display = 'none';
            });
        }

        [this.infoPopup, this.calendarPopup].forEach(popup => {
            if (popup) {
                popup.addEventListener('click', (e) => {
                    if (e.target === popup) { 
                        popup.style.display = 'none';
                    }
                });
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const carousel = new Carousel();
    const gameTimer = new Timer(120); 
    const popupManager = new PopupManager(); 

    gameTimer.startTimer();

    const pauseButton = document.querySelector('.pause-button');
    const pausePopupElement = document.getElementById('pausePopup');
    const resumeButton = document.querySelector('.resume-button'); 

    if (pauseButton && pausePopupElement && resumeButton) {
        pauseButton.addEventListener('click', () => {
            pausePopupElement.style.display = 'flex';
            gameTimer.pauseTimer();
            carousel.stopAutoPlay(); 
        });

        resumeButton.addEventListener('click', () => {
            pausePopupElement.style.display = 'none';
            gameTimer.resumeTimer();
            carousel.startAutoPlay(); 
        });
    } else {
        console.error('Pause UI elements not found. Pause functionality may not work.');
        if (!pauseButton) console.error('Pause button (.pause-button) not found.');
        if (!pausePopupElement) console.error('Pause popup (#pausePopup) not found.');
        if (!resumeButton) console.error('Resume button (.resume-button) not found.');
    }

    const submitGuessButton = document.querySelector('.submit-button');
    const guessInput = document.querySelector('.guess-input');
    if (submitGuessButton && guessInput) {
        submitGuessButton.addEventListener('click', () => {
            const guess = guessInput.value;
            if (guess.trim() === "") {
                console.log("Por favor, insira um palpite.");
                return;
            }
            console.log(`Palpite enviado: ${guess}`);
            guessInput.value = ""; 
        });
    }
});
