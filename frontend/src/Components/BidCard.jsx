import React from 'react';
import { GetUserQuery } from '../api/user';
import { tenderdetailsquery } from '../api/tender';
import Loading from './Loading';
import { useParams } from 'react-router';

const BidCard = ({ bid, toAccept, toReject, toDelete, loadingAccept, loadingReject, loadingDelete }) => {
  const { tenderId } = useParams();
  const { data: user, isLoading: userLoading, isError: userError } = GetUserQuery();
  const {
    data: tenderDetails,
    isLoading: tenderDetailsLoading,
    isError: tenderDetailsError,
  } = tenderdetailsquery(tenderId);

  if (userLoading || tenderDetailsLoading) return <Loading />;
  if (userError) return <div>Error in user fetching in BidCard</div>;
  if (tenderDetailsError) return <div>Error in tender fetching in BidCard</div>;

  const loggedInUserId = user?.id;

  return (
    <div
      key={bid?.id}
      className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
    >
      <div>
        <p className="text-gray-700">Reference Id: {bid?.id}</p>
        <p className="text-gray-700">Vendor: {bid?.vendor.name}</p>
        <p className="text-gray-500">Amount: {bid.amount} Lakhs</p>
        <p className="text-gray-500">Status: {bid.status}</p>
        <p className="text-gray-500">Date: {bid.updatedAt}</p>
      </div>
      <div>
        {loggedInUserId === tenderDetails.companyId ? (
          <div>
            {tenderDetails.status !== 'sold' && (
              <div className="flex space-x-2">
                {bid.status !== 'rejected' && (
                  <button
                    className={`bg-green-500 text-white py-2 px-4 rounded-lg ${
                      loadingAccept ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
                    }`}
                    onClick={toAccept}
                    disabled={loadingAccept}
                  >
                    {loadingAccept ? 'Accepting...' : 'Accept'}
                  </button>
                )}
                {bid.status !== 'rejected' && (
                  <button
                    className={`bg-red-500 text-white py-2 px-4 rounded-lg ${
                      loadingReject ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
                    }`}
                    onClick={toReject}
                    disabled={loadingReject}
                  >
                    {loadingReject ? 'Rejecting...' : 'Reject'}
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          loggedInUserId === bid.vendorId && (
            bid.status !== 'rejected' && (
              <button
                onClick={toDelete}
                className={`bg-red-500 text-white py-2 px-4 rounded-lg ${
                  loadingDelete ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-600'
                }`}
                disabled={loadingDelete}
              >
                {loadingDelete ? 'Deleting...' : 'Delete'}
              </button>
            )
          )
        )}
      </div>
    </div>
  );
};

export default BidCard;
