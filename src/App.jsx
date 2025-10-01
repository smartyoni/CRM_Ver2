import React, { useState, useEffect, useRef } from 'react';
import FilterSidebar from './components/FilterSidebar';
import CustomerTable from './components/CustomerTable';
import CustomerModal from './components/CustomerModal';
import CustomerDetailPanel from './components/CustomerDetailPanel';
import { getCustomers, saveCustomers, getActivities, saveActivities, getMeetings, saveMeetings } from './utils/storage';

// Mock data for initial setup
const initialCustomers = [
  {
    id: '_1', name: '홍길동', phone: '010-1234-5678', source: '블로그', propertyType: '월세',
    preferredArea: '강남구 역삼동', hopefulDeposit: 1000, hopefulMonthlyRent: 50,
    moveInDate: '2024-08-01', memo: '빠른 입주 희망', status: '신규', createdAt: new Date().toISOString(),
  },
  {
    id: '_2', name: '김철수', phone: '010-9876-5432', source: '네이버광고', propertyType: '전세',
    preferredArea: '서초구 서초동', hopefulDeposit: 5000, hopefulMonthlyRent: 0,
    moveInDate: '2024-09-15', memo: '조용한 집 선호', status: '상담중', createdAt: new Date().toISOString(),
  },
    {
    id: '_3', name: '이영희', phone: '010-1111-2222', source: '지인소개', propertyType: '매매',
    preferredArea: '송파구 잠실동', hopefulDeposit: 10000, hopefulMonthlyRent: 0,
    moveInDate: '2025-01-10', memo: '한강뷰 원함', status: '계약완료', createdAt: new Date().toISOString(),
  }
];

function App() {
  const [customers, setCustomers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [activeFilter, setActiveFilter] = useState('전체');
  const restoreInputRef = useRef(null);

  useEffect(() => {
    const storedCustomers = getCustomers();
    if (storedCustomers.length === 0) {
        setCustomers(initialCustomers);
        saveCustomers(initialCustomers);
    } else {
        setCustomers(storedCustomers);
    }
    setActivities(getActivities());
    setMeetings(getMeetings());
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomerId(customer.id);
  };

  const handleOpenModal = (customer = null) => {
      setEditingCustomer(customer);
      setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingCustomer(null);
  };

  const handleSaveCustomer = (customerData) => {
    const newCustomers = [...customers];
    const index = newCustomers.findIndex(c => c.id === customerData.id);
    if (index > -1) {
        newCustomers[index] = customerData;
    } else {
        newCustomers.push(customerData);
    }
    setCustomers(newCustomers);
    saveCustomers(newCustomers);
  };

  const handleDeleteCustomer = (customer) => {
    if (confirm(`"${customer.name}" 고객을 정말 삭제하시겠습니까?`)) {
      const updatedCustomers = customers.filter(c => c.id !== customer.id);
      setCustomers(updatedCustomers);
      saveCustomers(updatedCustomers);
      if (selectedCustomerId === customer.id) {
          setSelectedCustomerId(null);
      }
    }
  };

  const handleSaveActivity = (activityData) => {
      const newActivities = [...activities];
      const index = newActivities.findIndex(a => a.id === activityData.id);
      if (index > -1) {
          newActivities[index] = activityData;
      } else {
          newActivities.push(activityData);
      }
      setActivities(newActivities);
      saveActivities(newActivities);
  };

  const handleDeleteActivity = (activityId) => {
      const updatedActivities = activities.filter(a => a.id !== activityId);
      setActivities(updatedActivities);
      saveActivities(updatedActivities);
  };

  const handleBackup = () => {
    const backupData = {
        customers,
        activities,
        meetings,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customer-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRestore = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            if (data && Array.isArray(data.customers) && Array.isArray(data.activities)) {
                saveCustomers(data.customers || []);
                saveActivities(data.activities || []);
                saveMeetings(data.meetings || []);
                alert('데이터가 성공적으로 복원되었습니다. 페이지를 새로고침합니다.');
                window.location.reload();
            } else {
                throw new Error('잘못된 파일 형식입니다.');
            }
        } catch (error) {
            alert(`복원 실패: ${error.message}`);
        }
    };
    reader.readAsText(file);
    event.target.value = null; // Reset file input
  };

  const filteredCustomers = customers.filter(customer => 
    activeFilter === '전체' || customer.status === activeFilter
  );

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="app-container">
      <FilterSidebar 
        activeFilter={activeFilter} 
        onFilterChange={handleFilterChange} 
        customers={customers} 
      />
      
      <div className="main-content">
        <header className="main-header">
          <h1>고객 목록</h1>
          <div className="header-actions">
            <button onClick={() => handleOpenModal()} className="btn-primary">+ 고객 추가</button>
            <button onClick={handleBackup} className="btn-secondary">백업</button>
            <button onClick={() => restoreInputRef.current?.click()} className="btn-secondary">복원</button>
            <input type="file" ref={restoreInputRef} onChange={handleRestore} style={{ display: 'none' }} accept=".json"/>
          </div>
        </header>
        <main className="table-container">
          <CustomerTable 
            customers={filteredCustomers}
            onSelectCustomer={handleSelectCustomer}
            onEdit={handleOpenModal}
            onDelete={handleDeleteCustomer}
            selectedCustomerId={selectedCustomerId}
          />
        </main>
      </div>

      <CustomerDetailPanel 
        selectedCustomer={selectedCustomer}
        onClose={() => setSelectedCustomerId(null)}
        onEditCustomer={handleOpenModal}
        activities={activities}
        onSaveActivity={handleSaveActivity}
        onDeleteActivity={handleDeleteActivity}
      />

      <CustomerModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCustomer}
        editData={editingCustomer}
      />
    </div>
  );
}

export default App;

