
import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';
import { QRCodeSVG } from 'qrcode.react';

interface QRGeneratorProps {
  value: string;
  amount: number;
  currency: string;
  provider: string;
  language: Language;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ value, amount, currency, provider, language }) => {
  const t = TRANSLATIONS[language];
  const qrData = JSON.stringify({ app: 'dadonate', amount, currency, ref: value });

  const downloadSVG = () => {
    const svgElement = document.getElementById('qr-code-svg');
    if (!svgElement) return;
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svgElement);
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const filename = `dadonate_p2p_clearance_${amount}${currency}.svg`;
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-[#050505] border border-maroon dark:border-gold p-10 flex flex-col items-center animate-fade-in">
      <div className="text-center mb-10 w-full">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] block mb-4">
          {t.scanToPay} {provider}
        </span>
        <h3 className="text-5xl font-black tracking-tighter border-b border-black/5 dark:border-gold/10 pb-6 mb-6">
          {amount.toLocaleString()} <span className="text-maroon dark:text-gold uppercase">{currency}</span>
        </h3>
      </div>
      
      <div className="p-8 border border-black/10 dark:border-gold/30 bg-white mb-10 transition-all">
        <QRCodeSVG 
          id="qr-code-svg"
          value={qrData}
          size={220}
          level="H"
          fgColor="#000000"
          bgColor="#FFFFFF"
          includeMargin={true}
        />
      </div>

      <button 
        onClick={downloadSVG}
        className="mb-10 w-full px-8 py-5 bg-maroon text-gold border border-black font-black uppercase tracking-[0.4em] text-[10px] flex items-center justify-center gap-4 transition-all hover:opacity-90 btn-press"
      >
        <i className="fas fa-download"></i>
        {t.downloadQR || "Save Protocol"}
      </button>
      
      <div className="w-full text-center py-6 border-t border-black/10 dark:border-gold/20">
        <div className="flex items-center justify-center gap-3 text-[10px] font-black text-maroon dark:text-gold uppercase tracking-[0.4em] mb-2">
          <i className="fas fa-fingerprint"></i> Encrypted Gate
        </div>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
          P2P Secure Clearance • Nordic Protocol 1.0
        </p>
      </div>
    </div>
  );
};

export default QRGenerator;
