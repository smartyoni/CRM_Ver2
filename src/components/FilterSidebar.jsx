import React, { useState } from 'react';
import { STATUSES } from '../constants';

const FilterSidebar = ({ activeFilter, onFilterChange, customers }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getStatusCount = (status) => {
    if (status === '전체') return customers.length;
    return customers.filter(c => c.status === status).length;
  };

  const allStatuses = ['전체', ...STATUSES];

  return (
    <aside className={`filter-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="filter-header">
        {!isCollapsed && <h4>필터</h4>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="btn-close">
          {isCollapsed ? '☰' : '✕'}
        </button>
      </div>
      {!isCollapsed && (
        <ul className="filter-list">
          {allStatuses.map(status => (
            <li 
              key={status}
              className={`filter-item ${activeFilter === status ? 'active' : ''}`}
              onClick={() => onFilterChange(status)}
            >
              <span>{status}</span>
              <span className="count-badge">{getStatusCount(status)}</span>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default FilterSidebar;
