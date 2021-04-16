const Templates = {
  spinner: document.getElementById("spinner-template"),
  question: document.getElementById("question-template"),
  result: document.getElementById("result-template"),
  error: document.getElementById("error-template"),
  radioButton: document.getElementById("radiobutton-template"),
  checkBox: document.getElementById("checkbox-template")
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
    const createCheckBox = (id, text) => {
      const answerContainerElement = Templates.checkBox.content.querySelector(
        ".answer-container"
      );
      answerContainerElement.dataset.id = id;

      const inputElement = Templates.checkBox.content.querySelector("input");
      inputElement.id = id;
      inputElement.name = id;
      inputElement.value = id;

      const labelElement = Templates.checkBox.content.querySelector("label");

      labelElement.htmlFor = id;
      labelElement.textContent = text;

      return Templates.checkBox.content.cloneNode(true);
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

    for (let i = 1; i < question.possible_answers.length; i++) {
      answersContainerElement.appendChild(
        createCheckBox(
          question.possible_answers[i].a_id,
          question.possible_answers[i].caption
        )
      );
    }

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
