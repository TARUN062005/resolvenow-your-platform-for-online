import React from 'react';
import { MDBFooter } from 'mdb-react-ui-kit';

export default function FooterC() {
  return (
    <MDBFooter 
      style={{
        height: '112px', 
        marginTop: '101px',
        position: 'relative',
        bottom: 0,
        width: '100%'
      }} 
      bgColor='dark' 
      className='text-center text-lg-left'
    >
      <div className='text-center p-3' style={{ paddingTop: '1.5rem' }}>
        <p className='text-light' style={{ 
          fontSize: '1.2rem',
          fontWeight: '500',
          marginBottom: '0.5rem'
        }}>
          ComplaintCare
        </p>
        <p className='text-light' style={{ fontSize: '0.9rem' }}>
          &copy; {new Date().getFullYear()}
        </p>
      </div>
    </MDBFooter>
  );
}