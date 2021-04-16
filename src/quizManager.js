class QuizManager {
  constructor(templatePresenter) {
    this.templatePresenter = templatePresenter;
  }

  start() {
    fetch(config.quizUrl)
      .then(response => response.json())
      .then(data => {
        console.log("Data Loaded");
        templatePresenter.showQuestion(
          data.title,
          data.description,
          data.questions[0]
        );
      })
      .catch(error => {
        console.error(error);
        templatePresenter.showError(error);
      });
  }
}
