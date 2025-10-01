import React, { useState } from 'react';
import BasicInfo from './BasicInfo';
import ActivityTab from './ActivityTab';
// import MeetingTab from './MeetingTab'; // To be added later

const CustomerDetailPanel = ({ 
    selectedCustomer, 
    onClose, 
    onEditCustomer,
    activities,
    onSaveActivity,
    onDeleteActivity
}) => {
  const [activeTab, setActiveTab] = useState('기본정보');

  const isOpen = !!selectedCustomer;

  return (
    <aside className={`detail-panel ${isOpen ? 'open' : ''}`}>
      {isOpen && (
        <>
          <div className="panel-header">
            <div>
                <h3>고객 상세</h3>
                <span className="created-date">접수일자: {new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
            </div>
            <div>
                <button onClick={() => onEditCustomer(selectedCustomer)} className="btn-primary">수정</button>
                <button onClick={onClose} className="btn-close">✕</button>
            </div>
          </div>
          <div className="panel-content">
            <div className="tab-nav">
              <div onClick={() => setActiveTab('기본정보')} className={`tab-item ${activeTab === '기본정보' ? 'active' : ''}`}>기본정보</div>
              <div onClick={() => setActiveTab('활동 내역')} className={`tab-item ${activeTab === '활동 내역' ? 'active' : ''}`}>활동 내역 +</div>
              {/* <div onClick={() => setActiveTab('미팅 내역')} className={`tab-item ${activeTab === '미팅 내역' ? 'active' : ''}`}>미팅 내역 +</div> */}
            </div>
            <div className="tab-content">
              {activeTab === '기본정보' && <BasicInfo customer={selectedCustomer} />}
              {activeTab === '활동 내역' && 
                <ActivityTab 
                    customerId={selectedCustomer.id} 
                    activities={activities}
                    onSaveActivity={onSaveActivity}
                    onDeleteActivity={onDeleteActivity}
                />}
              {/* {activeTab === '미팅 내역' && <p>Meetings coming soon...</p>} */}
            </div>
          </div>
        </>
      )}
    </aside>
  );
};

export default CustomerDetailPanel;
