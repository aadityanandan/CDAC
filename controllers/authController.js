exports.verifyOtp = (req, res) => {
    const userOtp = req.body.otp;

    if (userOtp === req.session.otp) {
        req.session.isAuthenticated = true; // Set authenticated session flag
        req.session.otp = null; // Clear OTP
        res.json({ success: true, message: 'OTP verified successfully.' });
    } else {
        res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }
};

exports.isAuthenticated = (req, res, next) => {
    if (req.session.isAuthenticated) {
        return next(); // User is authenticated, proceed to the requested page
    }
    res.redirect('/'); // Redirect to login/OTP page
};

