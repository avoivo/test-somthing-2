class Template {
  constructor(templateId) {
    this.templateId = templateId;
    this.clear();
  }

  clear() {
    this.template = document.getElementById(this.templateId).cloneNode(true);
  }

  setText(selector, text) {
    const el = this.template.content.querySelector(selector);
    el && (el.textContent = text);
  }

  setImage(selector, src, title) {
    const el = this.template.content.querySelector(selector);
    if (el) {
      el.src = src;
      el.title = title;
    }
  }

  setContainerId(selector, id) {
    const el = this.template.content.querySelector(selector);
    el && (el.dataset.id = id);
  }

  setInput(selector, id, type) {
    const inputElement = this.template.content.querySelector(selector);
    if (inputElement) {
      inputElement.id = id;
      inputElement.type = type;
      inputElement.name = type === "radio" ? "answer" : id;
      inputElement.value = id;
    }
  }

  setLabel(selector, id, text) {
    const labelElement = this.template.content.querySelector(selector);
    if (labelElement) {
      labelElement.htmlFor = id;
      labelElement.textContent = text;
    }
  }

  getElement(selector) {
    return this.template.content.querySelector(selector);
  }

  clone() {
    return this.template.content.cloneNode(true);
  }
}

class QuestionTemplate {
  constructor(templateId) {
    this.template = new Template(templateId);
    this.answerTemplate = new Template("answer-template");
  }

  create(quizTitle, quizDescription, question) {
    const createAnswer = (id, text, type) => {
      this.answerTemplate.clear();
      this.answerTemplate.setContainerId(".answer-container", id);
      this.answerTemplate.setInput("input", id, type);
      this.answerTemplate.setLabel("label", id, text);
      const answerEl = this.answerTemplate.clone();
      return answerEl;
    };

    const addAnswersToContainer = (questionType, answers, container) => {
      container.textContent = "";
      switch (questionType) {
        case "multiplechoice-single":
          for (let i = 0; i < answers.length; i++) {
            container.appendChild(
              createAnswer(answers[i].a_id, answers[i].caption, "radio")
            );
          }
          break;
        case "truefalse":
          container.appendChild(createAnswer("true", "True", "radio"));
          container.appendChild(createAnswer("false", "False", "radio"));
          break;
        case "multiplechoice-multiple":
          for (let i = 0; i < answers.length; i++) {
            container.appendChild(
              createAnswer(answers[i].a_id, answers[i].caption, "checkbox")
            );
          }
          break;
        default:
          container.textContent = "Unknown question type";
          break;
      }
    };

    this.template.clear();
    this.template.setText(".quiz-title", quizTitle);
    this.template.setText(".quiz-description", quizDescription);
    this.template.setImage(".question-image", question.img, question.title);
    this.template.setText(".answer-description", question.title);

    const answersContainerElement = this.template.getElement(
      ".answers-container"
    );

    addAnswersToContainer(
      question.question_type,
      question.possible_answers,
      answersContainerElement
    );

    return this.template.clone();
  }
}

class TemplatePresenter {
  constructor(app) {
    this.app = app;

    this.spinnerTemplate = new Template("spinner-template");
    this.resultTemplate = new Template("result-template");
    this.questionTemplate = new QuestionTemplate("question-template");
    this.errorTemplate = new Template("error-template");
  }

  present(element) {
    if (!!!element) {
      return;
    }
    this.app.textContent = "";
    this.app.appendChild(element);
  }

  showSpinner() {
    this.present(this.spinnerTemplate.clone());
  }

  showQuestion(quizTitle, quizDescription, question, onSubmit) {
    const serializeForm = form => {
      var obj = {};
      var formData = new FormData(form);
      for (var key of formData.keys()) {
        obj[key] = formData.get(key);
      }
      return obj;
    };

    const calculateScore = (
      submitedData,
      questionType,
      correctAnswer,
      points
    ) => {
      let score = 0;
      if (questionType === "multiplechoice-single") {
        //radio
        if (correctAnswer === Number(submitedData["answer"])) {
          score = points;
        }
      } else if (questionType === "truefalse") {
        //true/false
        if (submitedData["answer"].includes(correctAnswer)) {
          score = points;
        }
      } else {
        //checkboxes
        const selectedAswers = Object.keys(submitedData).map(k => Number(k));
        var isSame =
          correctAnswer.length == selectedAswers.length &&
          correctAnswer.every(function(element, index) {
            return element === selectedAswers[index];
          });
        if (isSame) {
          score = points;
        }
      }
      return score;
    };

    const highlightCorrectAnswer = correctAnswer => {
      correctAnswer = Array.isArray(correctAnswer)
        ? correctAnswer
        : [correctAnswer];
      correctAnswer.forEach(item =>
        document
          .querySelector(`.answer-container[data-id='${item}']`)
          .classList.add("highlight")
      );
    };

    this.present(
      this.questionTemplate.create(quizTitle, quizDescription, question)
    );
    const submitButton = document.querySelector("input[type='submit']");

    const inputElements = document.querySelectorAll("input");
    let iSubmiting = false;

    inputElements.forEach(item =>
      item.addEventListener("change", e => {
        e.preventDefault();
        e.stopPropagation();

        if (iSubmiting) {
          return;
        }

        if (question.question_type === "multiplechoice-multiple") {
          submitButton.disabled = true;
          const checkedCount = [].filter.call(inputElements, function(el) {
            return el.checked;
          }).length;

          if (checkedCount > 0) {
            submitButton.disabled = false;
            return;
          }
        } else {
          submitButton.disabled = false;
        }
      })
    );
    const validationResultElement = document.querySelector(
      ".validation-result"
    );
    document
      .querySelector("form#answers-form")
      .addEventListener("submit", e => {
        e.preventDefault();
        e.stopPropagation();
        iSubmiting = true;
        submitButton.disabled = true;
        const result = calculateScore(
          serializeForm(e.target),
          question.question_type,
          question.correct_answer,
          question.points
        );
        if (result === 0) {
          validationResultElement.textContent = "Your answer is incorrect.";
          validationResultElement.classList.add("fail");
          highlightCorrectAnswer(question.correct_answer);
        } else {
          validationResultElement.textContent = "Your answer is correct!";
          validationResultElement.classList.add("success");
        }
        setTimeout(() => onSubmit(result), 3000);
      });
  }

  showResult(resultData, finalScore) {
    this.resultTemplate.clear();
    this.resultTemplate.setText(".result-score", `Final score: ${finalScore}%`);
    this.resultTemplate.setText(".result-title", `Result: ${resultData.title}`);
    this.resultTemplate.setText(".result-description", resultData.message);
    this.resultTemplate.setImage(
      ".result-image",
      resultData.img,
      resultData.title
    );

    this.present(this.resultTemplate.clone());
  }

  showError(error) {
    this.errorTemplate.clear();
    this.errorTemplate.setText(".error-text", error);
    this.present(this.errorTemplate.clone());
  }
}
