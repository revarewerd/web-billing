// Placeholder Panel - заглушка для панелей которые ещё не реализованы
interface PlaceholderPanelProps {
  title: string;
  icon?: string;
}

export function PlaceholderPanel({ title, icon }: PlaceholderPanelProps) {
  return (
    <div style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center',
      color: '#888',
      padding: 40
    }}>
      {icon && (
        <img 
          src={icon} 
          alt="" 
          style={{ width: 64, height: 64, opacity: 0.5, marginBottom: 16 }} 
        />
      )}
      <h2 style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{title}</h2>
      <p style={{ fontSize: 12 }}>Раздел в разработке</p>
    </div>
  );
}
