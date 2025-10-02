import React, { useState } from 'react';
import { ACTIVITY_TYPES } from '../../constants';
import { generateId, formatDateTime } from '../../utils/helpers';

const ActivityTab = ({ customerId, activities, onSaveActivity, onDeleteActivity }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  const customerActivities = activities.filter(a => a.customerId === customerId);

  const handleSave = (activityData) => {
    onSaveActivity(activityData);
    setIsAdding(false);
    setEditingActivity(null);
  };

  const ActivityForm = ({ activity, onCancel }) => {
    const [formData, setFormData] = useState(
      activity || { type: ACTIVITY_TYPES[0], date: new Date().toISOString().slice(0, 16), content: '' }
    );

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const activityToSave = { ...formData, id: formData.id || generateId(), customerId };
        handleSave(activityToSave);
    };

    return (
      <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>활동 추가 - 여의도근무 여성분(렌코양창룸방)</h3>
            <button className="btn-close" onClick={onCancel}>×</button>
          </div>
          <div className="form-grid">
            <div className="form-group">
              <label>활동 유형 *</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>활동일시 *</label>
              <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>활동 내용 *</label>
              <textarea name="content" value={formData.content} onChange={handleChange} placeholder="활동 내용을 입력하세요"></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={onCancel} className="btn-secondary">취소</button>
            <button onClick={handleSubmit} className="btn-primary">저장</button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="activity-tab">
      {!isAdding && <button onClick={() => setIsAdding(true)}>+ 활동 추가</button>}
      {isAdding && <ActivityForm onCancel={() => setIsAdding(false)} />}
      {customerActivities.map(activity => (
        editingActivity?.id === activity.id ? (
            <ActivityForm key={activity.id} activity={activity} onCancel={() => setEditingActivity(null)} />
        ) : (
            <div key={activity.id} className="activity-item">
                <div className="item-header">
                    <strong>{activity.type}</strong>
                    <span>{formatDateTime(activity.date)}</span>
                </div>
                <p>{activity.content}</p>
                <div className="item-actions">
                    <button onClick={() => setEditingActivity(activity)}>수정</button>
                    <button onClick={() => onDeleteActivity(activity.id)}>삭제</button>
                </div>
            </div>
        )
      ))}
    </div>
  );
};

export default ActivityTab;
