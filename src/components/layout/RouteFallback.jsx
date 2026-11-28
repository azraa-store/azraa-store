import HeroWordmark from '../home/HeroWordmark.jsx';

export default function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="route-fallback__mark">
        <HeroWordmark />
        <span className="u-visually-hidden">AZRAA</span>
      </span>
    </div>
  );
}
