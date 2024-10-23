async function submitForm() {
    try {
        const response = await fetch('https://localhost5000/form/submit-form-endpoint', {
            method: 'POST', // Adjust as needed
            headers: {
                'Content-Type': 'application/json',
                // Add other necessary headers
            },
            body: JSON.stringify(formData), 
        });

        if (!response.ok) {
            // Handle server errors
            const errorData = await response.json();
            throw new Error(`Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        // Handle successful response
        const data = await response.json(); 
        console.log('Success:', data);

    } catch (error) {
        console.error('Error:', error);
        alert("An error occurred during form submission.");
        // Add more specific error handling if necessary
    }
}