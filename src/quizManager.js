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
          this.highestPossibleScore = this.highestPossibleScore ?? 0;

          const finalScorePercentage =
            this.highestPossibleScore === 0
              ? 0
              : ((this.totalScore / this.highestPossibleScore) * 100).toFixed(
                  0
                );

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

    this.templatePresenter.showSpinner();
    fetch(config.quizUrl)
      .then(response => response.json())
      .then(data => {
        console.log("Data Loaded");
        this.questionData = data || {};
        this.questionData.questions = this.questionData.questions || [];

        this.highestPossibleScore = this.questionData.questions.reduce(
          (total, item) => total + item.points,
          0
        );

        if (this.questionData.questions.length === 0) {
          this.templatePresenter.showError("No existing quiz questions");
        } else {
          showQuestion(this.questionData.questions[0]);
        }
      })
      .catch(error => {
        console.error(error);
        templatePresenter.showError(error);
      });
  }
}
