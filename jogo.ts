type Nullable<T> = T | null;

class Carousel {
    private currentIndex: number = 0;
    private images: NodeListOf<HTMLImageElement>;
    private intervalId?: number; 

    constructor() {
        this.images = document.querySelectorAll<HTMLImageElement>('.carousel-img');
        if (this.images.length > 0) {
            this.showImage(this.currentIndex);
            this.startAutoPlay();
        } else {
            console.warn("Carousel: Nenhuma imagem encontrada com a classe '.carousel-img'.");
        }
    }

    private showImage(index: number): void {
        this.images.forEach((img: HTMLImageElement, i: number) => {
            img.classList.remove('active');
            if (i === index) {
                img.classList.add('active');
            }
        });
    }

    public startAutoPlay(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervalId = window.setInterval(() => {
            this.currentIndex = (this.currentIndex + 1) % this.images.length;
            this.showImage(this.currentIndex);
        }, 5000);
    }

    public stopAutoPlay(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = undefined; 
        }
    }
}

class Timer {
    private initialTime: number;
    public timeLeft: number; 
    private timerElement: Nullable<HTMLDivElement>;
    private scoreElement: Nullable<HTMLDivElement>;
    private intervalId: Nullable<number> = null; 
    private isPaused: boolean = false;

    constructor(initialTime: number = 120) { 
        this.initialTime = initialTime;
        this.timeLeft = initialTime;
        this.timerElement = document.querySelector<HTMLDivElement>('.timer');
        this.scoreElement = null; 

        this._createScoreElement();
        this.updateDisplay();
    }

    private _createScoreElement(): void {
        this.scoreElement = document.createElement('div');
        this.scoreElement.className = 'score-counter';
        if (this.timerElement && this.timerElement.parentElement) {
            this.timerElement.parentElement.insertBefore(this.scoreElement, this.timerElement.nextSibling);
        } else {
            console.error("Timer: Elemento '.timer' não encontrado ou não tem pai.");
        }
    }

    public updateDisplay(): void {
        const minutes: number = Math.floor(this.timeLeft / 60);
        const seconds: number = this.timeLeft % 60;

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

    private _tick(): void {
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
            console.log("Tempo esgotado!");
        }
    }

    public startTimer(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.isPaused = false;
        this.updateDisplay();
        this.intervalId = window.setInterval(() => this._tick(), 1000);
    }

    public pauseTimer(): void {
        if (!this.isPaused && this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null; 
            this.isPaused = true;
            console.log("Timer pausado");
        }
    }

    public resumeTimer(): void {
        if (this.isPaused && this.timeLeft > 0) {
            this.isPaused = false;
            if (this.intervalId) clearInterval(this.intervalId);
            this.intervalId = window.setInterval(() => this._tick(), 1000);
            console.log("Timer retomado");
        }
    }

    public stopTimer(): void {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        console.log("Timer parado");
    }

    public resetTimer(newTime: number = this.initialTime): void {
        this.stopTimer();
        this.timeLeft = newTime;
        if (newTime !== this.initialTime) {
          this.initialTime = newTime;
        }
        this.isPaused = false;
        this.updateDisplay();
        console.log("Timer resetado");
    }
}

class PopupManager {
    private infoButton: Nullable<HTMLButtonElement>;
    private calendarButton: Nullable<HTMLButtonElement>;
    private infoPopup: Nullable<HTMLDivElement>;
    private calendarPopup: Nullable<HTMLDivElement>;
    private closeInfoButton: Nullable<HTMLSpanElement>;
    private closeCalendarButton: Nullable<HTMLSpanElement>;

    constructor() {
        this.infoButton = document.querySelector<HTMLButtonElement>('.info-button');
        this.calendarButton = document.querySelector<HTMLButtonElement>('.calendar-button');
        this.infoPopup = document.querySelector<HTMLDivElement>('.info-popup');
        this.calendarPopup = document.querySelector<HTMLDivElement>('.calendar-popup');
        this.closeInfoButton = document.querySelector<HTMLSpanElement>('.close-info');
        this.closeCalendarButton = document.querySelector<HTMLSpanElement>('.close-calendar');

        this.setupEvents();
    }

    private setupEvents(): void {
        if (this.infoButton && this.infoPopup) {
            const infoPopupRef = this.infoPopup; // Evitar problemas de 'this' em closures
            const calendarPopupRef = this.calendarPopup;
            this.infoButton.addEventListener('click', () => {
                infoPopupRef.style.display = 'flex';
                if (calendarPopupRef) calendarPopupRef.style.display = 'none';
            });
        }

        if (this.calendarButton && this.calendarPopup) {
            const calendarPopupRef = this.calendarPopup;
            const infoPopupRef = this.infoPopup;
            this.calendarButton.addEventListener('click', () => {
                calendarPopupRef.style.display = 'flex';
                if (infoPopupRef) infoPopupRef.style.display = 'none';
            });
        }

        if (this.closeInfoButton && this.infoPopup) {
            const infoPopupRef = this.infoPopup;
            this.closeInfoButton.addEventListener('click', () => {
                infoPopupRef.style.display = 'none';
            });
        }

        if (this.closeCalendarButton && this.calendarPopup) {
            const calendarPopupRef = this.calendarPopup;
            this.closeCalendarButton.addEventListener('click', () => {
                calendarPopupRef.style.display = 'none';
            });
        }

        [this.infoPopup, this.calendarPopup].forEach(popup => {
            if (popup) {
                const popupRef = popup;
                popupRef.addEventListener('click', (e: MouseEvent) => {
                    if (e.target === popupRef) {
                        popupRef.style.display = 'none';
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

    const pauseButton = document.querySelector<HTMLButtonElement>('.pause-button');
    const pausePopupElement = document.getElementById('pausePopup') as Nullable<HTMLDivElement>; // Type assertion
    const resumeButton = document.querySelector<HTMLButtonElement>('.resume-button');

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
        console.error('Elementos da UI de pause não encontrados. Funcionalidade pode não operar.');
        if (!pauseButton) console.error('Botão de Pause (.pause-button) não encontrado.');
        if (!pausePopupElement) console.error('Popup de Pause (#pausePopup) não encontrado.');
        if (!resumeButton) console.error('Botão de Retomar (.resume-button) não encontrado.');
    }

    const submitGuessButton = document.querySelector<HTMLButtonElement>('.submit-button');
    const guessInput = document.querySelector<HTMLInputElement>('.guess-input');

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

