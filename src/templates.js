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
      const checkBoxElement = Templates.checkBox.content.cloneNode(true);
      checkBoxElement.dataset.id = id;
      const inputElement = checkBoxElement.querySelector("input");
      inputElement.id = id;
      inputElement.name = id;
      return checkBoxElement;
    };
    debugger;
    const questionElement = Templates.question.content.cloneNode(true);

    const questionTitleElement = document.querySelector(".quiz-title");
    questionTitleElement.textContent = quizTitle;

    const questionDescriptionElement = document.querySelector(
      ".quiz-description"
    );
    questionDescriptionElement.textContent = quizDescription;

    const answersContainerElement = questionElement.querySelector(
      ".answers-container"
    );
    this.present(questionElement);
  }

  showResult() {
    this.present(Templates.spinner.content.cloneNode(true));
    this.present(Templates.intro.content.cloneNode(true));
  }

  showError(error) {
    Templates.error.content.querySelector(".error-text").textContent = error;
    this.present(Templates.error.content.cloneNode(true));
  }
}
