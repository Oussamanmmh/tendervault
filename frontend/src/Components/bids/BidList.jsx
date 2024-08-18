import React, { useState } from 'react';
import { getallbidsquery, createbid, acceptBid, rejectBid, deletebid } from '../../api/bid';
import { GetMyDetailsQuery } from '../../api/user';
import { tenderdetailsquery } from '../../api/tender';
import { useParams } from 'react-router-dom';
import Loading from '../utils/Loading';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BidCard from './BidCard';
import Confirmation from '../utils/ConfirmationModal';

const BidList = () => {
  const { tenderId } = useParams();
  const [selectedBid, setSelectedBid] = useState(null);
  const [confirmationType, setConfirmationType] = useState(null);
  const [isBidding, setIsBidding] = useState(false);
  const [bidAmount, setBidAmount] = useState(0);
  const [sortBy, setSortBy] = useState(null);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingAccept, setLoadingAccept] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

 
  const { data: user, isLoading: userLoading, isError: userError } = GetMyDetailsQuery();
  const { data: tenderDetails, isLoading: tenderDetailsLoading, isError: tenderDetailsError, refetch: refetchTenderDetails } = tenderdetailsquery(tenderId);
  const { data: bids, isLoading: bidsLoading, isError: bidsError, refetch: refetchBids } = getallbidsquery(tenderId);

  const showToast = (message, type = 'error') => {
    toast[type](message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };
  if (userLoading || tenderDetailsLoading || bidsLoading) {
    return (
      <div style={{ minHeight: '800px', minWidth: '1200px' }}>
        <Loading />
      </div>
    );
  }

  if (userError || tenderDetailsError || bidsError) {
    return <div>Error loading data.</div>;
  }

  const handleSort = (order) => setSortBy(order);

  const handleBid = async () => {
    try {
      setLoadingAdd(true);
      const bidAmountFloat = parseFloat(bidAmount);

      if (isNaN(bidAmountFloat)) {
        showToast('Invalid bid amount', 'error');
        return;
      }
      if (bidAmountFloat < tenderDetails.cost) {
        showToast('Bid amount should be more than the cost of the tender', 'error');
        return;
      }

      await createbid(bidAmountFloat, tenderId);
      refetchBids();
      showToast('Bid Listed Successfully', 'success');
      
      // Refetch bids in the background
      
    } catch (error) {
      showToast('Some Error occurred in listing bid', 'error');
    } finally {
      setLoadingAdd(false);
      setIsBidding(false);
      setBidAmount(0);
    }
  };

  const handleConfirmAction = async () => {
    try {
      switch (confirmationType) {
        case 'delete':
          setLoadingDelete(true);
          await deletebid(selectedBid.id);
          
      refetchBids();
     
          showToast('Bid deleted successfully', 'success');
          break;
        case 'accept':
          setLoadingAccept(true);
          await acceptBid(selectedBid.id);
         
      refetchBids();
      refetchTenderDetails();
          showToast('Bid accepted successfully', 'success');
          break;
        case 'reject':
          setLoadingReject(true);
          await rejectBid(selectedBid.id);
         
      refetchBids();
 
          showToast('Bid rejected successfully', 'success');
          break;
        default:
          break;
      }

      
    } catch (error) {
      showToast('Error processing action', 'error');
    } finally {
      setLoadingDelete(false);
      setLoadingAccept(false);
      setLoadingReject(false);
      setSelectedBid(null);
      setConfirmationType(null);
    }
  };



  const sortedBids = [...bids];
  if (sortBy === 'lowToHigh') sortedBids.sort((a, b) => a.amount - b.amount);
  else if (sortBy === 'highToLow') sortedBids.sort((a, b) => b.amount - a.amount);

  return (
    <div>
      <div className="max-w-4xl mx-auto mt-8 space-y-4">
        {isBidding ? (
          <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-center">
            <input
              type="text"
              placeholder="Enter your bid amount"
              className="w-48 py-2 px-3 border rounded-l-lg"
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <button
              onClick={handleBid}
              className="bg-blue-500 text-white py-2 px-6 rounded-r-lg hover:bg-blue-600"
              style={{ alignSelf: 'center' }}
              disabled={loadingAdd}
            >
              {loadingAdd ? 'Submitting...' : 'Submit Bid'}
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            {user.role === 'vendor' && (
              <button
                onClick={() => setIsBidding(true)}
                className="bg-green-500 text-white py-2 px-6 rounded-lg hover-bg-green-600"
              >
                Bid
              </button>
            )}
          </div>
        )}
      </div>

      <div className="max-w-4xl mx-auto mt-8 space-y-4">
        <div className="flex justify-center">
          <h3 className="text-2xl font-semibold">Bids</h3>
          <div className="ml-4 flex">
            <button
              className={`${
                sortBy === 'lowToHigh' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
              } py-2 px-4 rounded-l-lg hover-bg-blue-600`}
              onClick={() => handleSort('lowToHigh')}
            >
              Low to High
            </button>
            <button
              className={`${
                sortBy === 'highToLow' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'
              } py-2 px-4 rounded-r-lg hover-bg-blue-600`}
              onClick={() => handleSort('highToLow')}
            >
              High to Low
            </button>
          </div>
        </div>

        {sortedBids?.length > 0 ? (
          sortedBids.map((bid) => (
            <BidCard
              key={bid.id}
              bid={bid}
              toAccept={() => { setSelectedBid(bid); setConfirmationType('accept'); }}
              toReject={() => { setSelectedBid(bid); setConfirmationType('reject'); }}
              toDelete={() => { setSelectedBid(bid); setConfirmationType('delete'); }}
              loadingAccept={loadingAccept}
              loadingReject={loadingReject}
              loadingDelete={loadingDelete}
            />
          ))
        ) : (
          <div className='flex items-center justify-center'>
            <p className="text-gray-600">No bids yet.</p>
          </div>
        )}
      </div>

      {selectedBid && (
        <Confirmation
          message={
            confirmationType === 'delete'
              ? 'Are you sure you want to delete this bid?'
              : confirmationType === 'accept'
              ? 'Are you sure you want to accept this bid?'
              : 'Are you sure you want to reject this bid?'
          }
          onConfirm={handleConfirmAction}
          onCancel={() => { setSelectedBid(null); setConfirmationType(null); }}
          confirmButtonClass={
            confirmationType === 'accept' ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-red-500 hover:bg-red-600 text-white'
          }
        />
      )}
    </div>
  );
};

export default BidList;
