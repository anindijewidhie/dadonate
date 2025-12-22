
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
    
    // Ensure standard XML namespaces are present for standalone SVG viewing in external viewers
    if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
      source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if (!source.match(/^<svg[^>]+xmlns\:xlink="http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
      source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }

    // Add XML declaration for full compatibility
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;

    // Use Blob and createObjectURL for better memory management and robustness with SVG serialization
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    // Construct a clear, professional filename for the creator/donor
    const safeProvider = provider.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `dadonate_${safeProvider}_${amount}${currency}_${timestamp}.svg`;

    // Trigger programmatic download
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    
    // Cleanup resources
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-[#121212] border-2 border-maroon dark:border-gold p-8 flex flex-col items-center animate-fade-in shadow-flat">
      <div className="text-center mb-8">
        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] block mb-2 italic">
          {t.scanToPay} {provider}
        </span>
        <h3 className="text-4xl font-black tracking-tighter italic">
          {amount.toLocaleString()} <span className="text-maroon dark:text-gold">{currency}</span>
        </h3>
      </div>
      
      <div className="p-6 border-premium bg-white mb-10 shadow-flat-lg group relative">
        <div className="absolute inset-0 bg-gold/5 group-hover:bg-transparent transition-colors pointer-events-none"></div>
        <QRCodeSVG 
          id="qr-code-svg"
          value={qrData}
          size={240}
          level="H"
          fgColor="#000000"
          bgColor="#FFFFFF"
          includeMargin={true}
        />
      </div>

      <button 
        onClick={downloadSVG}
        aria-label={t.downloadQR || "Download Payment QR Code"}
        className="mb-8 w-full px-8 py-5 bg-maroon text-gold border-premium shadow-flat hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all text-[11px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 group btn-press"
      >
        <i className="fas fa-file-arrow-down text-xl group-hover:animate-bounce"></i>
        {t.downloadQR || "Save QR as SVG"}
      </button>
      
      <div className="w-full text-center py-5 border-t-2 border-black/10 dark:border-gold/20">
        <div className="flex items-center justify-center gap-2 text-[10px] font-black text-maroon dark:text-gold uppercase tracking-[0.4em] mb-1">
          <i className="fas fa-shield-check"></i> Robust Clearance
        </div>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
          Standard {provider} QR Protocol • 256-bit Encrypted Metadata
        </p>
      </div>
    </div>
  );
};

export default QRGenerator;
