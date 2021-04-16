const Templates = {
  spinner: document.getElementById("spinner-template"),
  intro: document.getElementById("intro-template"),
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

  showQuestion() {
    this.app.appendChild(Templates.spinner.content.cloneNode(true));
    this.app.appendChild(Templates.intro.content.cloneNode(true));
  }

  showResult() {
    this.app.appendChild(Templates.spinner.content.cloneNode(true));
    this.app.appendChild(Templates.intro.content.cloneNode(true));
  }

  showError(error) {
    const errorContainer = Templates.error.content.cloneNode(true);
    this.app.appendChild(errorContainer);
    const errorTextEl = document.querySelector(".error-text");
    const errorTextNode = document.createTextNode(error);
    errorTextEl.appendChild(errorTextNode);
  }
}
