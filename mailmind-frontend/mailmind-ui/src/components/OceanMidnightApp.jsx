import React from 'react';

const OceanMidnightApp = ({ 
  title = "Uygulama Paneli", 
  subtitle = "Ocean Midnight Teması",
  buttons = ['Ayarlar', 'Profil', 'Raporlar', 'Yardım'],
  onButtonClick = (buttonName) => console.log(`${buttonName} clicked`)
}) => {

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #f0f6ff 0%, #e6f1ff 15%, #d4e8ff 30%, #b8d9ff 45%, #9ac9ff 60%, #7bb8ff 75%, #5ca7ff 90%, #4a96e6 100%)'
      }}
    >
      {/* Bulut Animasyonları */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full blur-sm"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.4) 0%, rgba(173, 216, 255, 0.3) 30%, rgba(135, 196, 255, 0.2) 60%, transparent 100%)',
              width: `${200 + i * 30}px`,
              height: `${100 + i * 15}px`,
              top: `${10 + i * 15}%`,
              left: i % 2 === 0 ? `-${80 + i * 20}px` : 'auto',
              right: i % 2 === 1 ? `-${80 + i * 20}px` : 'auto',
              animation: `cloudFloat${i} ${25 + i * 3}s infinite ease-in-out`,
              animationDelay: `${-i * 3}s`,
              animationDirection: i % 2 === 1 ? 'reverse' : 'normal'
            }}
          />
        ))}
      </div>

      {/* Overlay Pattern */}
      <div 
        className="absolute top-0 left-0 w-full h-full"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(173, 216, 255, 0.2) 0%, transparent 35%),
            radial-gradient(circle at 40% 70%, rgba(135, 196, 255, 0.1) 0%, transparent 30%),
            radial-gradient(circle at 90% 80%, rgba(255, 255, 255, 0.12) 0%, transparent 45%),
            radial-gradient(circle at 10% 90%, rgba(173, 216, 255, 0.18) 0%, transparent 38%)
          `,
          animation: 'shimmer 15s infinite ease-in-out'
        }}
      />

      {/* Texture Layer */}
      <div 
        className="absolute top-0 left-0 w-full h-full opacity-60"
        style={{
          background: `repeating-linear-gradient(
            45deg,
            transparent,
            transparent 2px,
            rgba(255, 255, 255, 0.03) 2px,
            rgba(255, 255, 255, 0.03) 4px
          )`
        }}
      />

      {/* Ana Uygulama Paneli */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-5 font-sans">
        <div 
          className="relative overflow-hidden max-w-md w-full p-10 rounded-3xl border border-white/80"
          style={{
            background: 'linear-gradient(145deg, #f8fafc, #f1f5f9)',
            backdropFilter: 'blur(20px)',
            boxShadow: `
              0 20px 60px rgba(0, 0, 0, 0.15),
              0 8px 25px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.9)
            `,
            animation: 'panelFloat 6s ease-in-out infinite'
          }}
        >
          {/* Panel Shine Effect */}
          <div 
            className="absolute top-0 w-full h-full pointer-events-none"
            style={{
              left: '-100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)',
              animation: 'shine 3s ease-in-out infinite'
            }}
          />

          {/* Header */}
          <div className="text-center mb-8">
            <h1 
              className="text-4xl font-semibold mb-3 relative"
              style={{
                color: '#0f172a',
                textShadow: `
                  0 4px 8px rgba(15, 23, 42, 0.15),
                  0 2px 4px rgba(15, 23, 42, 0.1),
                  0 1px 2px rgba(255, 255, 255, 0.8)
                `,
                animation: 'titleFloat 4s ease-in-out infinite'
              }}
            >
              {title}
              <div 
                className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none"
                style={{
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.3) 50%, transparent 70%)',
                  animation: 'titleShine 3s ease-in-out infinite'
                }}
              />
            </h1>
            <p 
              className="text-base opacity-90"
              style={{
                color: '#1e3a8a',
                textShadow: `
                  0 2px 4px rgba(30, 58, 138, 0.1),
                  0 1px 2px rgba(255, 255, 255, 0.6)
                `,
                animation: 'subtitleFloat 5s ease-in-out infinite',
                animationDelay: '-1s'
              }}
            >
              {subtitle}
            </p>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Ana İşlem Butonu */}
            <button
              onClick={() => onButtonClick('Ana İşlem')}
              className="col-span-2 px-5 py-4 rounded-2xl text-base font-semibold cursor-pointer transition-all duration-300 relative overflow-hidden border-none"
              style={{
                background: 'linear-gradient(145deg, #1e3a8a, #1e293b)',
                color: '#ffffff',
                boxShadow: `
                  0 4px 15px rgba(0, 0, 0, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-3px)';
                e.target.style.background = 'linear-gradient(145deg, #1e293b, #0f172a)';
                e.target.style.boxShadow = `
                  0 8px 25px rgba(0, 0, 0, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `;
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.background = 'linear-gradient(145deg, #1e3a8a, #1e293b)';
                e.target.style.boxShadow = `
                  0 4px 15px rgba(0, 0, 0, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `;
              }}
            >
              Ana İşlem
            </button>

            {/* Diğer Butonlar */}
            {buttons.map((buttonText) => (
              <button
                key={buttonText}
                onClick={() => onButtonClick(buttonText)}
                className="px-5 py-4 rounded-2xl text-base font-medium cursor-pointer transition-all duration-300 relative overflow-hidden border-none"
                style={{
                  background: 'linear-gradient(145deg, #ffffff, #f8fafc)',
                  color: '#0f172a',
                  boxShadow: `
                    0 4px 15px rgba(0, 0, 0, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 1)
                  `
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.background = 'linear-gradient(145deg, #ffffff, #f1f5f9)';
                  e.target.style.boxShadow = `
                    0 8px 25px rgba(0, 0, 0, 0.15),
                    inset 0 1px 0 rgba(255, 255, 255, 1)
                  `;
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.background = 'linear-gradient(145deg, #ffffff, #f8fafc)';
                  e.target.style.boxShadow = `
                    0 4px 15px rgba(0, 0, 0, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 1)
                  `;
                }}
              >
                {buttonText}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animasyonları */}
      <style jsx>{`
        @keyframes cloudFloat0 {
          0%, 100% { transform: translateX(0) translateY(0) scale(1); opacity: 0.3; }
          25% { transform: translateX(100px) translateY(-20px) scale(1.1); opacity: 0.5; }
          50% { transform: translateX(200px) translateY(10px) scale(0.9); opacity: 0.4; }
          75% { transform: translateX(150px) translateY(-15px) scale(1.05); opacity: 0.6; }
        }
        @keyframes cloudFloat1 {
          0%, 100% { transform: translateX(0) translateY(0) scale(1); opacity: 0.4; }
          33% { transform: translateX(-80px) translateY(-10px) scale(1.05); opacity: 0.6; }
          66% { transform: translateX(-120px) translateY(15px) scale(0.95); opacity: 0.3; }
        }
        @keyframes cloudFloat2 {
          0%, 100% { transform: translateX(0) translateY(0) scale(1); opacity: 0.35; }
          50% { transform: translateX(90px) translateY(-25px) scale(1.1); opacity: 0.5; }
        }
        @keyframes cloudFloat3 {
          0%, 100% { transform: translateX(0) translateY(0) scale(1); opacity: 0.4; }
          40% { transform: translateX(-60px) translateY(12px) scale(0.9); opacity: 0.3; }
          80% { transform: translateX(-30px) translateY(-8px) scale(1.05); opacity: 0.6; }
        }
        @keyframes cloudFloat4 {
          0%, 100% { transform: translateX(0) translateY(0) scale(1); opacity: 0.3; }
          25% { transform: translateX(-100px) translateY(-18px) scale(1.08); opacity: 0.5; }
          75% { transform: translateX(-150px) translateY(20px) scale(0.92); opacity: 0.4; }
        }
        @keyframes cloudFloat5 {
          0%, 100% { transform: translateX(0) translateY(0) scale(1); opacity: 0.35; }
          60% { transform: translateX(70px) translateY(-12px) scale(1.03); opacity: 0.6; }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.7; }
        }
        @keyframes panelFloat {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-5px) rotate(0.5deg); }
          50% { transform: translateY(2px) rotate(0deg); }
          75% { transform: translateY(-3px) rotate(-0.3deg); }
        }
        @keyframes shine {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
        @keyframes titleFloat {
          0%, 100% { 
            transform: translateY(0) scale(1);
            text-shadow: 0 4px 8px rgba(15, 23, 42, 0.15), 0 2px 4px rgba(15, 23, 42, 0.1), 0 1px 2px rgba(255, 255, 255, 0.8);
          }
          25% { 
            transform: translateY(-2px) scale(1.02);
            text-shadow: 0 6px 12px rgba(15, 23, 42, 0.2), 0 3px 6px rgba(15, 23, 42, 0.15), 0 1px 3px rgba(255, 255, 255, 0.9);
          }
          50% { 
            transform: translateY(1px) scale(1);
            text-shadow: 0 3px 6px rgba(15, 23, 42, 0.12), 0 2px 4px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(255, 255, 255, 0.7);
          }
          75% { 
            transform: translateY(-1px) scale(1.01);
            text-shadow: 0 5px 10px rgba(15, 23, 42, 0.18), 0 2px 5px rgba(15, 23, 42, 0.12), 0 1px 2px rgba(255, 255, 255, 0.85);
          }
        }
        @keyframes titleShine {
          0% { transform: translateX(-100%) skew(-20deg); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateX(100%) skew(-20deg); opacity: 0; }
        }
        @keyframes subtitleFloat {
          0%, 100% { 
            transform: translateY(0);
            text-shadow: 0 2px 4px rgba(30, 58, 138, 0.1), 0 1px 2px rgba(255, 255, 255, 0.6);
          }
          33% { 
            transform: translateY(-1px);
            text-shadow: 0 3px 6px rgba(30, 58, 138, 0.15), 0 1px 3px rgba(255, 255, 255, 0.7);
          }
          66% { 
            transform: translateY(1px);
            text-shadow: 0 1px 3px rgba(30, 58, 138, 0.08), 0 1px 2px rgba(255, 255, 255, 0.5);
          }
        }
      `}</style>
    </div>
  );
};

export default OceanMidnightApp;