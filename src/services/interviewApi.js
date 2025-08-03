import api from './api';

// ✅ Get all interview schedules
export const getAllInterviewsApi = async () => {
  const res = await api.get('/interview');
  return res.data;
};

// ✅ Get one interview by ID
export const getInterviewByIdApi = async (id) => {
  const res = await api.get(`/interview/${id}`);
  return res.data;
};

// ✅ Create new interview
export const createInterviewApi = async (payload) => {
  const res = await api.post('/interview', payload);
  return res.data;
};

// ✅ Update interview (date, duration, location, interviewers)
export const updateInterviewApi = async (id, payload) => {
  const res = await api.put(`/interview/${id}`, payload);
  return res.data;
};

export const rescheduleInterviewApi = async (id, start_at) => {
  const res = await api.put(`/interview/${id}/reschedule`, { start_at });
  return res.data;
};

// ✅ Update result (score, comment, attachments, status)
export const updateInterviewResultApi = async (id, interviewData) => {
  const formData = new FormData();

  formData.append('status', interviewData?.status || 'scheduled');

  const interviewersArray = Array.isArray(interviewData?.interviewers)
    ? interviewData.interviewers
    : [];

  const strippedInterviewers = interviewersArray.map(i => ({
    employee: typeof i.employee === 'object' ? i.employee._id : i.employee,
    score: i.score || 0,
    comment: i.comment || '',
  }));

  formData.append('interviewers', JSON.stringify(strippedInterviewers));

  // Append files
  interviewersArray.forEach((interviewer, index) => {
    if (Array.isArray(interviewer.newAttachments)) {
      interviewer.newAttachments.forEach(file => {
        const actualFile = file.originFileObj || file;
        console.log(`📦 Will append interviewer_${index}`, actualFile);

        if (actualFile instanceof File) {
          formData.append(`interviewer_${index}`, actualFile);
        } else {
          console.warn(`⚠️ Not a File object for interviewer_${index}`, actualFile);
        }
      });
    }
  });

  // ✅ Final log before sending
  for (let [key, value] of formData.entries()) {
    console.log('🧩 FormData entry:', key, value);
  }

  const res = await api.put(`/interview/${id}/result`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return res.data;
};

// ✅ Cancel interview
export const cancelInterviewApi = async (id) => {
  const res = await api.put(`/interview/${id}/cancel`);
  return res.data;
};
