// components/LoadingFallback.tsx
export default function LoadingFallback() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      background: 'var(--background-color)'
    }}>
      <div className="spinner" />
    </div>
  );
}