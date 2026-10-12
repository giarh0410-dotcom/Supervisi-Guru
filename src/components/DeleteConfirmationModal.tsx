import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  type: 'single' | 'all';
  targetTitle?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  isOpen,
  type,
  targetTitle,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all p-6 space-y-5">
        {/* Header Icon & Close */}
        <div className="flex items-start justify-between">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-lg font-black text-slate-900">
            {type === 'single'
              ? 'Hapus Data Hasil Telaah RPP?'
              : 'Hapus Seluruh Data Rekapan?'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {type === 'single' ? (
              <>
                Apakah Anda yakin ingin menghapus data telaah RPP untuk{' '}
                <strong className="text-rose-700 font-bold">{targetTitle || 'guru ini'}</strong>?
                Tindakan ini tidak dapat dibatalkan.
              </>
            ) : (
              <>
                Apakah Anda yakin ingin menghapus <strong className="text-rose-700">SEMUA</strong>{' '}
                data rekapan hasil telaah RPP yang tersimpan? Seluruh riwayat penilaian guru akan
                dikosongkan.
              </>
            )}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs sm:text-sm transition-all shadow-lg shadow-rose-600/30 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Ya, Hapus Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
