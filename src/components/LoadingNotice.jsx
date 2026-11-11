import { useEffect, useState } from 'react';

// Aviso de carregamento. A API roda em hospedagem gratuita que "dorme" quando fica
// parada; se a resposta demora, explicamos o motivo em vez de parecer travado.
export default function LoadingNotice() {
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="api-status loading-notice" role="status" aria-live="polite">
      <span className="loading-lens" aria-hidden="true" />
      <h3>Carregando Pokémon...</h3>
      {slow && (
        <p>
          O servidor está acordando (a hospedagem gratuita desliga quando fica parada).
          Isso pode levar até 1 minuto na primeira visita.
        </p>
      )}
    </div>
  );
}
