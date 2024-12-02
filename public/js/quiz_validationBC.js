document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('quiz-form');

  // Validate that all quiz questions have been answered
  function validateQuiz() {
    const questions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'];
    let allAnswered = true;

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      const radios = document.getElementsByName(q);
      let answered = false;

      for (const radio of radios) {
        if (radio.checked) {
          answered = true;
          break;
        }
      }

      if (!answered) {
        alert(`Please answer Question ${i + 1}.`);
        allAnswered = false;
        break;
      }
    }
    return allAnswered;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const allAnswered = validateQuiz();
    if (!allAnswered) {
      return;
    }

    const formData = new FormData(form);
    const quizData = {};
    formData.forEach((value, key) => {
      quizData[key] = value;
    });

    try {
      const response = await fetch('/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quiz: quizData, 
          predictions: gazePoints
        })
      });

      const data = await response.json();
      swal({
        title: "Test Results",
        text: `${data.finalScore}/8`,
        closeOnClickOutside: false,
      }).then(() => {
        window.location.href = "/post-survey";
      });
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  });
});
