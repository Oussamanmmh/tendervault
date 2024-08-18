import React from 'react';
import TenderDetails from './TenderDetails';
import Navbar from '../Navbar';
import Rightupbar from '../utils/Rightupbar';
import Rightdownbar from '../utils/Rightdownbar';

import { GetMyDetailsQuery } from '../../api/user';
import Loading from '../utils/Loading';

const TenderDetail = () => {
   const { data: user, isLoading: userLoading, isError: userError } = GetMyDetailsQuery();
     if (userLoading ) {
    return (
      <div style={{ minHeight: '800px', minWidth: '1200px' }}>
        <Loading/>
      </div>
    );
  }

  if (userError ) {
    return <div>Error loading data.</div>;
  }

  return (
   
     <div className="t">
      <div className="">
        <Navbar user={user}/>
        <div className="flex flex-row h-[90vh] min-w-screen ">
        
          <TenderDetails />
    
          <div className="hidden lg:grid justify-items-center w-[43%]  bg-gray-200 ">
            <Rightupbar />

            <Rightdownbar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenderDetail;
