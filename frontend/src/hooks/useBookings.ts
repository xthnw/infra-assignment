import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import type { APIResponse, Booking } from "../types";

const API_URL = "http://localhost:3000/bookings";

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (error.response?.data as { message?: string })?.message || error.message || "เกิดข้อผิดพลาด";
  }
  if (error instanceof Error) return error.message;
  return "เกิดข้อผิดพลาด";
};

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availableSeats, setAvailableSeats] = useState(10);
  const [isFull, setIsFull] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Logic 1: ดึงข้อมูล
  const fetchBookings = async () => {
    try {
      const { data } = await axios.get<APIResponse>(API_URL);
      setBookings(data.bookings);
      setAvailableSeats(data.availableSeats);
      setIsFull(data.status === "full");
    } catch (err: unknown) {
      console.error(err);
      toast.error("❌ เชื่อมต่อ Server ไม่ได้");
    }
  };

  // Logic 2: จองตั๋ว
  const bookTicket = async (name: string, email: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await axios.post(API_URL, { name, email });
      toast.success("✅ จองสำเร็จ");
      fetchBookings(); // รีเฟรช
      return true; // บอกว่าสำเร็จ
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      toast.error(`⚠️ ${message}`);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logic 3: ยกเลิก
  const cancelTicket = async (email: string) => {
    if (!confirm(`ยืนยันลบ ${email}?`)) return;
    try {
      await axios.delete(`${API_URL}/${email}`);
      toast.info("ℹ️ ยกเลิกเรียบร้อย");
      fetchBookings(); // รีเฟรช
    } catch {
      toast.error("❌ ลบไม่สำเร็จ");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // ส่งค่าออกไปให้ UI ใช้
  return {
    bookings,
    availableSeats,
    isFull,
    isLoading,
    bookTicket,
    cancelTicket,
  };
}
