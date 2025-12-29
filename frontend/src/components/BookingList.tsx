import type { Booking } from '../types';

interface Props {
    bookings: Booking[];
    availableSeats: number;
    onCancel: (email: string) => void;
}

export default function BookingList({ bookings, availableSeats, onCancel }: Props) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">📋 รายชื่อผู้จอง</h2>
                <span className={`px-4 py-1 rounded-full text-sm font-bold ${availableSeats > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    ว่าง {availableSeats} ที่นั่ง
                </span>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {bookings.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">ยังไม่มีการจอง</p>
                ) : (
                    bookings.map((booking) => (
                        <div key={booking.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                            <div>
                                <p className="font-semibold text-gray-800">{booking.name}</p>
                                <p className="text-sm text-gray-500">{booking.email}</p>
                            </div>
                            <button
                                onClick={() => onCancel(booking.email)}
                                className="text-red-500 hover:text-red-700 text-sm px-3 py-1 border border-red-200 rounded hover:bg-red-50 transition-colors"
                            >
                                ยกเลิก
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}