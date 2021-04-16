class QuizManager {
  constructor(templatePresenter) {
    this.templatePresenter = templatePresenter;

    this.questionIndex = 0;
    this.totalScore = 0;
    this.highestPossibleScore;
    this.questionData;
  }

  start() {
    const showResult = () => {
      templatePresenter.showSpinner();
      fetch(config.resultUrl)
        .then(response => response.json())
        .then(data => {
          console.log("Data Loaded");

          const finalScorePercentage =
            (this.totalScore / this.highestPossibleScore) * 100;

          const result = data.results.filter(
            item =>
              item.minpoints <= finalScorePercentage &&
              item.maxpoints >= finalScorePercentage
          )[0];

          templatePresenter.showResult(result, finalScorePercentage);
        })
        .catch(error => {
          console.error(error);
          templatePresenter.showError(error);
        });
    };

    const showQuestion = question => {
      if (this.questionIndex >= this.questionData.questions.length) {
        showResult();
        return;
      }
      templatePresenter.showQuestion(
        this.questionData.title,
        this.questionData.description,
        question,
        result => {
          this.totalScore += result;
          showQuestion(this.questionData.questions[++this.questionIndex]);
        }
      );
    };

    fetch(config.quizUrl)
      .then(response => response.json())
      .then(data => {
        console.log("Data Loaded");
        this.questionData = data;
        this.highestPossibleScore = data.questions.reduce(
          (total, item) => total + item.points,
          0
        );
        showQuestion(this.questionData.questions[0]);
      })
      .catch(error => {
        console.error(error);
        templatePresenter.showError(error);
      });
  }
}
