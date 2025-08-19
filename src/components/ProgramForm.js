import React from 'react';

const ProgramForm = ({ program, handleProgramChange, handleProgramSubmit, handleCancelEdit }) => {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <h2>{program.id ? 'Edit Program' : 'Add New Program'}</h2>
      <form onSubmit={handleProgramSubmit}>
        <input
          type="text"
          name="id"
          placeholder="Program ID (e.g., beginner)"
          value={program.id}
          onChange={handleProgramChange}
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
          disabled={!!program.id}
        />
        <input
          type="text"
          name="title"
          placeholder="Program Title"
          value={program.title}
          onChange={handleProgramChange}
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />
        <input
          type="text"
          name="duration"
          placeholder="Program Duration"
          value={program.duration}
          onChange={handleProgramChange}
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />
        <input
          type="number"
          name="price"
          placeholder="Program Price (e.g., 99)"
          value={program.price || ''}
          onChange={handleProgramChange}
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />
        <input
          type="number"
          name="order"
          placeholder="Display Order (e.g., 1 for Beginner, 2 for Intermediate, 3 for Advanced)"
          value={program.order || ''}
          onChange={handleProgramChange}
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />
        <textarea
          name="description"
          placeholder="Program Description (comma-separated)"
          value={program.description}
          onChange={handleProgramChange}
          style={{ display: 'block', marginBottom: '1rem', width: '100%', height: '100px' }}
        />
        <button type="submit">Save Program</button>
        {program.id && <button type="button" onClick={handleCancelEdit} style={{ marginLeft: '0.5rem' }}>Cancel Edit</button>}
      </form>
    </div>
  );
};

export default ProgramForm;
