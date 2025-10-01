const CUSTOMERS_KEY = 'customers';
const ACTIVITIES_KEY = 'activities';
const MEETINGS_KEY = 'meetings';

// Generic getter function
const getData = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error(`Error reading ${key} from localStorage`, error);
    return [];
  }
};

// Generic setter function
const saveData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage`, error);
    if (error.name === 'QuotaExceededError') {
        alert('저장 공간이 부족합니다. 오래된 데이터를 백업 후 정리하세요.');
    }
  }
};

// Customer functions
export const getCustomers = () => getData(CUSTOMERS_KEY);
export const saveCustomers = (customers) => saveData(CUSTOMERS_KEY, customers);

// Activity functions
export const getActivities = () => getData(ACTIVITIES_KEY);
export const saveActivities = (activities) => saveData(ACTIVITIES_KEY, activities);

// Meeting functions
export const getMeetings = () => getData(MEETINGS_KEY);
export const saveMeetings = (meetings) => saveData(MEETINGS_KEY, meetings);
