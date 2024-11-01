document.addEventListener('DOMContentLoaded', function(){ 
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButton = document.querySelector('#send');

    const thankYouModal = document.createElement('div');
    thankYouModal.id = 'thankYouModal';
    thankYouModal.classList.add('modal');
    thankYouModal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
                <div class="modal-body text-center">
                    <h5>Дякуємо за ваші відповіді!</h5>
                </div>
            </div>
        </div>
    `;
    thankYouModal.style.display = 'none';
    document.body.appendChild(thankYouModal);

    const questions = [
        {
            question: "Якого кольору бургер?",
            answers: [
                { title: 'Стандарт', url: './image/burger.png' },
                { title: 'Чорний', url: './image/burgerBlack.png' }
            ],
            type: 'radio'
        },
        {
            question: "З якого м'яса котлета?",
            answers: [
                { title: 'Курка', url: './image/chickenMeat.png' },
                { title: 'Яловичина', url: './image/beefMeat.png' },
                { title: 'Свинина', url: './image/porkMeat.png' }
            ],
            type: 'radio'
        },
        {
            question: "Додаткові інгредієнти?",
            answers: [
                { title: 'Помідор', url: './image/tomato.png' },
                { title: 'Огірок', url: './image/cucumber.png' },
                { title: 'Салат', url: './image/salad.png' },
                { title: 'Цибуля', url: './image/onion.png' }
            ],
            type: 'checkbox'
        },
        {
            question: "Додати соус?",
            answers: [
                { title: 'Часниковий', url: './image/sauce1.png' },
                { title: 'Томатний', url: './image/sauce2.png' },
                { title: 'Гірчичний', url: './image/sauce3.png' }
            ],
            type: 'radio'
        }
    ];

    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
        openTest();
    });

    closeModal.addEventListener('click', () => {
        modalBlock.classList.remove('d-block');
    });

    const openTest = () => {
        const finalAnswers = [];
        let numberQuestion = 0;

        const updateButtonsVisibility = () => {
            switch (true) {
                case numberQuestion === 0:
                    prevButton.style.display = 'none';
                    nextButton.style.display = 'block';
                    sendButton.classList.add('d-none');
                    break;
        
                case numberQuestion > 0 && numberQuestion < questions.length:
                    prevButton.style.display = 'block';
                    nextButton.style.display = 'block';
                    sendButton.classList.add('d-none');
                    break;
        
                case numberQuestion === questions.length:
                    prevButton.style.display = 'none';
                    nextButton.style.display = 'none';
                    sendButton.classList.remove('d-none');
                    break;
        
                default:
                    prevButton.style.display = 'block';
                    nextButton.style.display = 'block';
                    sendButton.classList.add('d-none');
                    break;
            }
        };        

        const renderAnswers = (index) => {
            formAnswers.innerHTML = '';
            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement('div');
                answerItem.classList.add('answers-item', 'd-flex', 'justify-content-center');

                answerItem.innerHTML = `
                    <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none" value="${answer.title}">
                    <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                        <img class="answerImg" src="${answer.url}" alt="${answer.title}">
                        <span>${answer.title}</span>
                    </label>
                `;
                formAnswers.appendChild(answerItem);
            });
        };

        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = '';
            questionTitle.textContent = questions[indexQuestion].question;
            renderAnswers(indexQuestion);
            updateButtonsVisibility();
        };

        const showThankYouMessage = () => {
            formAnswers.innerHTML = '';
            questionTitle.innerHTML = `
                <div class="form-group">
                    <label for="userName">Введіть ваше ім'я</label>
                    <input type="text" class="form-control" id="userName">
                </div>
                <div class="form-group">
                    <label for="numberPhone">Введіть ваш телефон</label>
                    <input type="tel" class="form-control" id="numberPhone">
                </div>
            `;
            updateButtonsVisibility();
        };

        renderQuestions(numberQuestion);

        const checkAnswer = () => {
            const obj = {};
            const inputs = Array.from(formAnswers.querySelectorAll('input')).filter(input => input.checked);

            inputs.forEach((input, index) => {
                obj[`${index}_${questions[numberQuestion].question}`] = input.value;
            });

            finalAnswers.push(obj);
        };

        nextButton.onclick = () => {
            checkAnswer();
            if (numberQuestion < questions.length - 1) {
                numberQuestion++;
                renderQuestions(numberQuestion);
            } else if (numberQuestion === questions.length - 1) {
                numberQuestion++;
                showThankYouMessage();
            }
        };

        prevButton.onclick = () => {
            if (numberQuestion > 0) {
                numberQuestion--;
                renderQuestions(numberQuestion);
            }
        };

        sendButton.onclick = () => {
            const nameInput = document.getElementById('userName');
            const phoneInput = document.getElementById('numberPhone');
            if (nameInput && phoneInput) {
                finalAnswers.push({
                    "Ім'я": nameInput.value,
                    "Номер телефону": phoneInput.value
                });
            }
            console.log("Відповіді відправлено:", finalAnswers);

            modalBlock.classList.remove('d-block');
            thankYouModal.style.display = 'block';

            setTimeout(() => {
                thankYouModal.style.display = 'none';
            }, 1000);
        };
    };
});
