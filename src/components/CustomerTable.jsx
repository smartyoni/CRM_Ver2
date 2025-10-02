import React, { useState, useMemo } from 'react';
import { PROGRESS_STATUSES } from '../constants';

const CustomerTable = ({ customers, onSelectCustomer, onEdit, onDelete, selectedCustomerId, activeFilter, activeProgressFilter, onProgressFilterChange, allCustomers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, selectedCustomer: null });

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );
  }, [customers, searchTerm]);

  const handleContextMenu = (e, customer) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.pageX, y: e.pageY, selectedCustomer: customer });
  };

  const handleCloseContextMenu = () => {
    setContextMenu({ ...contextMenu, visible: false });
  };

  const handleEdit = () => {
    if (contextMenu.selectedCustomer) {
      onEdit(contextMenu.selectedCustomer);
    }
    handleCloseContextMenu();
  };

  const handleDelete = () => {
    if (contextMenu.selectedCustomer) {
      onDelete(contextMenu.selectedCustomer);
    }
    handleCloseContextMenu();
  };

  // 진행상황별 고객 수 계산 (현재 선택된 상태에 해당하는 고객만)
  const getProgressCount = (progress) => {
    return allCustomers.filter(c =>
      (activeFilter === '전체' || c.status === activeFilter) && c.progress === progress
    ).length;
  };

  // 진행상황 탭을 표시할지 여부
  const showProgressTabs = activeFilter === '신규' || activeFilter === '진행중';

  return (
    <div className="table-container" onClick={handleCloseContextMenu}>
        <div style={{ marginBottom: '15px' }}>
            <input
                type="text"
                placeholder="고객명, 연락처 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
            />
        </div>

        {showProgressTabs && (
          <div className="progress-tabs" style={{ marginBottom: '15px' }}>
            <button
              className={`progress-tab ${!activeProgressFilter ? 'active' : ''}`}
              onClick={() => onProgressFilterChange(null)}
            >
              전체 ({allCustomers.filter(c => activeFilter === '전체' || c.status === activeFilter).length})
            </button>
            {PROGRESS_STATUSES.map(progress => (
              <button
                key={progress}
                className={`progress-tab ${activeProgressFilter === progress ? 'active' : ''} progress-${progress}`}
                onClick={() => onProgressFilterChange(progress)}
              >
                {progress} ({getProgressCount(progress)})
              </button>
            ))}
          </div>
        )}
      <table className="customer-table">
        <thead>
          <tr>
            <th>#</th>
            <th>매물종류</th>
            <th>고객명</th>
            <th>연락처</th>
            <th>희망보증금</th>
            <th>희망월세</th>
            <th>선호지역</th>
            <th>입주희망일</th>
            <th>상태</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer, index) => (
            <tr 
              key={customer.id} 
              className={selectedCustomerId === customer.id ? 'selected' : ''}
              onClick={() => onSelectCustomer(customer)}
              onContextMenu={(e) => handleContextMenu(e, customer)}
            >
              <td>{index + 1}</td>
              <td>{customer.propertyType}</td>
              <td className="customer-name" title={customer.name}>{customer.name}</td>
              <td><a href={`sms:${customer.phone}`}>{customer.phone}</a></td>
              <td>{customer.hopefulDeposit ? `${customer.hopefulDeposit}만원` : '-'}</td>
              <td>{customer.hopefulMonthlyRent ? `${customer.hopefulMonthlyRent}만원` : '-'}</td>
              <td className="preferred-area" title={customer.preferredArea}>{customer.preferredArea}</td>
              <td>{customer.moveInDate}</td>
              <td>{customer.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {contextMenu.visible && (
        <div style={{ top: contextMenu.y, left: contextMenu.x, position: 'absolute', zIndex: 100, background: 'white', border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }}>
          <ul style={{ listStyle: 'none', margin: 0, padding: '5px' }}>
            <li style={{ padding: '8px', cursor: 'pointer' }} onClick={handleEdit}>수정</li>
            <li style={{ padding: '8px', cursor: 'pointer' }} onClick={handleDelete}>삭제</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;
