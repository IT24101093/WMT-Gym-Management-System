const Booking = require('../models/bookingModel');

// @desc    Get all bookings for a user
// @route   GET /api/bookings
// @access  Private
const getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('trainer', 'name').sort({ date: -1 });
        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    const { trainer, className, date, notes } = req.body;

    if (!trainer || !className || !date) {
        return res.status(400).json({ message: 'Trainer, class name, and date are required' });
    }

    try {
        const booking = await Booking.create({
            trainer,
            className,
            date,
            notes,
            user: req.user._id
        });
        res.status(201).json(booking);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private
const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await booking.remove();
        res.status(200).json({ message: 'Booking cancelled' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getBookings,
    createBooking,
    deleteBooking
};