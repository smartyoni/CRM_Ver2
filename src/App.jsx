import React, { useState, useEffect, useRef } from 'react';
import FilterSidebar from './components/FilterSidebar';
import CustomerTable from './components/CustomerTable';
import CustomerModal from './components/CustomerModal';
import CustomerDetailPanel from './components/CustomerDetailPanel';
import {
  subscribeToCustomers,
  subscribeToActivities,
  subscribeToMeetings,
  saveCustomer,
  deleteCustomer,
  saveActivity,
  deleteActivity,
  saveMeeting,
  deleteMeeting
} from './utils/storage';

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
  const [activeProgressFilter, setActiveProgressFilter] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const restoreInputRef = useRef(null);

  useEffect(() => {
    // Realtime subscriptions for Firestore
    const unsubscribeCustomers = subscribeToCustomers((customers) => {
      setCustomers(customers);
    });

    const unsubscribeActivities = subscribeToActivities((activities) => {
      setActivities(activities);
    });

    const unsubscribeMeetings = subscribeToMeetings((meetings) => {
      setMeetings(meetings);
    });

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeCustomers();
      unsubscribeActivities();
      unsubscribeMeetings();
    };
  }, []);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setActiveProgressFilter(null); // 상태 변경 시 진행상황 필터 초기화
  };

  const handleProgressFilterChange = (progress) => {
    setActiveProgressFilter(progress);
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

  const handleSaveCustomer = async (customerData) => {
    await saveCustomer(customerData);
    // Firestore 실시간 구독이 자동으로 state 업데이트
  };

  const handleDeleteCustomer = async (customer) => {
    if (confirm(`"${customer.name}" 고객을 정말 삭제하시겠습니까?`)) {
      await deleteCustomer(customer.id);
      if (selectedCustomerId === customer.id) {
        setSelectedCustomerId(null);
      }
    }
  };

  const handleSaveActivity = async (activityData) => {
    await saveActivity(activityData);
  };

  const handleDeleteActivity = async (activityId) => {
    if (confirm('정말 이 활동을 삭제하시겠습니까?')) {
      await deleteActivity(activityId);
    }
  };

  const handleSaveMeeting = async (meetingData) => {
    await saveMeeting(meetingData);
  };

  const handleDeleteMeeting = async (meetingId) => {
    if (confirm('정말 이 미팅을 삭제하시겠습니까?')) {
      await deleteMeeting(meetingId);
    }
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

  const handleRestore = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (data && Array.isArray(data.customers) && Array.isArray(data.activities)) {
          // Firestore에 각 문서 저장
          const { saveCustomers, saveActivities, saveMeetings } = await import('./utils/storage');
          await saveCustomers(data.customers || []);
          await saveActivities(data.activities || []);
          await saveMeetings(data.meetings || []);
          alert('데이터가 성공적으로 복원되었습니다.');
        } else {
          throw new Error('잘못된 파일 형식입니다.');
        }
      } catch (error) {
        alert(`복원 실패: ${error.message}`);
      }
    };
    reader.readAsText(file);
    event.target.value = null;
  };

  const filteredCustomers = customers.filter(customer => {
    const statusMatch = activeFilter === '전체' || customer.status === activeFilter;
    const progressMatch = !activeProgressFilter || customer.progress === activeProgressFilter;
    return statusMatch && progressMatch;
  });

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <div className="app-container">
      {/* 모바일 오버레이 배경 */}
      {isMobileSidebarOpen && (
        <div className="mobile-overlay" onClick={() => setIsMobileSidebarOpen(false)} />
      )}

      <FilterSidebar
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
        customers={customers}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      <div className="main-content">
        <header className="main-header">
          <button className="hamburger-btn" onClick={() => setIsMobileSidebarOpen(true)}>
            ☰
          </button>
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
            activeFilter={activeFilter}
            activeProgressFilter={activeProgressFilter}
            onProgressFilterChange={handleProgressFilterChange}
            allCustomers={customers}
          />
        </main>
      </div>

      <CustomerDetailPanel
        selectedCustomer={selectedCustomer}
        onClose={() => setSelectedCustomerId(null)}
        onEditCustomer={handleOpenModal}
        onDeleteCustomer={handleDeleteCustomer}
        activities={activities}
        onSaveActivity={handleSaveActivity}
        onDeleteActivity={handleDeleteActivity}
        meetings={meetings}
        onSaveMeeting={handleSaveMeeting}
        onDeleteMeeting={handleDeleteMeeting}
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
