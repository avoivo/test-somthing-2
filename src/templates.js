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
    this.lastDisplayed;
  }

  present(element) {
    if (!!!element) {
      return;
    }

    if (this.lastDisplayed === undefined) {
      this.app.appendChild(element);
    } else {
      this.app.replaceChild(element, this.lastDisplayed);
    }

    this.lastDisplayed = element;
  }

  showSpinner() {
    this.present(Templates.spinner.content.cloneNode(true));
  }

  showQuestion(quizTitle, quizDescription, question) {
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
          for (let i = 1; i < answers.length; i++) {
            container.appendChild(
              createAnswer(answers[i].a_id, answers[i].caption, "checkbox")
            );
          }
          break;
        default:
          // answersEl = this.htmlUtils.createLabel("Unknown question type");
          break;
      }
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

    answersContainerElement.textContent = "";

    addAnswersToContainer(
      question.question_type,
      question.possible_answers,
      answersContainerElement
    );

    this.present(Templates.question.content.cloneNode(true));
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
