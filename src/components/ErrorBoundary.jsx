import { Component } from 'react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 99999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#fef2f2', fontFamily: 'monospace', fontSize: 13,
          padding: '2rem',
        }}>
          <div style={{ maxWidth: 600, background: '#fff', borderRadius: 12, padding: '1.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#991b1b', margin: '0 0 8px', fontSize: 16 }}>⚠️ App Error</h2>
            <p style={{ color: '#7f1d1d', margin: '0 0 12px', lineHeight: 1.5 }}>
              <strong>{this.state.error.message}</strong>
            </p>
            <pre style={{
              fontSize: 11, color: '#374151', background: '#f9fafb',
              padding: '0.75rem', borderRadius: 8, overflow: 'auto',
              maxHeight: 200, lineHeight: 1.4,
            }}>
              {this.state.error.stack}
            </pre>
            <button
              onClick={() => { location.reload(true); }}
              style={{
                marginTop: 12, padding: '0.5rem 1rem',
                background: '#059669', color: '#fff', border: 'none',
                borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
