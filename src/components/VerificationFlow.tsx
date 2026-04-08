import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Camera, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  X, 
  ArrowRight, 
  FileText,
  Scan,
  UserCheck
} from 'lucide-react';
import Webcam from 'react-webcam';

interface VerificationFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  eventTitle: string;
}

type Step = 'intro' | 'document' | 'face' | 'success';

const VerificationFlow: React.FC<VerificationFlowProps> = ({ isOpen, onClose, onComplete, eventTitle }) => {
  const [step, setStep] = useState<Step>('intro');
  const [loading, setLoading] = useState(false);
  const [docType, setDocType] = useState<'aadhaar' | 'pan'>('aadhaar');
  const [docNumber, setDocNumber] = useState('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  }, [webcamRef]);

  const handleNextStep = async () => {
    setLoading(true);
    // Simulate API call for each step
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);

    if (step === 'intro') setStep('document');
    else if (step === 'document') setStep('face');
    else if (step === 'face') setStep('success');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-all z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-10">
          <AnimatePresence mode="wait">
            {step === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-orange-100 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Shield className="w-10 h-10 text-orange-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Identity Verification</h2>
                <p className="text-gray-600 mb-8">
                  To book <span className="font-bold text-gray-900">"{eventTitle}"</span>, we need to verify your identity. This keeps our community safe and real.
                </p>
                <div className="space-y-4 mb-10 text-left">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <FileText className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">Step 1: Document Check</div>
                      <div className="text-xs text-gray-500">Verify your Aadhaar or PAN card details.</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Scan className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">Step 2: Face Recognition</div>
                      <div className="text-xs text-gray-500">Quick selfie to match your ID.</div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleNextStep}
                  disabled={loading}
                  className="w-full bg-orange-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-3"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Start Verification <ArrowRight className="w-5 h-5" /></>}
                </button>
              </motion.div>
            )}

            {step === 'document' && (
              <motion.div
                key="document"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Document Verification</h2>
                    <p className="text-sm text-gray-500">Enter your government ID details</p>
                  </div>
                </div>

                <div className="space-y-6 mb-10">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setDocType('aadhaar')}
                      className={`flex-1 py-4 rounded-2xl font-bold border-2 transition-all ${docType === 'aadhaar' ? 'border-orange-600 bg-orange-50 text-orange-600' : 'border-gray-100 text-gray-500'}`}
                    >
                      Aadhaar Card
                    </button>
                    <button
                      onClick={() => setDocType('pan')}
                      className={`flex-1 py-4 rounded-2xl font-bold border-2 transition-all ${docType === 'pan' ? 'border-orange-600 bg-orange-50 text-orange-600' : 'border-gray-100 text-gray-500'}`}
                    >
                      PAN Card
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                      {docType === 'aadhaar' ? 'Aadhaar Number' : 'PAN Number'}
                    </label>
                    <input 
                      type="text"
                      placeholder={docType === 'aadhaar' ? 'XXXX XXXX XXXX' : 'ABCDE1234F'}
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none text-lg font-mono tracking-widest"
                    />
                  </div>

                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-blue-800 leading-relaxed">
                      Your data is encrypted and used only for identity verification. We do not store your full ID number.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleNextStep}
                  disabled={loading || docNumber.length < 10}
                  className="w-full bg-orange-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <>Verify Document <ArrowRight className="w-5 h-5" /></>}
                </button>
              </motion.div>
            )}

            {step === 'face' && (
              <motion.div
                key="face"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="flex items-center gap-3 mb-8 text-left">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                    <Scan className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Face Recognition</h2>
                    <p className="text-sm text-gray-500">Match your face with your ID</p>
                  </div>
                </div>

                <div className="relative w-full aspect-square max-w-[320px] mx-auto mb-8 rounded-[2rem] overflow-hidden border-4 border-orange-100 shadow-inner bg-gray-900">
                  {!capturedImage ? (
                    <>
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-full object-cover"
                        videoConstraints={{ facingMode: 'user' }}
                        mirrored={false}
                        screenshotQuality={0.92}
                        forceScreenshotSourceSize={false}
                        imageSmoothing={true}
                        onUserMedia={() => {}}
                        onUserMediaError={() => {}}
                        onStreamVideoError={() => {}}
                        disablePictureInPicture={true}
                        minScreenshotHeight={480}
                        minScreenshotWidth={640}
                      />
                      <div className="absolute inset-0 border-[40px] border-black/20 pointer-events-none">
                        <div className="w-full h-full border-2 border-orange-500/50 rounded-full animate-pulse" />
                      </div>
                    </>
                  ) : (
                    <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
                  )}
                </div>

                {!capturedImage ? (
                  <button
                    onClick={capture}
                    className="w-20 h-20 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl shadow-orange-100 hover:scale-105 transition-transform"
                  >
                    <Camera className="w-10 h-10 text-white" />
                  </button>
                ) : (
                  <div className="flex gap-4 mb-8">
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition-all"
                    >
                      Retake
                    </button>
                    <button
                      onClick={handleNextStep}
                      disabled={loading}
                      className="flex-2 bg-orange-600 text-white py-4 px-8 rounded-2xl font-bold hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-3"
                    >
                      {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Confirm Face <CheckCircle2 className="w-5 h-5" /></>}
                    </button>
                  </div>
                )}

                <p className="text-xs text-gray-400">
                  Position your face within the circle and ensure good lighting.
                </p>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <UserCheck className="w-12 h-12 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4">Identity Verified!</h2>
                <p className="text-gray-600 mb-10">
                  Your identity has been successfully matched. You are now authorized to proceed to payment.
                </p>
                <button
                  onClick={onComplete}
                  className="w-full bg-gray-900 text-white py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-3"
                >
                  Proceed to Payment <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationFlow;
