import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import BookingForm from './components/BookingForm';
import BookingList from './components/BookingList';
import { useBookings } from './hooks/useBookings';
import { useState } from 'react';

import WMSMap from './components/WMSMap';
import GeoJSONMap from './components/GeoJSONMap';

function App() {

  const { bookings, availableSeats, isFull, isLoading, bookTicket, cancelTicket } = useBookings();

  // State สลับ Tab แผนที่ ('wms' หรือ 'geojson')
  const [mapMode, setMapMode] = useState<'wms' | 'geojson'>('geojson'); // เริ่มที่ geojson

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 font-sans">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-900 mb-10">
          🚀 ระบบจองตั๋ว Infra Ticket
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">🗺️ ระบบข้อมูลแผนที่ (GIS)</h2>

            {/* ปุ่มสลับ Tab */}
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setMapMode('wms')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mapMode === 'wms' ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'
                  }`}
              >
                📡 Server WMS
              </button>
              <button
                onClick={() => setMapMode('geojson')}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mapMode === 'geojson' ? 'bg-green-600 text-white shadow' : 'text-gray-600 hover:bg-gray-200'
                  }`}
              >
                📂 Local GeoJSON
              </button>
            </div>
          </div>

          {mapMode === 'wms' ? <WMSMap /> : <GeoJSONMap />}

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BookingForm
            onSubmit={bookTicket}
            isLoading={isLoading}
            isFull={isFull}
          />

          <BookingList
            bookings={bookings}
            availableSeats={availableSeats}
            onCancel={cancelTicket}
          />
        </div>
      </div>
    </div>
  );
}

export default App;