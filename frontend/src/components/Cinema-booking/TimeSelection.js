import React from 'react';
import { useNavigate } from 'react-router-dom';

function TimeSelection() {
  const navigate = useNavigate();
  
  const handleTimeSelect = (time) => {
    localStorage.setItem('selectedTime', time);  // Save the selected time
    navigate('/seats');
  };

  return (
    <div>
      <h2>Select Time</h2>
      <button onClick={() => handleTimeSelect('14:00')}>14:00</button>
      <button onClick={() => handleTimeSelect('16:30')}>16:30</button>
      <button onClick={() => handleTimeSelect('19:00')}>19:00</button>
    </div>
  );
}

export default TimeSelection;
