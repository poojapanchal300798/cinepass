import React from 'react';
import { useNavigate } from 'react-router-dom';

function DateSelection() {
  const navigate = useNavigate();
  
  const handleDateSelect = (date) => {
    localStorage.setItem('selectedDate', date);  // Save the selected date
    navigate('/time');
  };

  return (
    <div>
      <h2>Select Date</h2>
      <button onClick={() => handleDateSelect('Today')}>Today</button>
      <button onClick={() => handleDateSelect('Tomorrow')}>Tomorrow</button>
      <button onClick={() => handleDateSelect('2025-12-03')}>Dec 3, 2025</button>  {/* Example custom date */}
    </div>
  );
}

export default DateSelection;
