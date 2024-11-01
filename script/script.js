import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { getDatabase, ref, get, push } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyAYq3w_bknQx7_i47PIfeYhNfZSndTyBpU",
    authDomain: "my-first-firebase-projec-ede28.firebaseapp.com",
    projectId: "my-first-firebase-projec-ede28",
    storageBucket: "my-first-firebase-projec-ede28.firebasestorage.app",
    messagingSenderId: "863482782924",
    appId: "1:863482782924:web:6ff83dc884fd1068bcce69",
    databaseURL: "https://my-first-firebase-projec-ede28-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener('DOMContentLoaded', function() {
    const btnOpenModal = document.querySelector('#btnOpenModal');
    const modalBlock = document.querySelector('#modalBlock');
    const closeModal = document.querySelector('#closeModal');
    const questionTitle = document.querySelector('#question');
    const formAnswers = document.querySelector('#formAnswers');
    const nextButton = document.querySelector('#next');
    const prevButton = document.querySelector('#prev');
    const sendButton = document.querySelector('#send');

    let questions = [];

    // Блок подяки користувачеві
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

    const fetchQuestions = async () => {
        const questionsRef = ref(db, 'questions');
        const snapshot = await get(questionsRef);
        if (snapshot.exists()) {
            questions = snapshot.val();
            openTest();
        } else {
            console.log("No questions found in the database.");
        }
    };

    btnOpenModal.addEventListener('click', () => {
        modalBlock.classList.add('d-block');
        fetchQuestions();
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

        const renderQuestions = (indexQuestion) => {
            formAnswers.innerHTML = '';
            questionTitle.textContent = questions[indexQuestion].question;
            renderAnswers(indexQuestion);
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

            const contactsRef = ref(db, 'contacts');
            push(contactsRef, finalAnswers)
                .then(() => {
                    console.log("Відповіді збережено!");
                    finalAnswers.length = 0;
                })
                .catch((error) => {
                    console.error("Помилка при збереженні відповідей:", error);
                });

            modalBlock.classList.remove('d-block');
            thankYouModal.style.display = 'block';

            setTimeout(() => {
                thankYouModal.style.display = 'none';
            }, 1000);
        };
    };
});
