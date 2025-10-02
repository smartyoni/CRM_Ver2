import React, { useState } from 'react';
import { STATUSES } from '../constants';

const FilterSidebar = ({ activeFilter, onFilterChange, customers, isMobileOpen, onMobileClose }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getStatusCount = (status) => {
    if (status === '전체') return customers.length;
    return customers.filter(c => c.status === status).length;
  };

  const allStatuses = ['전체', ...STATUSES];

  const handleFilterClick = (status) => {
    onFilterChange(status);
    onMobileClose(); // 모바일에서 필터 선택 시 사이드바 닫기
  };

  return (
    <aside className={`filter-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
      <div className="filter-header">
        {!isCollapsed && <h4>필터</h4>}
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="btn-close desktop-only">
          {isCollapsed ? '☰' : '✕'}
        </button>
        <button onClick={onMobileClose} className="btn-close mobile-only">
          ✕
        </button>
      </div>
      {!isCollapsed && (
        <ul className="filter-list">
          {allStatuses.map(status => (
            <li
              key={status}
              className={`filter-item ${activeFilter === status ? 'active' : ''}`}
              onClick={() => handleFilterClick(status)}
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
