const LOG_API_URL = "http://20.244.56.144/evaluation-service/logs";
const YOUR_SECRET_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJ2aWJob3JzaGFybWEwMDUzQGdtYWlsLmNvbSIsImV4cCI6MTc1NzMxOTY0NiwiaWF0IjoxNzU3MzE4NzQ2LCJpc3MiOiJBZmZvcmQgTWVkaWNhbCBUZWNobm9sb2dpZXMgUHJpdmF0ZSBMaW1pdGVkIiwianRpIjoiNGQxMmE3M2EtMThjZS00NWMxLWJiYmQtZTI5MzFmYzg1NmJkIiwibG9jYWxlIjoiZW4tSU4iLCJuYW1lIjoidmliaG9yIHNoYXJtYSIsInN1YiI6ImIwODU0NTUxLTEyM2YtNGQwNy1iOWMyLTRmNzc4MzdiOWViMCJ9LCJlbWFpbCI6InZpYmhvcnNoYXJtYTAwNTNAZ21haWwuY29tIiwibmFtZSI6InZpYmhvciBzaGFybWEiLCJyb2xsTm8iOiIyMjAxNjQxNTQwMTIyIiwiYWNjZXNzQ29kZSI6InNBV1R1UiIsImNsaWVudElEIjoiYjA4NTQ1NTEtMTIzZi00ZDA3LWI5YzItNGY3NzgzN2I5ZWIwIiwiY2xpZW50U2VjcmV0IjoiSHlBZkVxRUJ4ZFp0cm1IUCJ9.7U3hUnDTyWosH3Cv-X4iGix2Q5cM0Qry9E1L4sIRM2E";

export const Log = async (level, message, stackDetails = {}) => {
  const logPayload = {
    level: level,
    message: message,
    package: "frontend-test-submission", 
    stack: JSON.stringify(stackDetails), 
    timestamp: new Date().toISOString(),
  };

  try {
      await fetch(LOG_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${YOUR_SECRET_TOKEN}` 
      },
      body: JSON.stringify(logPayload),
      keepalive: true, 
    });
    
    console.log(`[LOG SENT - ${level}]: ${message}`);

  } catch (error) {
    console.error("CRITICAL: Failed to send log to remote server:", error);
  }
};