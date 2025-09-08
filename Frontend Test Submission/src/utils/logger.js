
export const Log = async (stack, level, package_name, message) => {
  const apiUrl = 'http://20.244.56.144/evaluation-service/logs';
  const logData = {
    stack: stack,
    level: level,
    package: package_name,
    message: message,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(logData),
    });
    if (!response.ok) {
        console.error('API Error:', response.status, await response.text());
    }
    console.info('Log sent successfully:', await response.json());
  } catch (error) {
    console.error('Failed to send log:', error);
  }
};
