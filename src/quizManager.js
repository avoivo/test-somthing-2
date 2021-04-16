class QuizManager {
  constructor(templatePresenter) {
    this.templatePresenter = templatePresenter;

    this.questionIndex = 0;
    this.totalScore = 0;
    this.highestPossibleScore;
    this.questionData;
  }

  start() {
    const showResult = () => {};
    const showQuestion = question => {
      if (this.questionIndex >= this.questionData.questions.length) {
        showResult();
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
