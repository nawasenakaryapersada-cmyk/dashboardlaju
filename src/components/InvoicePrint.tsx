import { useEffect } from 'react';
import { OrderWithItems } from '../lib/supabase';
import { Car } from 'lucide-react';

interface InvoicePrintProps {
  order: OrderWithItems;
  onClose: () => void;
}

export default function InvoicePrint({ order, onClose }: InvoicePrintProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl my-8 rounded-lg shadow-2xl">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center print:hidden">
          <h2 className="text-xl font-bold text-gray-900">Preview Invoice</h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Cetak Invoice
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Tutup
            </button>
          </div>
        </div>

        <div className="p-8 bg-white print:p-12" id="invoice-content">
          <div className="border-4 border-blue-600 rounded-lg p-8">
            <div className="flex items-start justify-between mb-8 pb-6 border-b-2 border-blue-600">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-600 p-3 rounded-lg">
                    <Car className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-blue-600">RENTAL MOBIL</h1>
                    <p className="text-sm text-gray-600">Layanan Sewa Mobil Terpercaya</p>
                  </div>
                </div>
                <div className="mt-4 text-sm text-gray-600">
                  <p>Jl. Contoh No. 123, Jakarta</p>
                  <p>Telp: (021) 1234-5678</p>
                  <p>Email: info@rentalmobil.com</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">INVOICE</h2>
                <div className="text-sm space-y-1">
                  <p className="text-gray-600">
                    <span className="font-semibold">No. Invoice:</span>
                    <br />
                    <span className="font-mono text-gray-900">#{order.id.substring(0, 8).toUpperCase()}</span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Tanggal:</span>
                    <br />
                    <span className="text-gray-900">{formatDate(order.order_date)}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b border-gray-300">
              <div>
                <h3 className="text-sm font-bold text-blue-600 mb-3 uppercase tracking-wide">Informasi Pelanggan</h3>
                <div className="space-y-1 text-sm">
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-900">{order.customer_name}</span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Telepon:</span> {order.customer_phone}
                  </p>
                  {order.customer_address && (
                    <p className="text-gray-600">
                      <span className="font-medium">Alamat:</span><br />
                      {order.customer_address}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-blue-600 mb-3 uppercase tracking-wide">Periode Sewa</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2 text-sm">
                  <p className="text-gray-600">
                    <span className="font-medium">Mulai:</span>
                    <br />
                    <span className="font-semibold text-gray-900">{formatDate(order.rental_start_date)}</span>
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Selesai:</span>
                    <br />
                    <span className="font-semibold text-gray-900">{formatDate(order.rental_end_date)}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-blue-600 mb-4 uppercase tracking-wide">Rincian Item Sewa</h3>
              <div className="border-2 border-gray-300 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="text-left px-4 py-3 text-sm font-semibold border-r border-blue-500">Tipe Mobil</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold border-r border-blue-500">Unit</th>
                      <th className="text-center px-4 py-3 text-sm font-semibold border-r border-blue-500">Hari</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold border-r border-blue-500">Harga/Hari</th>
                      <th className="text-right px-4 py-3 text-sm font-semibold">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.order_items.map((item, index) => (
                      <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 border-r border-b border-gray-300 text-sm font-medium text-gray-900">
                          {item.car_type}
                        </td>
                        <td className="px-4 py-3 border-r border-b border-gray-300 text-center text-sm text-gray-700">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-3 border-r border-b border-gray-300 text-center text-sm text-gray-700">
                          {item.days}
                        </td>
                        <td className="px-4 py-3 border-r border-b border-gray-300 text-right text-sm text-gray-700">
                          {formatCurrency(item.daily_rate)}
                        </td>
                        <td className="px-4 py-3 border-b border-gray-300 text-right text-sm font-semibold text-gray-900">
                          {formatCurrency(item.subtotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end mb-8">
              <div className="w-full max-w-md">
                <div className="bg-blue-600 text-white p-6 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold uppercase">Total Pembayaran</span>
                    <span className="text-3xl font-bold">{formatCurrency(order.total_amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {order.notes && (
              <div className="mb-8 pb-6 border-b border-gray-300">
                <h3 className="text-sm font-bold text-blue-600 mb-3 uppercase tracking-wide">Catatan</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-gray-700">{order.notes}</p>
                </div>
              </div>
            )}

            <div className="border-t-2 border-gray-300 pt-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-12">Penyewa</p>
                  <div className="border-t-2 border-gray-800 pt-2">
                    <p className="text-sm font-semibold text-gray-900">{order.customer_name}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-12">Petugas</p>
                  <div className="border-t-2 border-gray-800 pt-2">
                    <p className="text-sm font-semibold text-gray-900">(_________________)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-300 text-center">
              <p className="text-xs text-gray-500">
                Invoice ini sah dan diproses oleh sistem. Terima kasih atas kepercayaan Anda.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Untuk pertanyaan, hubungi customer service kami di (021) 1234-5678
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
