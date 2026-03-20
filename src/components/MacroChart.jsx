export default function MacroChart({ protein, carbs, fat }) {
  const total = protein * 4 + carbs * 4 + fat * 9;
  const proteinPct = total > 0 ? ((protein * 4) / total) * 100 : 33;
  const carbsPct = total > 0 ? ((carbs * 4) / total) * 100 : 34;
  const fatPct = total > 0 ? ((fat * 9) / total) * 100 : 33;

  const proteinEnd = proteinPct;
  const carbsEnd = proteinEnd + carbsPct;

  const gradient = `conic-gradient(
    #E8FF3B 0% ${proteinEnd}%,
    #FF4545 ${proteinEnd}% ${carbsEnd}%,
    #3b82f6 ${carbsEnd}% 100%
  )`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
      {/* Ring */}
      <div
        style={{
          width: '140px',
          height: '140px',
          borderRadius: '50%',
          background: gradient,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: 'var(--bg-card)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span
            className="font-mono"
            style={{ fontSize: '11px', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.4 }}
          >
            MACROS
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {[
          { label: 'Protein', value: protein, unit: 'g', color: '#E8FF3B', pct: proteinPct },
          { label: 'Carbs', value: carbs, unit: 'g', color: '#FF4545', pct: carbsPct },
          { label: 'Fat', value: fat, unit: 'g', color: '#3b82f6', pct: fatPct },
        ].map((macro) => (
          <div key={macro.label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: macro.color,
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: 'var(--muted)', fontSize: '13px' }}>{macro.label}</span>
              </div>
              <span
                className="font-mono"
                style={{ color: macro.color, fontSize: '14px', fontWeight: 500 }}
              >
                {macro.value}g
              </span>
            </div>
            {/* Bar */}
            <div
              style={{
                height: '4px',
                background: 'var(--border)',
                borderRadius: '2px',
                overflow: 'hidden',
                width: '180px',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${macro.pct}%`,
                  background: macro.color,
                  borderRadius: '2px',
                  transition: 'width 0.6s ease',
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
