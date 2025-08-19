import React from 'react';

const ProgramsList = ({ programs, handleEditProgram, handleDeleteProgram, handleOpenQuizModal }) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>Existing Programs</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {programs.map((p) => (
          <li key={p.id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
            <strong>{p.title}</strong> ({p.duration})
            <div>Price: {p.price ? `$${p.price} (USD)` : 'N/A'}</div>
            <div style={{ marginTop: '0.5rem' }}>
              <button onClick={() => handleEditProgram(p)} style={{ marginRight: '0.5rem' }}>Edit</button>
              <button onClick={() => handleDeleteProgram(p.id)} style={{ marginRight: '0.5rem' }}>Delete</button>
              <button onClick={() => handleOpenQuizModal(p.id)}>Manage Quiz</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProgramsList;
