// quiz.js

document.addEventListener('DOMContentLoaded', () => {
    // Select elements for the form and result
    const form = document.getElementById('quiz-form');
    const resultDiv = document.getElementById('result');
  
    // Debug: Check if form and resultDiv elements are found
    console.log("Form element:", form);
    console.log("Result div element:", resultDiv);
  
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
      console.log("Form submit intercepted"); // Debugging form submission
  
      const allAnswered = validateQuiz();
      if (!allAnswered) {
        return;
      }
  
      const formData = new FormData(form);
      const data = new URLSearchParams(formData);
  
      try {
        const response = await fetch('/submit-quiz', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: data,
        });
  
        // Check if response is successful
        console.log("Fetch response:", response);
        if (!response.ok) {
          throw new Error(`Server responded with status ${response.status}`);
        }
  
        const result = await response.json();
        console.log("Quiz result:", result); // Debugging result
        resultDiv.innerHTML = `<h2>Your Score: ${result.score}/8</h2>`;
      } catch (error) {
        console.error('Error submitting quiz:', error);
        resultDiv.innerHTML = `<h2>Error submitting quiz. Please try again.</h2>`;
      }
    });
  });
  