const Templates = {
  spinner: document.getElementById("spinner-template"),
  intro: document.getElementById("intro-template"),
  question: document.getElementById("question-template"),
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

  showError() {
    this.app.appendChild(Templates.error.content.cloneNode(true));
  }
}
