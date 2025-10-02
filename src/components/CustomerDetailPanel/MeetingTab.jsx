import React, { useState } from 'react';
import { PROPERTY_STATUSES } from '../../constants';
import { generateId, formatDateTime } from '../../utils/helpers';

const MeetingTab = ({ customerId, meetings, onSaveMeeting, onDeleteMeeting }) => {
  const [isAdding, setIsAdding] = useState(false);

  const customerMeetings = meetings.filter(m => m.customerId === customerId);

  const MeetingForm = ({ onCancel, meetingData }) => {
    const [formData, setFormData] = useState(meetingData || { date: new Date().toISOString().slice(0, 10), time: new Date().toTimeString().slice(0, 5), properties: [] });
    const [showPropertyModal, setShowPropertyModal] = useState(false);

    const handleMeetingChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    }

    const handlePropertyChange = (index, e) => {
        const newProperties = [...formData.properties];
        newProperties[index] = {...newProperties[index], [e.target.name]: e.target.value};
        setFormData({...formData, properties: newProperties});
    }

    const addProperty = () => {
        const newProperty = { id: generateId(), visitTime: '', agency: '', agencyPhone: '', info: '', status: PROPERTY_STATUSES[0] };
        setFormData({...formData, properties: [...formData.properties, newProperty]});
    }

    const removeProperty = (index) => {
        if (confirm('정말 이 매물을 삭제하시겠습니까?')) {
            const newProperties = formData.properties.filter((_, i) => i !== index);
            setFormData({...formData, properties: newProperties});
        }
    }

    const handleSubmit = () => {
        const meetingToSave = { ...formData, id: formData.id || generateId(), customerId };
        onSaveMeeting(meetingToSave);
        onCancel();
    }

    const PropertyModal = ({ onClose }) => {
      const [propertyData, setPropertyData] = useState({ visitTime: '', agency: '', agencyPhone: '', info: '', status: PROPERTY_STATUSES[0] });

      const handlePropertySave = () => {
        setFormData({...formData, properties: [...formData.properties, { ...propertyData, id: generateId() }]});
        onClose();
      };

      return (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>매물 추가</h3>
              <button className="btn-close" onClick={onClose}>×</button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>방문시간</label>
                <input type="time" value={propertyData.visitTime} onChange={(e) => setPropertyData({...propertyData, visitTime: e.target.value})} />
              </div>
              <div className="form-group">
                <label>준비상태</label>
                <select value={propertyData.status} onChange={(e) => setPropertyData({...propertyData, status: e.target.value})}>
                  {PROPERTY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>부동산</label>
                <input type="text" value={propertyData.agency} onChange={(e) => setPropertyData({...propertyData, agency: e.target.value})} />
              </div>
              <div className="form-group">
                <label>연락처</label>
                <input type="text" placeholder="010-0000-0000" value={propertyData.agencyPhone} onChange={(e) => setPropertyData({...propertyData, agencyPhone: e.target.value})} />
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label>매물정보</label>
                <textarea placeholder="매물의 상세 정보를 입력하세요 (예: 아파트 84㎡, 3층 2호실)" value={propertyData.info} onChange={(e) => setPropertyData({...propertyData, info: e.target.value})}></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={onClose} className="btn-secondary">취소</button>
              <button onClick={handlePropertySave} className="btn-primary">추가</button>
            </div>
          </div>
        </div>
      );
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>미팅 추가 - 여의도근무 여성분(렌코양창룸방)</h3>
              <button className="btn-close" onClick={onCancel}>×</button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>미팅 날짜</label>
                <input type="date" name="date" value={formData.date} onChange={handleMeetingChange} />
              </div>
              <div className="form-group">
                <label>미팅 시간</label>
                <input type="time" name="time" value={formData.time} onChange={handleMeetingChange} />
              </div>
            </div>

            <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>매물 준비</h4>
            {formData.properties.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                준비된 매물이 없습니다.
              </div>
            ) : (
              formData.properties.map((prop, index) => (
                <div key={prop.id} className="property-form-item">
                  <div className="form-grid">
                    <input name="visitTime" value={prop.visitTime} onChange={(e) => handlePropertyChange(index, e)} placeholder="방문시간 (HH:mm)" />
                    <input name="agency" value={prop.agency} onChange={(e) => handlePropertyChange(index, e)} placeholder="부동산" />
                    <input name="agencyPhone" value={prop.agencyPhone} onChange={(e) => handlePropertyChange(index, e)} placeholder="연락처" />
                  </div>
                  <textarea name="info" value={prop.info} onChange={(e) => handlePropertyChange(index, e)} placeholder="매물 정보"></textarea>
                  <select name="status" value={prop.status} onChange={(e) => handlePropertyChange(index, e)}>
                    {PROPERTY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button onClick={() => removeProperty(index)} className="btn-secondary">삭제</button>
                </div>
              ))
            )}
            <div style={{ textAlign: 'center', margin: '20px 0', borderTop: '1px dashed #ccc', paddingTop: '20px' }}>
              <button onClick={() => setShowPropertyModal(true)} className="btn-primary">+ 매물 추가</button>
            </div>

            <div className="modal-footer">
              <button onClick={onCancel} className="btn-secondary">취소</button>
              <button onClick={handleSubmit} className="btn-primary">저장</button>
            </div>

            {showPropertyModal && <PropertyModal onClose={() => setShowPropertyModal(false)} />}
          </div>
        </div>
    )
  }

  return (
    <div className="meeting-tab">
        {!isAdding && <button onClick={() => setIsAdding(true)}>+ 미팅 추가</button>}
        {isAdding && <MeetingForm onCancel={() => setIsAdding(false)} />}
        {customerMeetings.map(meeting => (
            <div key={meeting.id} className="meeting-item">
                <div className="item-header">
                    <strong>{formatDateTime(meeting.date)}</strong>
                    <div>
                        <button onClick={() => { /* Edit not implemented yet */ }}>수정</button>
                        <button onClick={() => onDeleteMeeting(meeting.id)}>삭제</button>
                    </div>
                </div>
                {meeting.properties.map(prop => (
                    <div key={prop.id} className={`property-item status-${prop.status.replace(' ', '-')}`}>
                        <p><strong>{prop.info}</strong></p>
                        <p>{prop.agency} ({prop.agencyPhone}) - {prop.visitTime} 방문</p>
                        <p>상태: {prop.status}</p>
                    </div>
                ))}
            </div>
        ))}
    </div>
  );
};

export default MeetingTab;
