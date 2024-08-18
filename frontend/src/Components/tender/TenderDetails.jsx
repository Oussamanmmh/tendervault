import React, { useState, useEffect } from 'react';

import {tenderdetailsquery} from '../../api/tender'


import { useParams } from 'react-router-dom';

import Loading from '../utils/Loading'

import BidList from '../bids/BidList';
import TenderDetailsCard from './TenderDetailsCard';
const TenderDetails = () => {
  const { tenderId } = useParams();
  
  const {
    data: tenderDetails,
    isLoading: tenderDetailsLoading,
    isError: tenderDetailsError,
  } = tenderdetailsquery(tenderId);

  if (tenderDetailsError) {
    return <div>Error loading tenderdetails.</div>;
  }
if ( tenderDetailsLoading ) {
    return (
      <div style={{ minHeight: '800px', minWidth: '1200px' }}>
        <Loading />
      </div>
    );
  }
 
  return (
    <div className="bg-gray-200 w-full overflow-y-scroll scrollbar-hide pt-4">
      <TenderDetailsCard tenderDetails={tenderDetails}/>
     <BidList/>
  
    </div>
  );
};

export default TenderDetails;