// async function submitForm() {
//     try {
//         const response = await fetch('https://localhost5000/form/submit-form-endpoint', {
//             method: 'POST', // Adjust as needed
//             headers: {
//                 'Content-Type': 'application/json',
//                 // Add other necessary headers
//             },
//             body: JSON.stringify(formData), 
//         });

//         if (!response.ok) {
//             // Handle server errors
//             const errorData = await response.json();
//             throw new Error(`Error: ${response.status} - ${JSON.stringify(errorData)}`);
//         }

//         // Handle successful response
//         const data = await response.json(); 
//         console.log('Success:', data);

//     } catch (error) {
//         console.error('Error:', error);
//         alert("An error occurred during form submission.");
//         // Add more specific error handling if necessary
//     }
// }


// async function submitForm() {
//     try {
//         // Ensure terms and conditions are accepted before proceeding
//         const acceptTerms = document.getElementById('acceptTerms');
//         if (!acceptTerms.checked) {
//             alert('You must accept the terms and conditions before submitting the form.');
//             return;
//         }

//         // Gather form data
//         const formData = new FormData();

//         // Collect data from Landing Page
//         const deploymentType = document.querySelector('input[name="deploymentType"]:checked');
//         if (deploymentType) {
//             formData.append('deploymentType', deploymentType.value);
//         }
//     }
// }

