import ExchangeRequest from '../models/ExchangeRequest.js';
import Item from '../models/Item.js';

// @desc    Create a swap request
// @route   POST /api/requests
// @access  Private
export const createRequest = async (req, res) => {
  try {
    const { requestedItemId, offeredItemId, message } = req.body;

    if (!requestedItemId || !message) {
      return res.status(400).json({ message: 'Please provide requested item and message' });
    }

    // Find requested item
    const requestedItem = await Item.findById(requestedItemId);
    if (!requestedItem) {
      return res.status(404).json({ message: 'Requested item not found' });
    }

    // Verify item is available
    if (requestedItem.status !== 'Available') {
      return res.status(400).json({ message: 'Requested item is no longer available' });
    }

    // Verify user doesn't request their own item
    if (requestedItem.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot request your own item' });
    }

    // Verify offered item (if provided)
    if (offeredItemId) {
      const offeredItem = await Item.findById(offeredItemId);
      if (!offeredItem) {
        return res.status(404).json({ message: 'Offered item not found' });
      }

      // Verify ownership
      if (offeredItem.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'You do not own the offered item' });
      }

      // Verify offered item availability
      if (offeredItem.status !== 'Available') {
        return res.status(400).json({ message: 'Offered item is not available for trade' });
      }
    }

    // Create the request
    const request = await ExchangeRequest.create({
      requestedItem: requestedItemId,
      offeredItem: offeredItemId || null,
      requester: req.user._id,
      receiver: requestedItem.owner,
      message,
    });

    res.status(201).json(request);
  } catch (error) {
    console.error('Create request error:', error.message);
    res.status(500).json({ message: 'Server Error: Failed to submit swap request' });
  }
};

// @desc    Get user's swap requests (incoming and outgoing)
// @route   GET /api/requests
// @access  Private
export const getRequests = async (req, res) => {
  try {
    // Fetch requests where user is either the requester or receiver
    const requests = await ExchangeRequest.find({
      $or: [{ requester: req.user._id }, { receiver: req.user._id }],
    })
      .populate('requestedItem', 'title category condition images status')
      .populate('offeredItem', 'title category condition images status')
      .populate('requester', 'name email avatar location')
      .populate('receiver', 'name email avatar location')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get requests error:', error.message);
    res.status(500).json({ message: 'Server Error: Failed to fetch requests' });
  }
};

// @desc    Accept a swap request
// @route   PUT /api/requests/:id/accept
// @access  Private
export const acceptRequest = async (req, res) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Exchange request not found' });
    }

    // Verify logged in user is the receiver
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to accept this request' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: `Request is already ${request.status}` });
    }

    // Fetch items
    const requestedItem = await Item.findById(request.requestedItem);
    const offeredItem = request.offeredItem ? await Item.findById(request.offeredItem) : null;

    if (!requestedItem || requestedItem.status !== 'Available') {
      return res.status(400).json({ message: 'Requested item is no longer available' });
    }

    if (offeredItem && offeredItem.status !== 'Available') {
      return res.status(400).json({ message: 'Offered item is no longer available' });
    }

    // Update items owner and status
    // Swap ownership: requestedItem owner becomes requester; offeredItem owner (requester) becomes current receiver
    requestedItem.owner = request.requester;
    requestedItem.status = 'Swapped';
    await requestedItem.save();

    if (offeredItem) {
      offeredItem.owner = request.receiver;
      offeredItem.status = 'Swapped';
      await offeredItem.save();
    }

    // Update request status
    request.status = 'Accepted';
    await request.save();

    // Auto-cancel all other pending requests referencing these items
    const itemIds = [request.requestedItem];
    if (request.offeredItem) {
      itemIds.push(request.offeredItem);
    }

    await ExchangeRequest.updateMany(
      {
        _id: { $ne: request._id },
        status: 'Pending',
        $or: [
          { requestedItem: { $in: itemIds } },
          { offeredItem: { $in: itemIds } },
        ],
      },
      { status: 'Rejected' }
    );

    res.json({ message: 'Swap request accepted and item ownership transferred successfully', request });
  } catch (error) {
    console.error('Accept request error:', error.message);
    res.status(500).json({ message: 'Server Error: Failed to accept request' });
  }
};

// @desc    Reject a swap request
// @route   PUT /api/requests/:id/reject
// @access  Private
export const rejectRequest = async (req, res) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Exchange request not found' });
    }

    // Verify logged in user is the receiver
    if (request.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to reject this request' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: `Request is already ${request.status}` });
    }

    request.status = 'Rejected';
    await request.save();

    res.json({ message: 'Swap request rejected successfully', request });
  } catch (error) {
    console.error('Reject request error:', error.message);
    res.status(500).json({ message: 'Server Error: Failed to reject request' });
  }
};

// @desc    Cancel a swap request
// @route   PUT /api/requests/:id/cancel
// @access  Private
export const cancelRequest = async (req, res) => {
  try {
    const request = await ExchangeRequest.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: 'Exchange request not found' });
    }

    // Verify logged in user is the requester
    if (request.requester.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to cancel this request' });
    }

    if (request.status !== 'Pending') {
      return res.status(400).json({ message: `Request is already ${request.status}` });
    }

    request.status = 'Cancelled';
    await request.save();

    res.json({ message: 'Swap request cancelled successfully', request });
  } catch (error) {
    console.error('Cancel request error:', error.message);
    res.status(500).json({ message: 'Server Error: Failed to cancel request' });
  }
};
