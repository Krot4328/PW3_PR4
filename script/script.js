document.addEventListener('DOMContentLoaded', function(){
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    
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
        let numberQuestion = 0;

        const updateButtonsVisibility = () => {
            prevButton.style.display = numberQuestion === 0 ? 'none' : 'block';
            nextButton.style.display = numberQuestion === questions.length - 1 ? 'none' : 'block';
        };

        const renderAnswers = (index) => {
            questions[index].answers.forEach((answer) => {
                const answerItem = document.createElement('div');
                answerItem.classList.add('answers-item', 'd-flex', 'flex-column');

                answerItem.innerHTML = `
                    <input type="${questions[index].type}" id="${answer.title}" name="answer" class="d-none">
                    <label for="${answer.title}" class="d-flex flex-column justify-content-between">
                        <img class="answerImg" src="${answer.url}" alt="${answer.title}">
                        <span>${answer.title}</span>
                    </label>`;
                
                formAnswers.appendChild(answerItem);
            });
        };

        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = '';
            questionTitle.textContent = `${questions[indexQuestion].question}`;
            renderAnswers(indexQuestion);
            updateButtonsVisibility();
        };

        renderQuestions(numberQuestion);

        nextButton.onclick = () => {
            if (numberQuestion < questions.length - 1) {
                numberQuestion++;
                renderQuestions(numberQuestion);
            }
        };

        prevButton.onclick = () => {
            if (numberQuestion > 0) {
                numberQuestion--;
                renderQuestions(numberQuestion);
            }
        };
    };
});
