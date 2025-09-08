export const Log = async (stack, level, package_name, message) => {
  const apiUrl = '[http://20.244.56.144/evaluation-service/logs](http://20.244.56.144/evaluation-service/logs)';

  const logData = {
    stack: stack,
    level: level,
    package: package_name, 
    message: message,
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(logData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${errorData.message || 'Unknown error'}`);
    }

    const result = await response.json();
    console.log('Log created successfully:', result);
    return result; 

  } catch (error) {
    console.error('Failed to send log:', error);
    return null;
  }
};