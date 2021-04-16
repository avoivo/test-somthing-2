const appEl = document.getElementById("app");
const templatePresenter = new TemplatePresenter(appEl);
const quizManager = new QuizManager(templatePresenter);
quizManager.start();
