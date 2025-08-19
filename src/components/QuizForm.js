import React from 'react';

const QuizForm = ({ quiz, question, handleQuizChange, handleQuestionChange, handleAddQuestion, handleQuizSubmit, editingQuestionIndex, setEditingQuestionIndex, setQuestion }) => {
  return (
    <div>
      <form onSubmit={handleQuizSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Quiz Title"
          value={quiz.title}
          onChange={handleQuizChange}
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />
        <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '1rem' }}>
          <h3>{editingQuestionIndex !== null ? 'Edit Question' : 'Add Question'}</h3>
          <input
            type="text"
            name="question"
            placeholder="Question"
            value={question.question}
            onChange={handleQuestionChange}
            style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
          />
          <input
            type="text"
            name="options"
            placeholder="Options (comma-separated)"
            value={question.options}
            onChange={handleQuestionChange}
            style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
          />
          <input
            type="text"
            name="answer"
            placeholder="Answer"
            value={question.answer}
            onChange={handleQuestionChange}
            style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
          />
          <button type="button" onClick={handleAddQuestion}>
            {editingQuestionIndex !== null ? 'Update Question' : 'Add Question'}
          </button>
          {editingQuestionIndex !== null && (
            <button type="button" onClick={() => { setEditingQuestionIndex(null); setQuestion({ question: '', options: '', answer: '' }); }} style={{ marginLeft: '0.5rem' }}>
              Cancel Edit
            </button>
          )}
        </div>
        <button type="submit">Save Quiz</button>
      </form>
    </div>
  );
};

export default QuizForm;
