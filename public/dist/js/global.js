function showAlert(displayText, alertType = 'warning') {

    switch (alertType) {
        case 'info':
            toastr.info(displayText);
            break;

        case 'success':
            toastr.success(displayText);
            break;

        case 'warning':
            toastr.warning(displayText);
            break;

        case 'error':
            toastr.error(displayText);
            break;

        default:
            toastr.warning(displayText);
            break;
    }
}
