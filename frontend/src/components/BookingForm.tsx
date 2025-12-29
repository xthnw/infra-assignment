import { useState } from 'react';

interface Props {
    onSubmit: (name: string, email: string) => Promise<boolean>;
    isLoading: boolean;
    isFull: boolean;
}

export default function BookingForm({ onSubmit, isLoading, isFull }: Props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !email) return;

        const isSuccess = await onSubmit(name, email);

        if (isSuccess) {
            setName('');
            setEmail('');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">🎫 จองตั๋วงาน Event</h2>

            {isFull ? (
                <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 text-center font-bold">
                    ⚠️ ขณะนี้ที่นั่งเต็มแล้ว (Full)
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อ-นามสกุล</label>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="กรอกชื่อของคุณ"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">อีเมล</label>
                        <input
                            type="email"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLoading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 px-4 rounded-lg text-white font-bold transition-all
                ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg'}
            `}
                    >
                        {isLoading ? 'กำลังบันทึก...' : 'ยืนยันการจอง'}
                    </button>
                </form>
            )}
        </div>
    );
}