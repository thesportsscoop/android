// components/ModuleForm.jsx
import React from 'react';

const ModuleForm = ({ module, handleModuleChange, editingModuleIndex }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
      <h3>Modules</h3>
      <div style={{ marginTop: '1rem' }}>
        <h4>{editingModuleIndex !== null ? 'Edit Module' : 'Add New Module'}</h4>
        <input
          type="text"
          name="title"
          placeholder="Module Title"
          value={module.title}
          onChange={handleModuleChange}
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />
        <textarea
          name="description"
          placeholder="Module Description"
          value={module.description}
          onChange={handleModuleChange}
          style={{ display: 'block', marginBottom: '1rem', width: '100%', height: '70px' }}
        />
        <input
          type="text"
          name="youtubeId" // <--- CHANGED THIS FROM 'videoUrl' TO 'youtubeId'
          placeholder="YouTube Video ID" // <--- Updated placeholder for clarity
          value={module.youtubeId} // <--- Updated value prop as well
          onChange={handleModuleChange}
          style={{ display: 'block', marginBottom: '1rem', width: '100%' }}
        />
        {/* REMOVED THE BUTTONS FROM HERE! */}
        {/* <button type="button" onClick={handleAddModule}>
          {editingModuleIndex !== null ? 'Update Module' : 'Add Module'}
        </button>
        {editingModuleIndex !== null && (
          <button type="button" onClick={() => {}} style={{ marginLeft: '0.5rem' }}>
            Cancel Edit
          </button>
        )} */}
      </div>
    </div>
  );
};

export default ModuleForm;
