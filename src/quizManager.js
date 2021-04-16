class QuizManager {
  constructor(templatePresenter) {
    this.templatePresenter = templatePresenter;
  }

  start() {
    fetch(config.quizUrl)
      .then(response => response.json())
      .then(data => {
        console.log("Data Loaded");
        // this.quizData = data;
        // const quizIntro = new QuizIntro(data, this.htmlUtils);
        // this.highestScore = quizIntro.highestPosibleScore();
        // const firstPage = quizIntro.create(() => this.navigateToNextQuestion());

        // this.navigator.navigate(firstPage);
      })
      .catch(error => {
        console.error(error);
        templatePresenter.showError(error);

        // this.navigator.navigate(this.htmlUtils.createError(error));
      });
  }
}
