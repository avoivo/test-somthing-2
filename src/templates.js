const Templates = {
  spinner: document.getElementById("spinner-template"),
  question: document.getElementById("question-template"),
  result: document.getElementById("result-template"),
  error: document.getElementById("error-template"),
  answer: document.getElementById("answer-template")
};

class TemplatePresenter {
  constructor(app) {
    this.app = app;
  }

  present(element) {
    if (!!!element) {
      return;
    }
    this.app.textContent = "";
    this.app.appendChild(element);
  }

  showSpinner() {
    this.present(Templates.spinner.content.cloneNode(true));
  }

  showQuestion(quizTitle, quizDescription, question, onSubmit) {
    const createAnswer = (id, text, type) => {
      const answerContainerElement = Templates.answer.content.querySelector(
        ".answer-container"
      );
      answerContainerElement.dataset.id = id;

      const inputElement = Templates.answer.content.querySelector("input");
      inputElement.id = id;
      inputElement.type = type;
      inputElement.name = type === "radio" ? "answer" : id;
      inputElement.value = id;

      const labelElement = Templates.answer.content.querySelector("label");

      labelElement.htmlFor = id;
      labelElement.textContent = text;

      return Templates.answer.content.cloneNode(true);
    };

    const addAnswersToContainer = (questionType, answers, container) => {
      container.textContent = "";
      switch (questionType) {
        case "multiplechoice-single":
          for (let i = 0; i < answers.length; i++) {
            container.appendChild(
              createAnswer(answers[i].a_id, answers[i].caption, "radio")
            );
          }

          break;
        case "truefalse":
          container.appendChild(createAnswer("true", "True", "radio"));
          container.appendChild(createAnswer("false", "False", "radio"));
          break;
        case "multiplechoice-multiple":
          for (let i = 0; i < answers.length; i++) {
            container.appendChild(
              createAnswer(answers[i].a_id, answers[i].caption, "checkbox")
            );
          }
          break;
        default:
          container.textContent = "Unknown question type";
          break;
      }
    };

    const serializeForm = form => {
      var obj = {};
      var formData = new FormData(form);
      for (var key of formData.keys()) {
        obj[key] = formData.get(key);
      }
      return obj;
    };

    const calculateScore = (
      submitedData,
      questionType,
      correctAnswer,
      points
    ) => {
      let score = 0;
      if (questionType === "multiplechoice-single") {
        //radio
        if (correctAnswer === Number(submitedData["answer"])) {
          score = points;
        }
      } else if (questionType === "truefalse") {
        //true/false
        if (submitedData["answer"].includes(correctAnswer)) {
          score = points;
        }
      } else {
        //checkboxes

        const selectedAswers = Object.keys(submitedData).map(k => Number(k));

        var isSame =
          correctAnswer.length == selectedAswers.length &&
          correctAnswer.every(function(element, index) {
            return element === selectedAswers[index];
          });

        if (isSame) {
          score = points;
        }
      }

      return score;
    };

    const highlightCorrectAnswer = correctAnswer => {
      correctAnswer = Array.isArray(correctAnswer)
        ? correctAnswer
        : [correctAnswer];

      correctAnswer.forEach(item =>
        document
          .querySelector(`.answer-container[data-id='${item}']`)
          .classList.add("highlight")
      );
    };

    const questionTitleElement = Templates.question.content.querySelector(
      ".quiz-title"
    );
    questionTitleElement.textContent = quizTitle;

    const questionDescriptionElement = Templates.question.content.querySelector(
      ".quiz-description"
    );
    questionDescriptionElement.textContent = quizDescription;

    const questionImageElement = Templates.question.content.querySelector(
      ".question-image"
    );
    questionImageElement.src = question.img;
    questionImageElement.title = question.title;

    const answerDescriptionElement = Templates.question.content.querySelector(
      ".answer-description"
    );
    answerDescriptionElement.textContent = question.title;

    const answersContainerElement = Templates.question.content.querySelector(
      ".answers-container"
    );

    addAnswersToContainer(
      question.question_type,
      question.possible_answers,
      answersContainerElement
    );

    this.present(Templates.question.content.cloneNode(true));

    const submitButton = document.querySelector("input[type='submit']");

    document.querySelectorAll("input").forEach(item =>
      item.addEventListener("change", e => {
        e.preventDefault();
        e.stopPropagation();
        submitButton.disabled = false;
      })
    );

    const validationResultElement = document.querySelector(
      ".validation-result"
    );

    document
      .querySelector("form#answers-form")
      .addEventListener("submit", e => {
        e.preventDefault();
        e.stopPropagation();
        submitButton.disabled = true;

        const result = calculateScore(
          serializeForm(e.target),
          question.question_type,
          question.correct_answer,
          question.points
        );

        if (result === 0) {
          validationResultElement.textContent = "Your answer is incorrect.";
          validationResultElement.classList.add("fail");
          highlightCorrectAnswer(question.correct_answer);
        } else {
          validationResultElement.textContent = "Your answer is correct!";
          validationResultElement.classList.add("success");
        }

        setTimeout(() => onSubmit(result), 3000);
      });
  }

  showResult() {
    // this.present(Templates.spinner.content.cloneNode(true));
    // this.present(Templates.intro.content.cloneNode(true));
  }

  showError(error) {
    Templates.error.content.querySelector(".error-text").textContent = error;
    this.present(Templates.error.content.cloneNode(true));
  }
}
