const appEl = document.getElementById("app");
const templatePresenter = new TemplatePresenter(appEl);

templatePresenter.showSpinner();

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
    // this.navigator.navigate(this.htmlUtils.createError(error));
  });
