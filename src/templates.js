const Templates = {
  spinner: document.getElementById("spinner-template"),
  question: document.getElementById("question-template"),
  result: document.getElementById("result-template"),
  error: document.getElementById("error-template")
};

class TemplatePresenter {
  constructor(app) {
    this.app = app;
  }

  showSpinner() {
    this.app.appendChild(Templates.spinner.content.cloneNode(true));
  }

  showQuestion(quizTitle, quizDescription, question) {
    const questionElement = Templates.question.content.cloneNode(true);

    this.app.appendChild(questionElement);

    const questionTitleElement = document.querySelector(".quiz-title");
    questionTitleElement.textContent = quizTitle;

    const questionDescriptionElement = document.querySelector(
      ".quiz-description"
    );
    questionDescriptionElement.textContent = quizDescription;
  }

  showResult() {
    this.app.appendChild(Templates.spinner.content.cloneNode(true));
    this.app.appendChild(Templates.intro.content.cloneNode(true));
  }

  showError(error) {
    const errorContainer = Templates.error.content.cloneNode(true);
    this.app.appendChild(errorContainer);
    const errorTextEl = document.querySelector(".error-text");
    errorTextEl.textContent = error;
  }
}
