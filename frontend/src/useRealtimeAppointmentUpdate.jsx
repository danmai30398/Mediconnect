import { useEffect } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

function useRealtimeAppointmentUpdate(onUpdate) {
  useEffect(() => {
    const evtSource = new EventSource(`${API_BASE_URL}/sse/appointments`);

    evtSource.onmessage = function (event) {
      const data = JSON.parse(event.data);
      if (data.timestamp) {
        onUpdate(data.timestamp);
      }
    };

    return () => {
      evtSource.close();
    };
  }, [onUpdate]);
}
export default useRealtimeAppointmentUpdate;