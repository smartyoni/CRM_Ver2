import React, { useState } from 'react';
import { PROPERTY_STATUSES } from '../../constants';
import { generateId, formatDateTime } from '../../utils/helpers';

const MeetingTab = ({ customerId, meetings, onSaveMeeting, onDeleteMeeting }) => {
  const [isAdding, setIsAdding] = useState(false);

  const customerMeetings = meetings.filter(m => m.customerId === customerId);

  const MeetingForm = ({ onCancel, meetingData }) => {
    const [formData, setFormData] = useState(meetingData || { date: new Date().toISOString().slice(0, 16), properties: [] });

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
        const newProperties = formData.properties.filter((_, i) => i !== index);
        setFormData({...formData, properties: newProperties});
    }

    const handleSubmit = () => {
        const meetingToSave = { ...formData, id: formData.id || generateId(), customerId };
        onSaveMeeting(meetingToSave);
        onCancel();
    }

    return (
        <div className="meeting-form">
            <input type="datetime-local" name="date" value={formData.date} onChange={handleMeetingChange} />
            <h4>매물 준비</h4>
            <button onClick={addProperty}>+ 매물 추가</button>
            {formData.properties.map((prop, index) => (
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
            ))}
            <div className="form-actions">
                <button onClick={onCancel} className="btn-secondary">취소</button>
                <button onClick={handleSubmit} className="btn-primary">저장</button>
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
