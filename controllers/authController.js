// Middleware to check if the user is authenticated
exports.isAuthenticated = (req, res, next) => {
    console.log('Session contents in isAuthenticated:', req.session);

    if (req.session.isVerified) {
        console.log('User is authenticated');
        return next(); // Allow the request to proceed
    }

    console.log('User is not authenticated');
    req.session.toastrMessage = "Please authenticate yourself first.";
    res.redirect('/'); // Redirect to the login page or another appropriate page
};











